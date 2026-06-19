import { z } from 'zod';

export const leadStatusSchema = z.enum([
  'new',
  'contacted',
  'qualified',
  'proposal_sent',
  'converted',
  'closed',
]);

export const leadNoteSchema = z.object({
  content: z.string().min(1, 'Note cannot be empty').max(2000, 'Note too long'),
});

export const updateLeadSchema = z.object({
  status: leadStatusSchema.optional(),
  assignedTo: z.string().optional(),
  followUpAt: z.number().optional(),
  notes: z.string().max(5000).optional(),
});

export type LeadNoteInput = z.infer<typeof leadNoteSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
