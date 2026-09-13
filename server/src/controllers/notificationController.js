import Notification from '../models/Notification.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getNotifications = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find({ receiver: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('sender', 'name avatar'),
      Notification.countDocuments({ receiver: req.user._id }),
      Notification.countDocuments({ receiver: req.user._id, read: false })
    ]);

    const pagination = {
      total,
      page,
      pages: Math.ceil(total / limit)
    };

    return res.status(200).json(new ApiResponse(200, {
      notifications,
      pagination,
      unreadCount
    }, 'Notifications fetched successfully'));
  } catch (error) {
    next(error);
  }
};

export const getUnreadCount = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({ 
      receiver: req.user._id, 
      read: false 
    });
    
    return res.status(200).json(new ApiResponse(200, { count }, 'Unread count fetched successfully'));
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, receiver: req.user._id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return next(new ApiError(404, 'Notification not found'));
    }

    return res.status(200).json(new ApiResponse(200, notification, 'Notification marked as read'));
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    const result = await Notification.updateMany(
      { receiver: req.user._id, read: false },
      { read: true }
    );

    return res.status(200).json(new ApiResponse(200, { modifiedCount: result.modifiedCount }, 'All notifications marked as read'));
  } catch (error) {
    next(error);
  }
};
