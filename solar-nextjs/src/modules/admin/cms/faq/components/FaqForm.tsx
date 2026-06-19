'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import {
  faqFormSchema,
  FAQ_CATEGORIES,
  type FaqFormInput,
} from '@/modules/admin/cms/faq/validation/faqSchema';
import { FormField } from '@/modules/admin/shared/components/forms/FormField';
import { FormSelect } from '@/modules/admin/shared/components/forms/FormSelect';
import { FormTextarea } from '@/modules/admin/shared/components/forms/FormTextarea';
import { FormToggle } from '@/modules/admin/shared/components/forms/FormToggle';
import { AdminCard } from '@/modules/admin/shared/components/ui/AdminCard';

interface FaqFormProps {
  defaultValues?: Partial<FaqFormInput>;
  onSubmit: (data: FaqFormInput) => void;
  isSubmitting?: boolean;
  mode?: 'create' | 'edit';
}

const LOCALE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'gu', label: 'Gujarati' },
];

export function FaqForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  mode = 'create',
}: FaqFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FaqFormInput>({
    resolver: zodResolver(faqFormSchema),
    defaultValues: { published: false, locale: 'en', order: 0, ...defaultValues },
  });

  const published = watch('published');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-5">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/faq"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="flex-1 font-display text-lg font-bold text-white">
          {mode === 'create' ? 'New FAQ' : 'Edit FAQ'}
        </h1>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-brand-bg transition-colors hover:bg-brand-primary-light disabled:opacity-50"
        >
          <Save className="h-3.5 w-3.5" />
          {isSubmitting ? 'Saving...' : 'Save FAQ'}
        </button>
      </div>

      <AdminCard padding="md">
        <div className="space-y-4">
          <FormTextarea
            label="Question"
            required
            rows={2}
            placeholder="How much does solar installation cost?"
            {...register('question')}
            error={errors.question?.message}
          />
          <FormTextarea
            label="Answer"
            required
            rows={5}
            placeholder="Provide a clear, helpful answer..."
            {...register('answer')}
            error={errors.answer?.message}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <FormSelect
              label="Category"
              options={FAQ_CATEGORIES.map((c) => ({ value: c, label: c }))}
              placeholder="Select category"
              {...register('category')}
              error={errors.category?.message}
            />
            <FormSelect label="Language" options={LOCALE_OPTIONS} {...register('locale')} />
            <FormField
              label="Order"
              type="number"
              min={0}
              placeholder="0"
              {...register('order', { valueAsNumber: true })}
              error={errors.order?.message}
              hint="Lower = shown first"
            />
          </div>
          <FormToggle
            label="Published"
            description="Show this FAQ on the website"
            checked={published}
            onChange={(v) => setValue('published', v)}
          />
        </div>
      </AdminCard>
    </form>
  );
}
