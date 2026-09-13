import mongoose from 'mongoose';
import { z } from 'zod';
import { ApiError } from '../utils/ApiError.js';
import { CATEGORIES } from '../constants/index.js';

// Centralized schema validation middleware
export const validate = (schema) => (req, res, next) => {
  try {
    const result = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (result.body) req.body = result.body;
    if (result.query) req.query = result.query;
    if (result.params) req.params = result.params;

    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = {};
      error.errors.forEach((err) => {
        const field =
          err.path.filter((p) => p !== 'body' && p !== 'query' && p !== 'params').join('.') ||
          err.path.join('.');
        fieldErrors[field] = err.message;
      });

      const firstMessage = Object.values(fieldErrors)[0] || 'Validation failed';
      return next(new ApiError(400, firstMessage, fieldErrors));
    }
    next(error);
  }
};

// Parameter ObjectId validation middleware
export const validateObjectId = (paramName = 'id') => (req, res, next) => {
  const id = req.params[paramName];
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return next(new ApiError(400, `Invalid ${paramName} identifier format`));
  }
  next();
};

const categoryEnum =
  Array.isArray(CATEGORIES) && CATEGORIES.length > 0
    ? z.enum([CATEGORIES[0], ...CATEGORIES.slice(1)])
    : z.string();

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters'),
    email: z.string().trim().email('Invalid email address').toLowerCase(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    role: z.enum(['freelancer', 'client']),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email('Invalid email address').toLowerCase(),
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().optional().default(false),
  }),
});

export const verifyEmailSchema = z.object({
  body: z.object({
    email: z.string().trim().email('Invalid email address').toLowerCase(),
    otp: z.string().regex(/^\d{6}$/, 'OTP must be exactly 6 digits'),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().trim().email('Invalid email address').toLowerCase(),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  }),
  params: z.object({
    token: z.string().min(1, 'Reset token is required'),
  }),
});

export const jobSchema = z.object({
  body: z.object({
    title: z.string().trim().min(5, 'Title must be at least 5 characters').max(100),
    description: z.string().trim().min(20, 'Description must be at least 20 characters').max(5000),
    category: categoryEnum,
    budget: z.object({
      min: z.number().positive('Minimum budget must be positive'),
      max: z.number().positive('Maximum budget must be positive'),
      type: z.enum(['fixed', 'hourly']),
    }),
    experienceLevel: z.enum(['entry', 'intermediate', 'expert']),
    skillsRequired: z.array(z.string()).min(1, 'At least one skill is required'),
    locationType: z.enum(['remote', 'onsite', 'hybrid']).optional(),
    deadline: z.string().optional(),
  }),
});

export const proposalSchema = z.object({
  body: z.object({
    coverLetter: z.string().trim().min(10, 'Cover letter must be at least 10 characters').max(3000),
    bidAmount: z.number().positive('Bid amount must be greater than 0'),
    deliveryTime: z.number().int().min(1, 'Delivery time must be at least 1 day').max(365),
    milestones: z
      .array(
        z.object({
          title: z.string().trim().min(1, 'Milestone title is required'),
          amount: z.number().positive('Milestone amount must be positive'),
          deadline: z.string().optional(),
        })
      )
      .optional(),
  }),
});

export const reviewSchema = z.object({
  body: z.object({
    rating: z.object({
      communication: z.number().min(1).max(5),
      quality: z.number().min(1).max(5),
      deadline: z.number().min(1).max(5),
      overall: z.number().min(1).max(5),
    }),
    comment: z.string().trim().max(1000).optional(),
  }),
});
