import { Router } from 'express';
import {
  register, verifyEmail, login, refresh,
  forgotPassword, resetPassword, logout, getMe
} from '../controllers/authController.js';
import { protect, optionalAuth } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { authLimiter } from '../middlewares/rateLimiter.js';
import { z } from 'zod';

const router = Router();

// Validation schemas
const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['freelancer', 'client']),
    phone: z.string().optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
    rememberMe: z.boolean().optional().default(false),
  }),
});

const verifyEmailSchema = z.object({
  body: z.object({
    email: z.string().email(),
    otp: z.string().length(6),
  }),
});

const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    password: z.string().min(6),
  }),
  params: z.object({
    token: z.string(),
  }),
});

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/verify-email', authLimiter, validate(verifyEmailSchema), verifyEmail);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password/:token', validate(resetPasswordSchema), resetPassword);
router.post('/logout', optionalAuth, logout);
router.get('/me', protect, getMe);

export default router;
