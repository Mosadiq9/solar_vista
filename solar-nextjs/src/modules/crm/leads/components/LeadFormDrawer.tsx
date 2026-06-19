'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Drawer } from '@/modules/admin/shared/components/ui';
import { useLeadsStore } from '../store/useLeadsStore';

const leadFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian number'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  source: z.enum(['website', 'whatsapp', 'referral', 'social', 'direct', 'manual']),
  system_kw: z.number().min(1).max(500).optional().or(z.nan()),
  status: z.enum(['new', 'contacted', 'qualified', 'proposal', 'closed', 'lost']),
  notes: z.string().optional(),
});

type LeadFormValues = z.infer<typeof leadFormSchema>;

interface LeadFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LeadFormDrawer({ isOpen, onClose }: LeadFormDrawerProps) {
  const { addLead } = useLeadsStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      source: 'manual',
      status: 'new',
    },
  });

  const onSubmit = async (data: LeadFormValues) => {
    try {
      await addLead({
        ...data,
        email: data.email || null,
        address: data.address || null,
        city: data.city || null,
        state: data.state || null,
        system_kw: data.system_kw || null,
        rooftop_area: null,
        monthly_bill: null,
        assigned_to: null,
        notes: data.notes || null,
      });
      reset();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Lead"
      description="Enter the lead details to add them to your CRM."
      width="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-brand-primary">Basic Information</h3>
          
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/70">Full Name *</label>
            <input
              {...register('name')}
              className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-brand-primary/50 focus:bg-brand-primary/5 transition-all"
              placeholder="e.g. Rahul Sharma"
            />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/70">Phone *</label>
              <input
                {...register('phone')}
                className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm text-white outline-none focus:border-brand-primary/50 focus:bg-brand-primary/5"
                placeholder="9876543210"
              />
              {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/70">Email</label>
              <input
                {...register('email')}
                className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm text-white outline-none focus:border-brand-primary/50 focus:bg-brand-primary/5"
                placeholder="rahul@example.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="space-y-4 pt-4 border-t border-white/[0.06]">
          <h3 className="text-sm font-medium text-brand-primary">Lead Requirements</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/70">System Size (KW)</label>
              <input
                type="number"
                step="0.1"
                {...register('system_kw', { valueAsNumber: true })}
                className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm text-white outline-none focus:border-brand-primary/50 focus:bg-brand-primary/5"
                placeholder="e.g. 5"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/70">Source</label>
              <select
                {...register('source')}
                className="w-full rounded-lg border border-white/[0.06] bg-brand-surface-2 px-3 py-2 text-sm text-white outline-none focus:border-brand-primary/50"
              >
                <option value="manual">Manual Entry</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="referral">Referral</option>
                <option value="website">Website</option>
                <option value="social">Social Media</option>
                <option value="direct">Direct</option>
              </select>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="space-y-4 pt-4 border-t border-white/[0.06]">
          <h3 className="text-sm font-medium text-brand-primary">Location</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/70">City</label>
              <input
                {...register('city')}
                className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm text-white outline-none focus:border-brand-primary/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/70">State</label>
              <input
                {...register('state')}
                className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm text-white outline-none focus:border-brand-primary/50"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 pb-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white/60 hover:bg-white/[0.05] hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-brand-primary px-5 py-2 text-sm font-semibold text-brand-bg hover:bg-brand-primary/90 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'Saving...' : 'Save Lead'}
          </button>
        </div>
      </form>
    </Drawer>
  );
}
