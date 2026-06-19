import type { Metadata } from 'next';
import { PageHeader } from '@/modules/admin/shared/components/ui/PageHeader';
import { FaqTable } from '@/modules/admin/cms/faq/components/FaqTable';

export const metadata: Metadata = { title: 'FAQ — CMS' };

export default function FaqPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="FAQ"
        description="Manage frequently asked questions across all languages"
      />
      <FaqTable />
    </div>
  );
}
