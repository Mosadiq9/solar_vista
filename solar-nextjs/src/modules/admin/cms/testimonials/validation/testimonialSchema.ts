import { z } from 'zod';

export const testimonialFormSchema = z.object({
  customerName: z.string().min(2, 'Name required').max(100),
  city: z.string().min(2, 'City required').max(100),
  systemSize: z.string().min(1, 'System size required'),
  rating: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  quote: z.string().min(20, 'Quote too short').max(1000, 'Quote too long'),
  verified: z.boolean(),
  featured: z.boolean(),
  avatarUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

export type TestimonialFormInput = z.infer<typeof testimonialFormSchema>;
