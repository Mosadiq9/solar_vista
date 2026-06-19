'use client';

import { useEffect } from 'react';
import { PageHeader } from '@/modules/admin/shared/components/ui/PageHeader';
import { WiringStockTable } from '@/modules/crm/logistics/components/WiringStockTable';
import { useLogisticsStore } from '@/modules/crm/logistics/store/useLogisticsStore';

export default function WiringInventoryPage() {
  const { fetchWiring } = useLogisticsStore();

  useEffect(() => {
    fetchWiring();
  }, [fetchWiring]);

  return (
    <div className="space-y-5">
      <PageHeader 
        title="Wiring & Electrical Stock" 
        description="Manage AC/DC cables, earthing wires, and gauge specifications" 
      />
      <WiringStockTable />
    </div>
  );
}
