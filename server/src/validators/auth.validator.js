import { z } from 'zod';

export const registerValidator = z.object({
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

export const loginValidator = z.object({
  body: z.object({
    email: z.string().trim().email('Invalid email address').toLowerCase(),
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().optional().default(false),
  }),
});

export const verifyEmailValidator = z.object({
  body: z.object({
    email: z.string().trim().email('Invalid email address').toLowerCase(),
    otp: z.string().regex(/^\d{6}$/, 'OTP must be exactly 6 digits'),
  }),
});

export const forgotPasswordValidator = z.object({
  body: z.object({
    email: z.string().trim().email('Invalid email address').toLowerCase(),
  }),
});

export const resetPasswordValidator = z.object({
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
