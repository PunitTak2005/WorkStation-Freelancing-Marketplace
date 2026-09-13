import { z } from 'zod';
import { CATEGORIES } from '../constants/index.js';

const categoryEnum =
  Array.isArray(CATEGORIES) && CATEGORIES.length > 0
    ? z.enum([CATEGORIES[0], ...CATEGORIES.slice(1)])
    : z.string();

export const projectValidator = z.object({
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
