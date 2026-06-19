import { z } from 'zod';

export const faqFormSchema = z.object({
  question: z.string().min(10, 'Question too short').max(300, 'Question too long'),
  answer: z.string().min(20, 'Answer too short').max(2000, 'Answer too long'),
  category: z.string().min(1, 'Category required'),
  locale: z.enum(['en', 'hi', 'gu']),
  order: z.number().min(0),
  published: z.boolean(),
});

export type FaqFormInput = z.infer<typeof faqFormSchema>;

export const FAQ_CATEGORIES = [
  'Installation',
  'Pricing & Finance',
  'Savings & ROI',
  'Technical',
  'Government Subsidies',
  'Maintenance',
  'Warranty',
] as const;
