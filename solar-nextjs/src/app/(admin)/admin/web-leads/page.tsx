'use client';

import { useEffect } from 'react';
import { PageHeader } from '@/modules/admin/shared/components/ui/PageHeader';
import { WebLeadsTable } from '@/modules/crm/leads/components/WebLeadsTable';
import { useLeadsStore } from '@/modules/crm/leads/store/useLeadsStore';

export default function WebLeadsPage() {
  const { fetchWebLeads } = useLeadsStore();

  useEffect(() => {
    fetchWebLeads();
  }, [fetchWebLeads]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <PageHeader title="Web Leads" description="Raw contact form submissions from the public website" />
      </div>

      <WebLeadsTable />
    </div>
  );
}
