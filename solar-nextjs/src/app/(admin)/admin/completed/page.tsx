'use client';

import { useEffect } from 'react';
import { PageHeader } from '@/modules/admin/shared/components/ui/PageHeader';
import { PortfolioTable } from '@/modules/crm/support/components/PortfolioTable';
import { useSupportStore } from '@/modules/crm/support/store/useSupportStore';

export default function CompletedPortfolioPage() {
  const { fetchPortfolio } = useSupportStore();

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  return (
    <div className="space-y-5">
      <PageHeader 
        title="Completed Portfolio" 
        description="View all fully installed and handed-over active solar systems" 
      />
      <PortfolioTable />
    </div>
  );
}
