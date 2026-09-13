import express from 'express';
import { 
    submitProposal, 
    getJobProposals, 
    getMyProposals, 
    getProposalById, 
    updateProposalStatus,
    withdrawProposal
} from '../controllers/proposalController.js';
import { protect, authorize } from '../middlewares/auth.js';

// mergeParams to allow access to jobId from jobRoutes
const router = express.Router({ mergeParams: true }); 

router.use(protect);

// Nested routes (mounted via jobRoutes as /api/jobs/:jobId/proposals)
router.post('/', authorize('freelancer'), submitProposal);
router.get('/', authorize('client'), getJobProposals);

// Standalone routes (mounted via main app as /api/proposals)
// These will respond to /api/proposals/...
router.post('/', authorize('freelancer'), submitProposal);
router.get('/my-proposals', authorize('freelancer'), getMyProposals);
router.get('/me', authorize('freelancer'), getMyProposals);
router.delete('/:id', authorize('freelancer'), withdrawProposal);
router.put('/:id/withdraw', authorize('freelancer'), withdrawProposal);
router.get('/:id', getProposalById);
router.put('/:id/status', updateProposalStatus);

export default router;
