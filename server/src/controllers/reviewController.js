import Review from '../models/Review.js';
import Contract from '../models/Contract.js';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { createNotification } from '../services/notificationService.js';

export const createReview = async (req, res, next) => {
  try {
    const { contractId, rating, comment } = req.body;

    const contract = await Contract.findById(contractId);
    if (!contract) throw new ApiError(404, 'Contract not found');

    if (contract.status !== 'completed') {
      throw new ApiError(400, 'Can only review completed contracts');
    }

    if (contract.client.toString() !== req.user._id.toString() && 
        contract.freelancer.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'Not authorized to review this contract');
    }

    const revieweeId = contract.client.toString() === req.user._id.toString() 
      ? contract.freelancer 
      : contract.client;

    const existingReview = await Review.findOne({
      contract: contractId,
      reviewer: req.user._id
    });

    if (existingReview) {
      throw new ApiError(400, 'You have already reviewed this contract');
    }

    // Default nested rating logic if flat passed
    const reviewRating = typeof rating === 'object' ? rating : {
      overall: rating,
      communication: rating,
      quality: rating,
      timeliness: rating,
      professionalism: rating
    };

    const review = await Review.create({
      contract: contractId,
      reviewer: req.user._id,
      reviewee: revieweeId,
      rating: reviewRating,
      comment
    });

    const stats = await Review.aggregate([
      { $match: { reviewee: revieweeId } },
      { $group: { _id: null, avgRating: { $avg: '$rating.overall' }, count: { $sum: 1 } } }
    ]);

    if (stats.length > 0) {
      await User.findByIdAndUpdate(revieweeId, {
        ratingsAverage: Math.round(stats[0].avgRating * 10) / 10,
        ratingsCount: stats[0].count
      });
    }

    await createNotification({
      receiver: revieweeId,
      sender: req.user._id,
      type: 'system',
      title: 'New Review Received',
      message: `You received a new review of ${reviewRating.overall} stars`,
      linkUrl: `/profile/${revieweeId}`,
      io: req.app.get('io')
    });

    res.status(201).json(new ApiResponse(201, review, 'Review created successfully'));
  } catch (error) {
    next(error);
  }
};

export const getUserReviews = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find({ reviewee: userId })
      .populate('reviewer', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ reviewee: userId });

    const ratingBreakdownRaw = await Review.aggregate([
      { $match: { reviewee: userId } },
      {
        $group: {
          _id: { $floor: '$rating.overall' },
          count: { $sum: 1 }
        }
      }
    ]);

    const ratingBreakdown = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    };
    ratingBreakdownRaw.forEach(item => {
      if(item._id >= 1 && item._id <= 5) {
        ratingBreakdown[item._id] = item.count;
      }
    });

    res.status(200).json(new ApiResponse(200, {
      reviews,
      ratingBreakdown,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    }, 'User reviews fetched successfully'));
  } catch (error) {
    next(error);
  }
};

export const getPublicReviews = async (req, res, next) => {
  try {
    const { limit = 8 } = req.query;
    const reviews = await Review.find()
      .populate('reviewer', 'name avatar title company location')
      .populate('reviewee', 'name avatar title skills location')
      .populate({
        path: 'contract',
        select: 'title budget totalAmount',
        populate: { path: 'job', select: 'title category' }
      })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json(new ApiResponse(200, { reviews }, 'Public reviews fetched successfully'));
  } catch (error) {
    next(error);
  }
};

