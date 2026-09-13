import express from 'express';
import { globalSearch, autocomplete } from '../controllers/searchController.js';
import { searchLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

// Public routes
router.get('/', searchLimiter, globalSearch);
router.get('/autocomplete', searchLimiter, autocomplete);

export default router;
