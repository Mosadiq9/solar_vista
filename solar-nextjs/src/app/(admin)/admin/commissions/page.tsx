'use client';

import { useEffect } from 'react';
import { PageHeader } from '@/modules/admin/shared/components/ui/PageHeader';
import { CommissionsTable } from '@/modules/crm/finance/components/CommissionsTable';
import { useFinanceStore } from '@/modules/crm/finance/store/useFinanceStore';

export default function CommissionsPage() {
  const { fetchCommissions } = useFinanceStore();

  useEffect(() => {
    fetchCommissions();
  }, [fetchCommissions]);

  return (
    <div className="space-y-5">
      <PageHeader 
        title="Sales Commissions" 
        description="Track and manage commission payouts for your sales team" 
      />
      <CommissionsTable />
    </div>
  );
}
