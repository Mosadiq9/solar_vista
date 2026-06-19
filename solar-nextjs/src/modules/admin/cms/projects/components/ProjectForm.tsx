'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import {
  projectFormSchema,
  PROPERTY_TYPES,
  INDIA_STATES,
  type ProjectFormInput,
} from '@/modules/admin/cms/projects/validation/projectSchema';
import { FormField } from '@/modules/admin/shared/components/forms/FormField';
import { FormSelect } from '@/modules/admin/shared/components/forms/FormSelect';
import { FormToggle } from '@/modules/admin/shared/components/forms/FormToggle';
import { AdminCard } from '@/modules/admin/shared/components/ui/AdminCard';

interface ProjectFormProps {
  defaultValues?: Partial<ProjectFormInput>;
  onSubmit: (data: ProjectFormInput) => void;
  isSubmitting?: boolean;
  mode?: 'create' | 'edit';
}

export function ProjectForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  mode = 'create',
}: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormInput>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: { featured: false, propertyType: 'residential', ...defaultValues },
  });

  const featured = watch('featured');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/projects"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="flex-1 font-display text-lg font-bold text-white">
          {mode === 'create' ? 'New Project' : 'Edit Project'}
        </h1>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-brand-bg transition-colors hover:bg-brand-primary-light disabled:opacity-50"
        >
          <Save className="h-3.5 w-3.5" />
          {isSubmitting ? 'Saving...' : 'Save Project'}
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <AdminCard padding="md">
            <div className="space-y-4">
              <FormField
                label="Project Title"
                required
                placeholder="Patel Residence — 10kW Rooftop Solar"
                {...register('title')}
                error={errors.title?.message}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="City"
                  required
                  placeholder="Surat"
                  {...register('city')}
                  error={errors.city?.message}
                />
                <FormSelect
                  label="State"
                  options={INDIA_STATES.map((s) => ({ value: s, label: s }))}
                  placeholder="Select state"
                  {...register('state')}
                  error={errors.state?.message}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormSelect
                  label="Property Type"
                  options={[...PROPERTY_TYPES]}
                  {...register('propertyType')}
                  error={errors.propertyType?.message}
                />
                <FormField
                  label="Completion Date"
                  required
                  type="date"
                  {...register('completedAt')}
                  error={errors.completedAt?.message}
                />
              </div>
            </div>
          </AdminCard>

          <AdminCard padding="md">
            <h3 className="mb-4 font-display text-sm font-semibold text-white">Performance Data</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                label="System Size (kW)"
                required
                type="number"
                step="0.5"
                min="0.5"
                placeholder="10"
                {...register('systemSizeKw', { valueAsNumber: true })}
                error={errors.systemSizeKw?.message}
              />
              <FormField
                label="Annual Savings (₹)"
                type="number"
                min="0"
                placeholder="120000"
                {...register('annualSavingsInr', { valueAsNumber: true })}
                error={errors.annualSavingsInr?.message}
              />
              <FormField
                label="CO₂ Offset (tons/yr)"
                type="number"
                step="0.1"
                min="0"
                placeholder="8.4"
                {...register('co2OffsetTons', { valueAsNumber: true })}
                error={errors.co2OffsetTons?.message}
              />
            </div>
          </AdminCard>
        </div>

        <div className="space-y-4">
          <AdminCard padding="md">
            <h3 className="mb-3 font-display text-xs font-semibold uppercase tracking-wide text-white/40">
              Settings
            </h3>
            <FormToggle
              label="Featured"
              description="Highlight on homepage and projects page"
              checked={featured}
              onChange={(v) => setValue('featured', v)}
            />
          </AdminCard>
          <AdminCard padding="md">
            <h3 className="mb-3 font-display text-xs font-semibold uppercase tracking-wide text-white/40">
              Media
            </h3>
            <FormField
              label="Cover Image URL"
              placeholder="https://..."
              {...register('coverImage')}
              error={errors.coverImage?.message}
              hint="Gallery upload coming soon"
            />
          </AdminCard>
        </div>
      </div>
    </form>
  );
}
