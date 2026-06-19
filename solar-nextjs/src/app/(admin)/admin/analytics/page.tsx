import type { Metadata } from 'next';
import { PageHeader } from '@/modules/admin/shared/components/ui/PageHeader';
import { AnalyticsDashboard } from '@/modules/admin/analytics/components/AnalyticsDashboard';

export const metadata: Metadata = { title: 'Analytics' };

export default function AnalyticsPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Analytics" description="Lead intelligence and performance metrics" />
      <AnalyticsDashboard />
    </div>
  );
}
