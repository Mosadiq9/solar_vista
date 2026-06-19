import type { Metadata } from 'next';
import { PageHeader } from '@/modules/admin/shared/components/ui/PageHeader';
import { WorkflowsPlaceholder } from '@/modules/admin/workflows/components/WorkflowsPlaceholder';

export const metadata: Metadata = { title: 'Workflows' };

export default function WorkflowsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Workflows"
        description="Automation engine — WhatsApp, AI scoring, reminders"
      />
      <WorkflowsPlaceholder />
    </div>
  );
}
