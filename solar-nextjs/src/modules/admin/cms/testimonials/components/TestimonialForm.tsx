'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, Star } from 'lucide-react';
import Link from 'next/link';
import {
  testimonialFormSchema,
  type TestimonialFormInput,
} from '@/modules/admin/cms/testimonials/validation/testimonialSchema';
import { FormField } from '@/modules/admin/shared/components/forms/FormField';
import { FormTextarea } from '@/modules/admin/shared/components/forms/FormTextarea';
import { FormToggle } from '@/modules/admin/shared/components/forms/FormToggle';
import { AdminCard } from '@/modules/admin/shared/components/ui/AdminCard';

interface TestimonialFormProps {
  defaultValues?: Partial<TestimonialFormInput>;
  onSubmit: (data: TestimonialFormInput) => void;
  isSubmitting?: boolean;
  mode?: 'create' | 'edit';
}

export function TestimonialForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  mode = 'create',
}: TestimonialFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TestimonialFormInput>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: { rating: 5, verified: false, featured: false, ...defaultValues },
  });

  const rating = watch('rating');
  const verified = watch('verified');
  const featured = watch('featured');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/testimonials"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="flex-1 font-display text-lg font-bold text-white">
          {mode === 'create' ? 'New Testimonial' : 'Edit Testimonial'}
        </h1>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-brand-bg transition-colors hover:bg-brand-primary-light disabled:opacity-50"
        >
          <Save className="h-3.5 w-3.5" />
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <AdminCard padding="md">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="Customer Name"
                  required
                  placeholder="Rajesh Patel"
                  {...register('customerName')}
                  error={errors.customerName?.message}
                />
                <FormField
                  label="City"
                  required
                  placeholder="Surat"
                  {...register('city')}
                  error={errors.city?.message}
                />
              </div>
              <FormField
                label="System Size"
                required
                placeholder="10 kW"
                {...register('systemSize')}
                error={errors.systemSize?.message}
              />
              <FormTextarea
                label="Quote / Review"
                required
                rows={4}
                placeholder="The installation was seamless and our savings are incredible..."
                {...register('quote')}
                error={errors.quote?.message}
              />
            </div>
          </AdminCard>
        </div>

        <div className="space-y-4">
          <AdminCard padding="md">
            <h3 className="mb-4 font-display text-xs font-semibold uppercase tracking-wide text-white/40">
              Rating
            </h3>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setValue('rating', star as TestimonialFormInput['rating'])}
                >
                  <Star
                    className={`h-6 w-6 transition-colors ${star <= rating ? 'fill-brand-primary text-brand-primary' : 'text-white/20'}`}
                  />
                </button>
              ))}
            </div>
          </AdminCard>

          <AdminCard padding="md">
            <h3 className="mb-3 font-display text-xs font-semibold uppercase tracking-wide text-white/40">
              Settings
            </h3>
            <div className="space-y-3">
              <FormToggle
                label="Verified"
                description="Mark as a verified customer"
                checked={verified}
                onChange={(v) => setValue('verified', v)}
              />
              <FormToggle
                label="Featured"
                description="Show on homepage"
                checked={featured}
                onChange={(v) => setValue('featured', v)}
              />
            </div>
          </AdminCard>
        </div>
      </div>
    </form>
  );
}
