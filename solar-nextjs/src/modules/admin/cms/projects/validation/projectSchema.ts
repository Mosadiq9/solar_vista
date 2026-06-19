import { z } from 'zod';

export const projectFormSchema = z.object({
  title: z.string().min(3, 'Title required').max(200),
  city: z.string().min(2, 'City required').max(100),
  state: z.string().min(2, 'State required').max(100),
  propertyType: z.enum(['residential', 'commercial', 'industrial']),
  systemSizeKw: z.number().min(0.5, 'Min 0.5 kW').max(10000, 'Max 10,000 kW'),
  annualSavingsInr: z.number().min(0),
  co2OffsetTons: z.number().min(0),
  featured: z.boolean(),
  coverImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  completedAt: z.string().min(1, 'Completion date required'),
});

export type ProjectFormInput = z.infer<typeof projectFormSchema>;

export const PROPERTY_TYPES = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'industrial', label: 'Industrial' },
] as const;

export const INDIA_STATES = [
  'Gujarat',
  'Maharashtra',
  'Rajasthan',
  'Madhya Pradesh',
  'Uttar Pradesh',
  'Karnataka',
  'Tamil Nadu',
  'Telangana',
  'Andhra Pradesh',
  'Punjab',
  'Haryana',
  'Delhi',
  'West Bengal',
  'Odisha',
  'Chhattisgarh',
] as const;
