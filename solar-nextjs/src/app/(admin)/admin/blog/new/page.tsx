'use client';

import type { Metadata } from 'next';
import { useRouter } from 'next/navigation';
import { BlogForm } from '@/modules/admin/cms/blog/components/BlogForm';
import { useAdminUIStore } from '@/modules/admin/shared/store/adminUIStore';
import type { BlogFormInput } from '@/modules/admin/cms/blog/validation/blogSchema';

export default function NewBlogPage() {
  const router = useRouter();
  const { addToast } = useAdminUIStore();

  const handleSubmit = async (data: BlogFormInput) => {
    // TODO: Save to Supabase
    console.log('Create blog post:', data);
    addToast({
      type: 'success',
      title: 'Post created',
      message: `"${data.title}" has been saved.`,
    });
    router.push('/admin/blog');
  };

  return <BlogForm onSubmit={handleSubmit} mode="create" />;
}
