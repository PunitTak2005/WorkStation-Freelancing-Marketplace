import express from 'express';
import { z } from 'zod';
import { validate } from '../middlewares/validate.js';
import { protect, authorize } from '../middlewares/auth.js';
import { uploadMultiple } from '../middlewares/upload.js';
import {
  getContracts,
  getContractById,
  fundMilestone,
  verifyMilestonePayment,
  submitWork,
  approveMilestone,
  requestRevision,
  acceptContract,
  declineContract
} from '../controllers/contractController.js';

const router = express.Router();

router.use(protect);

router.get('/', getContracts);
router.get('/:id', getContractById);

router.post(
  '/:id/milestones/:milestoneIndex/fund',
  authorize('client'),
  fundMilestone
);

const verifyPaymentSchema = z.object({
  body: z.object({
    razorpay_order_id: z.string({ required_error: 'razorpay_order_id is required' }),
    razorpay_payment_id: z.string({ required_error: 'razorpay_payment_id is required' }),
    razorpay_signature: z.string({ required_error: 'razorpay_signature is required' }),
  })
});

router.post(
  '/:id/milestones/:milestoneIndex/verify-payment',
  authorize('client'),
  validate(verifyPaymentSchema),
  verifyMilestonePayment
);

const submitWorkSchema = z.object({
  body: z.object({
    description: z.string({ required_error: 'Description is required' }).min(10, 'Description must be at least 10 characters'),
  })
});

router.post(
  '/:id/milestones/:milestoneIndex/submit',
  authorize('freelancer'),
  uploadMultiple,
  validate(submitWorkSchema),
  submitWork
);

router.post(
  '/:id/milestones/:milestoneIndex/approve',
  authorize('client'),
  approveMilestone
);

router.post(
  '/:id/milestones/:milestoneIndex/revision',
  authorize('client'),
  requestRevision
);

// Pending contract actions (freelancer only)
router.patch('/:id/accept', authorize('freelancer'), acceptContract);
router.patch('/:id/decline', authorize('freelancer'), declineContract);

export default router;
