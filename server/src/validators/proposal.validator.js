import { z } from 'zod';

export const proposalValidator = z.object({
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
