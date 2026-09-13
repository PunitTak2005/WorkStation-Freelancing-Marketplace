import { Router } from 'express';
import {
  getClientDashboard,
  getFreelancerDashboard,
  getPublicStats
} from '../controllers/dashboardController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = Router();

// Public Platform Metrics
router.get('/public-stats', getPublicStats);

// Protected Role Dashboards
router.use(protect);
router.get('/client', authorize('client', 'admin'), getClientDashboard);
router.get('/freelancer', authorize('freelancer'), getFreelancerDashboard);

export default router;
