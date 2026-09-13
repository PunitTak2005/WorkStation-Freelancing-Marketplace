import express from 'express';
import {
  getFreelancers,
  getFeaturedFreelancers,
  getPublicProfile
} from '../controllers/userController.js';

const router = express.Router();

// Public freelancer discovery endpoints
router.get('/featured', getFeaturedFreelancers);
router.get('/', getFreelancers);
router.get('/:id', getPublicProfile);

export default router;
