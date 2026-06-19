'use client';

import { useEffect } from 'react';
import { PageHeader } from '@/modules/admin/shared/components/ui/PageHeader';
import { FleetTable } from '@/modules/crm/logistics/components/FleetTable';
import { useLogisticsStore } from '@/modules/crm/logistics/store/useLogisticsStore';

export default function FleetPage() {
  const { fetchFleet } = useLogisticsStore();

  useEffect(() => {
    fetchFleet();
  }, [fetchFleet]);

  return (
    <div className="space-y-5">
      <PageHeader 
        title="Fleet Management" 
        description="Track vehicle assignments, payload capacities, and maintenance schedules" 
      />
      <FleetTable />
    </div>
  );
}
