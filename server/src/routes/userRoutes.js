import express from 'express';
import { 
    getProfile, 
    updateProfile, 
    updateAvatar, 
    addPortfolioItem, 
    deletePortfolioItem, 
    getPublicProfile, 
    getFreelancers, 
    getFeaturedFreelancers 
} from '../controllers/userController.js';
import { protect, authorize } from '../middlewares/auth.js';
import { uploadSingle, uploadMultiple } from '../middlewares/upload.js';

const router = express.Router();

// Public routes for featured freelancers and directory
router.get('/featured-freelancers', getFeaturedFreelancers);
router.get('/freelancers/featured', getFeaturedFreelancers);
router.get('/freelancers', getFreelancers);

// Protected routes for current user profile (must precede /:id)
router.get('/profile', protect, getProfile);
router.get('/profile/me', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/avatar', protect, uploadSingle('avatar'), updateAvatar);

// Freelancer specific routes
router.post('/portfolio', protect, authorize('freelancer'), uploadMultiple('images', 5), addPortfolioItem);
router.delete('/portfolio/:itemId', protect, authorize('freelancer'), deletePortfolioItem);

// Public dynamic profile route (must be at the bottom)
router.get('/:id', getPublicProfile);

export default router;
