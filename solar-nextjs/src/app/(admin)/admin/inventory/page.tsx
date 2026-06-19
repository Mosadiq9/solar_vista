'use client';

import { useEffect } from 'react';
import { PageHeader } from '@/modules/admin/shared/components/ui/PageHeader';
import { MasterInventoryTable } from '@/modules/crm/logistics/components/MasterInventoryTable';
import { useLogisticsStore } from '@/modules/crm/logistics/store/useLogisticsStore';

export default function InventoryPage() {
  const { fetchInventory } = useLogisticsStore();

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  return (
    <div className="space-y-5">
      <PageHeader 
        title="Master Inventory" 
        description="Track stock levels for solar panels, inverters, and heavy equipment" 
      />
      <MasterInventoryTable />
    </div>
  );
}
