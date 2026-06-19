'use client';

import { useEffect } from 'react';
import { PageHeader } from '@/modules/admin/shared/components/ui/PageHeader';
import { TicketsTable } from '@/modules/crm/support/components/TicketsTable';
import { useSupportStore } from '@/modules/crm/support/store/useSupportStore';

export default function SupportTicketsPage() {
  const { fetchTickets } = useSupportStore();

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return (
    <div className="space-y-5">
      <PageHeader 
        title="Support Tickets" 
        description="Manage customer complaints, inverter errors, and troubleshooting requests" 
      />
      <TicketsTable />
    </div>
  );
}
