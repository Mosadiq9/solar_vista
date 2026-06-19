'use client';

import { useRouter } from 'next/navigation';
import { BlogForm } from '@/modules/admin/cms/blog/components/BlogForm';
import { useAdminUIStore } from '@/modules/admin/shared/store/adminUIStore';
import type { BlogFormInput } from '@/modules/admin/cms/blog/validation/blogSchema';

export default function EditBlogPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { addToast } = useAdminUIStore();

  const handleSubmit = async (data: BlogFormInput) => {
    // TODO: Update in Supabase
    console.log('Update blog post:', params.id, data);
    addToast({
      type: 'success',
      title: 'Post updated',
      message: `"${data.title}" has been saved.`,
    });
    router.push('/admin/blog');
  };

  return <BlogForm onSubmit={handleSubmit} mode="edit" />;
}
