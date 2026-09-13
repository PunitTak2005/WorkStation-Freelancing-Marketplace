import express from 'express';
import { 
    createJob, 
    getJobs, 
    getProjectsCount,
    getJobById, 
    updateJob, 
    deleteJob, 
    getMyJobs, 
    toggleSaveJob, 
    getSavedJobs, 
    getTrendingJobs, 
    getJobCategories 
} from '../controllers/jobController.js';
import { protect, authorize, optionalAuth } from '../middlewares/auth.js';
import { uploadMultiple } from '../middlewares/upload.js';
import proposalRoutes from './proposalRoutes.js';

const router = express.Router();

// Re-route into proposal router for /api/jobs/:jobId/proposals
router.use('/:jobId/proposals', proposalRoutes);

// Public routes
router.get('/', optionalAuth, getJobs);
router.get('/count', getProjectsCount);
router.get('/trending', getTrendingJobs);
router.get('/categories', getJobCategories);

// Protected static routes (MUST be registered before dynamic /:id route)
router.get('/my-jobs', protect, getMyJobs);
router.get('/my-projects', protect, getMyJobs);
router.get('/saved', protect, getSavedJobs);

// Client & Admin job creation (protected)
router.post('/', protect, authorize('client', 'admin'), uploadMultiple('attachments', 5), createJob);

// Dynamic routes (registered after static routes)
router.get('/:id', optionalAuth, getJobById);
router.put('/:id/save', protect, toggleSaveJob);
router.put('/:id', protect, authorize('client', 'admin'), updateJob);
router.delete('/:id', protect, authorize('client', 'admin'), deleteJob);

export default router;
