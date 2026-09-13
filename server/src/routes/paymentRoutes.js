import express from 'express';
import { protect } from '../middlewares/auth.js';
import {
  getPaymentHistory,
  getInvoice
} from '../controllers/paymentController.js';

const router = express.Router();

router.use(protect);

router.get('/history', getPaymentHistory);
router.get('/invoice/:paymentId', getInvoice);

export default router;
