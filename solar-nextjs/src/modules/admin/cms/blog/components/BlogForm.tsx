'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import {
  blogFormSchema,
  BLOG_CATEGORIES,
  type BlogFormInput,
} from '@/modules/admin/cms/blog/validation/blogSchema';
import { FormField } from '@/modules/admin/shared/components/forms/FormField';
import { FormSelect } from '@/modules/admin/shared/components/forms/FormSelect';
import { FormTextarea } from '@/modules/admin/shared/components/forms/FormTextarea';
import { FormToggle } from '@/modules/admin/shared/components/forms/FormToggle';
import { AdminCard } from '@/modules/admin/shared/components/ui/AdminCard';
import { slugify } from '@/lib/utils';

interface BlogFormProps {
  defaultValues?: Partial<BlogFormInput>;
  onSubmit: (data: BlogFormInput) => void;
  isSubmitting?: boolean;
  mode?: 'create' | 'edit';
}

const LOCALE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi (हिन्दी)' },
  { value: 'gu', label: 'Gujarati (ગુજરાતી)' },
];

const CATEGORY_OPTIONS = BLOG_CATEGORIES.map((c) => ({ value: c, label: c }));

export function BlogForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  mode = 'create',
}: BlogFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BlogFormInput>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      published: false,
      featured: false,
      locale: 'en',
      tags: [],
      ...defaultValues,
    },
  });

  const title = watch('title');
  const published = watch('published');
  const featured = watch('featured');

  const handleTitleBlur = () => {
    if (mode === 'create' && title) {
      setValue('slug', slugify(title), { shouldValidate: true });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/blog"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-lg font-bold text-white">
            {mode === 'create' ? 'New Blog Post' : 'Edit Post'}
          </h1>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-brand-bg transition-colors hover:bg-brand-primary-light disabled:opacity-50"
        >
          <Save className="h-3.5 w-3.5" />
          {isSubmitting ? 'Saving...' : 'Save Post'}
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-4 lg:col-span-2">
          <AdminCard padding="md">
            <div className="space-y-4">
              <FormField
                label="Title"
                required
                placeholder="How Solar Energy Can Save Your Electricity Bill by 90%"
                {...register('title')}
                onBlur={handleTitleBlur}
                error={errors.title?.message}
              />
              <FormField
                label="Slug"
                required
                placeholder="how-solar-energy-saves-electricity-bill"
                {...register('slug')}
                error={errors.slug?.message}
                hint="URL-safe identifier. Auto-generated from title."
              />
              <FormTextarea
                label="Excerpt"
                required
                rows={3}
                placeholder="A concise summary shown in blog listings and search results..."
                {...register('excerpt')}
                error={errors.excerpt?.message}
              />
              <FormTextarea
                label="Content (Markdown)"
                required
                rows={16}
                placeholder="# Heading&#10;&#10;Your content here..."
                {...register('content')}
                error={errors.content?.message}
                hint="Full Markdown editor will be integrated soon."
              />
            </div>
          </AdminCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <AdminCard padding="md">
            <h3 className="mb-3 font-display text-xs font-semibold uppercase tracking-wide text-white/40">
              Publishing
            </h3>
            <div className="space-y-3">
              <FormToggle
                label="Published"
                description="Make this post visible on the website"
                checked={published}
                onChange={(v) => setValue('published', v)}
              />
              <FormToggle
                label="Featured"
                description="Highlight this post on the homepage"
                checked={featured}
                onChange={(v) => setValue('featured', v)}
              />
            </div>
          </AdminCard>

          <AdminCard padding="md">
            <h3 className="mb-3 font-display text-xs font-semibold uppercase tracking-wide text-white/40">
              Metadata
            </h3>
            <div className="space-y-3">
              <FormSelect
                label="Category"
                options={CATEGORY_OPTIONS}
                placeholder="Select category"
                {...register('category')}
                error={errors.category?.message}
              />
              <FormSelect
                label="Language"
                options={LOCALE_OPTIONS}
                {...register('locale')}
                error={errors.locale?.message}
              />
              <FormField
                label="Cover Image URL"
                placeholder="https://..."
                {...register('coverImage')}
                error={errors.coverImage?.message}
              />
              <FormField
                label="Read Time (minutes)"
                type="number"
                min={1}
                max={60}
                placeholder="5"
                {...register('readTimeMinutes', { valueAsNumber: true })}
                error={errors.readTimeMinutes?.message}
              />
            </div>
          </AdminCard>

          <AdminCard padding="md">
            <h3 className="mb-3 font-display text-xs font-semibold uppercase tracking-wide text-white/40">
              SEO
            </h3>
            <div className="space-y-3">
              <FormField
                label="SEO Title"
                placeholder="Optimized title (max 70 chars)"
                maxLength={70}
                {...register('seoTitle')}
                error={errors.seoTitle?.message}
              />
              <FormTextarea
                label="SEO Description"
                rows={3}
                placeholder="Meta description (max 160 chars)"
                maxLength={160}
                {...register('seoDescription')}
                error={errors.seoDescription?.message}
              />
            </div>
          </AdminCard>
        </div>
      </div>
    </form>
  );
}
