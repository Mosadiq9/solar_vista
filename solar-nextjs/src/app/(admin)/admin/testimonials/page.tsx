import type { Metadata } from 'next';
import { PageHeader } from '@/modules/admin/shared/components/ui/PageHeader';
import { TestimonialsTable } from '@/modules/admin/cms/testimonials/components/TestimonialsTable';

export const metadata: Metadata = { title: 'Testimonials — CMS' };

export default function TestimonialsPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Testimonials" description="Manage customer reviews and social proof" />
      <TestimonialsTable />
    </div>
  );
}
