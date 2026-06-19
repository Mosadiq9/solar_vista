import { z } from 'zod';

export const blogFormSchema = z.object({
  title: z.string().min(3, 'Title too short').max(200, 'Title too long'),
  slug: z
    .string()
    .min(3, 'Slug too short')
    .max(200)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  excerpt: z.string().min(10, 'Excerpt too short').max(500, 'Excerpt too long'),
  content: z.string().min(50, 'Content too short'),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags'),
  locale: z.enum(['en', 'hi', 'gu']),
  published: z.boolean(),
  featured: z.boolean(),
  coverImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  seoTitle: z.string().max(70, 'SEO title max 70 chars').optional(),
  seoDescription: z.string().max(160, 'SEO description max 160 chars').optional(),
  readTimeMinutes: z.number().min(1).max(60).optional(),
});

export type BlogFormInput = z.infer<typeof blogFormSchema>;

export const BLOG_CATEGORIES = [
  'Solar Energy',
  'Technology',
  'Savings & Finance',
  'Installation',
  'Government Schemes',
  'Case Studies',
  'Industry News',
] as const;
