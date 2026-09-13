import express from 'express';
import { z } from 'zod';
import { validate } from '../middlewares/validate.js';
import { protect } from '../middlewares/auth.js';
import {
  createReview,
  getUserReviews,
  getPublicReviews
} from '../controllers/reviewController.js';

const router = express.Router();

const createReviewSchema = z.object({
  body: z.object({
    contractId: z.string({ required_error: 'Contract ID is required' }),
    rating: z.any({ required_error: 'Rating is required' }),
    comment: z.string({ required_error: 'Comment is required' }).min(10, 'Comment must be at least 10 characters'),
  })
});

router.get('/', getPublicReviews);
router.post('/', protect, validate(createReviewSchema), createReview);
router.get('/user/:userId', getUserReviews);

export default router;
