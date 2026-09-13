import { z } from 'zod';

export const updateProfileValidator = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(50).optional(),
    bio: z.string().trim().max(500, 'Bio cannot exceed 500 characters').optional(),
    title: z.string().trim().max(100).optional(),
    hourlyRate: z.number().min(0).max(50000).optional(),
    location: z.string().trim().max(100).optional(),
    skills: z.array(z.string()).optional(),
    availability: z.enum(['available', 'busy', 'not_available']).optional(),
    companyDescription: z.string().trim().max(1000).optional(),
    industry: z.string().trim().max(100).optional(),
  }),
});
