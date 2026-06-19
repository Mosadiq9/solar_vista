import type { Metadata } from 'next';
import { PageHeader } from '@/modules/admin/shared/components/ui/PageHeader';
import { BlogTable } from '@/modules/admin/cms/blog/components/BlogTable';

export const metadata: Metadata = { title: 'Blog — CMS' };

export default function BlogPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Blog" description="Manage blog posts across all languages" />
      <BlogTable />
    </div>
  );
}
