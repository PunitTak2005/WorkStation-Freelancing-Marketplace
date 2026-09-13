import { Router } from 'express';
import {
  getUsers,
  getAdminUsersStats,
  getUserDetails,
  createUserAdmin,
  updateUserStatus,
  updateUserVerification,
  updateUserRole,
  softDeleteUser,
  restoreUser,
  getAdminJobs,
  getAdminJobsStats,
  getJobDetails,
  updateJobStatus,
  toggleJobFeatured,
  removeJob,
  createDemoJob,
  getAdminPayments,
  getAdminPaymentsStats,
  updatePaymentStatus,
  releaseEscrowPayment,
  refundAdminPayment,
  resolvePaymentDispute,
  getAdminStats,
  getReports,
  updateReport
} from '../controllers/adminController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = Router();

// All admin routes require authentication and admin role
router.use(protect, authorize('admin'));

// User Management Routes
router.get('/users/stats', getAdminUsersStats);
router.get('/users', getUsers);
router.post('/users', createUserAdmin);
router.get('/users/:id/details', getUserDetails);
router.put('/users/:id/status', updateUserStatus);
router.patch('/users/:id/status', updateUserStatus);
router.patch('/users/:id/verify', updateUserVerification);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', softDeleteUser);
router.patch('/users/:id/restore', restoreUser);

// Job Management Routes
router.get('/jobs/stats', getAdminJobsStats);
router.get('/jobs', getAdminJobs);
router.post('/jobs/demo', createDemoJob);
router.get('/jobs/:id/details', getJobDetails);
router.patch('/jobs/:id/status', updateJobStatus);
router.patch('/jobs/:id/feature', toggleJobFeatured);
router.delete('/jobs/:id', removeJob);

// Payment & Platform Stats Routes
router.get('/payments/stats', getAdminPaymentsStats);
router.get('/payments', getAdminPayments);
router.patch('/payments/:id/status', updatePaymentStatus);
router.post('/payments/:id/release', releaseEscrowPayment);
router.post('/payments/:id/refund', refundAdminPayment);
router.post('/payments/:id/resolve-dispute', resolvePaymentDispute);
router.get('/stats', getAdminStats);
router.get('/reports', getReports);
router.patch('/reports/:id', updateReport);

export default router;
