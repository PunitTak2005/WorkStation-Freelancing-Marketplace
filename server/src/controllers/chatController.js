import mongoose from 'mongoose';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadToCloudinary } from '../middlewares/upload.js';

export const createOrGetConversation = async (req, res, next) => {
  try {
    const { participantId, jobId } = req.body;
    
    if (!participantId) {
      return next(new ApiError(400, 'Participant ID is required'));
    }

    if (participantId === req.user._id.toString()) {
      return next(new ApiError(400, 'Cannot create conversation with yourself'));
    }

    const participant = await User.findById(participantId);
    if (!participant) {
      return next(new ApiError(404, 'Participant not found'));
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, participantId], $size: 2 }
    }).populate('participants', 'name avatar status');

    if (conversation) {
      return res.status(200).json(new ApiResponse(200, conversation, 'Conversation fetched successfully'));
    }

    const newConversation = new Conversation({
      participants: [req.user._id, participantId],
      job: jobId || undefined,
      unreadCounts: {
        [req.user._id.toString()]: 0,
        [participantId.toString()]: 0
      }
    });

    await newConversation.save();
    
    const populatedConversation = await Conversation.findById(newConversation._id)
      .populate('participants', 'name avatar status');

    return res.status(201).json(new ApiResponse(201, populatedConversation, 'Conversation created successfully'));
  } catch (error) {
    next(error);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id
    })
      .populate('participants', 'name avatar status')
      .sort({ updatedAt: -1 });

    const formattedConversations = conversations.map(conv => {
      const convObj = conv.toObject();
      const otherUser = convObj.participants.find(p => p._id.toString() !== req.user._id.toString());
      
      return {
        _id: convObj._id,
        otherUser,
        job: convObj.job,
        lastMessage: convObj.lastMessage,
        unreadCount: convObj.unreadCounts ? (convObj.unreadCounts[req.user._id.toString()] || 0) : 0,
        updatedAt: convObj.updatedAt,
        createdAt: convObj.createdAt
      };
    });

    return res.status(200).json(new ApiResponse(200, formattedConversations, 'Conversations fetched successfully'));
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { conversationId, text } = req.body;
    const files = req.files || [];

    if (!text && files.length === 0) {
      return next(new ApiError(400, 'Message text or attachments are required'));
    }

    const conversation = await Conversation.findById(conversationId);
    
    if (!conversation) {
      return next(new ApiError(404, 'Conversation not found'));
    }

    if (!conversation.participants.includes(req.user._id)) {
      return next(new ApiError(403, 'Not a participant in this conversation'));
    }

    const attachments = [];
    if (files.length > 0) {
      for (const file of files) {
        const uploadResult = await uploadToCloudinary(file.buffer, 'chat_attachments');
        attachments.push({
          url: uploadResult.secure_url,
          fileName: file.originalname,
          fileType: file.mimetype,
          fileSize: file.size
        });
      }
    }

    const message = new Message({
      conversation: conversationId,
      sender: req.user._id,
      text: text || '',
      attachments
    });

    await message.save();
    
    const populatedMessage = await Message.findById(message._id).populate('sender', 'name avatar');

    // Update conversation
    conversation.lastMessage = {
      text: text || 'Attachment',
      sender: req.user._id,
      createdAt: message.createdAt
    };

    conversation.participants.forEach(participantId => {
      if (participantId.toString() !== req.user._id.toString()) {
        const currentCount = conversation.unreadCounts.get(participantId.toString()) || 0;
        conversation.unreadCounts.set(participantId.toString(), currentCount + 1);
      }
    });

    await conversation.save();

    // Socket emit
    const io = req.app.get('io');
    if (io) {
      io.to(`conversation_${conversationId}`).emit('new_message', populatedMessage);
      
      // Emit to each participant's personal room for conversation list update
      conversation.participants.forEach(participantId => {
        io.to(`user_${participantId}`).emit('conversation_updated', {
          conversationId,
          lastMessage: conversation.lastMessage,
          unreadCount: conversation.unreadCounts.get(participantId.toString()) || 0
        });
      });
    }

    return res.status(201).json(new ApiResponse(201, populatedMessage, 'Message sent successfully'));
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { before, limit = 30 } = req.query;

    const conversation = await Conversation.findById(conversationId);
    
    if (!conversation) {
      return next(new ApiError(404, 'Conversation not found'));
    }

    if (!conversation.participants.includes(req.user._id)) {
      return next(new ApiError(403, 'Not a participant in this conversation'));
    }

    const query = { conversation: conversationId };
    
    if (before) {
      query._id = { $lt: before };
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit) + 1)
      .populate('sender', 'name avatar');

    const hasMore = messages.length > Number(limit);
    
    if (hasMore) {
      messages.pop(); // Remove the extra item
    }

    return res.status(200).json(new ApiResponse(200, { 
      messages: messages.reverse(), 
      hasMore 
    }, 'Messages fetched successfully'));
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);
    
    if (!conversation) {
      return next(new ApiError(404, 'Conversation not found'));
    }

    if (!conversation.participants.includes(req.user._id)) {
      return next(new ApiError(403, 'Not a participant in this conversation'));
    }

    if (conversation.unreadCounts) {
      conversation.unreadCounts.set(req.user._id.toString(), 0);
      await conversation.save();
    }

    await Message.updateMany(
      { 
        conversation: conversationId, 
        sender: { $ne: req.user._id },
        status: { $ne: 'read' }
      },
      { 
        $set: { status: 'read' } 
      }
    );

    const io = req.app.get('io');
    if (io) {
      io.to("conversation_$conversationId").emit('messages_read', {
        conversationId,
        readerId: req.user._id
      });
      
      io.to("user_${req.user._id}").emit('conversation_updated', {
        conversationId,
        unreadCount: 0
      });
    }

    return res.status(200).json(new ApiResponse(200, null, 'Messages marked as read'));
  } catch (error) {
    next(error);
  }
};
