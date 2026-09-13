import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

export const setupChatHandlers = (io, socket) => {
  const userId = socket.userId;

  // Join a conversation room
  socket.on('join_conversation', async (conversationId) => {
    try {
      // Verify user is a participant
      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: userId,
      });

      if (!conversation) {
        socket.emit('error_message', { message: 'Conversation not found or access denied' });
        return;
      }

      socket.join(`conversation_${conversationId}`);
      console.log(`User ${userId} joined conversation ${conversationId}`);

      // Mark all unread messages in this conversation as read
      await Message.updateMany(
        { conversation: conversationId, sender: { $ne: userId }, isRead: false },
        { isRead: true, readAt: new Date() }
      );

      // Reset unread count for this user
      conversation.unreadCounts.set(userId, 0);
      await conversation.save();

      // Notify sender that messages were read
      const otherParticipant = conversation.participants.find(
        (p) => p.toString() !== userId
      );
      if (otherParticipant) {
        io.to(`user_${otherParticipant}`).emit('messages_read', {
          conversationId,
          readBy: userId,
        });
      }
    } catch (err) {
      console.error('Error joining conversation:', err.message);
      socket.emit('error_message', { message: 'Failed to join conversation' });
    }
  });

  // Leave a conversation room
  socket.on('leave_conversation', (conversationId) => {
    socket.leave(`conversation_${conversationId}`);
    console.log(`User ${userId} left conversation ${conversationId}`);
  });

  // Typing indicators (ephemeral, no DB)
  socket.on('typing_start', ({ conversationId }) => {
    socket.to(`conversation_${conversationId}`).emit('typing_start', {
      userId,
      conversationId,
    });
  });

  socket.on('typing_stop', ({ conversationId }) => {
    socket.to(`conversation_${conversationId}`).emit('typing_stop', {
      userId,
      conversationId,
    });
  });

  // Mark messages as read
  socket.on('mark_read', async ({ conversationId }) => {
    try {
      await Message.updateMany(
        { conversation: conversationId, sender: { $ne: userId }, isRead: false },
        { isRead: true, readAt: new Date() }
      );

      const conversation = await Conversation.findById(conversationId);
      if (conversation) {
        conversation.unreadCounts.set(userId, 0);
        await conversation.save();

        const otherParticipant = conversation.participants.find(
          (p) => p.toString() !== userId
        );
        if (otherParticipant) {
          io.to(`user_${otherParticipant}`).emit('messages_read', {
            conversationId,
            readBy: userId,
          });
        }
      }
    } catch (err) {
      console.error('Error marking messages read:', err.message);
    }
  });
};
