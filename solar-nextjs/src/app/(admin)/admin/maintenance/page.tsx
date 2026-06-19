'use client';

import { useEffect } from 'react';
import { PageHeader } from '@/modules/admin/shared/components/ui/PageHeader';
import { MaintenanceTable } from '@/modules/crm/support/components/MaintenanceTable';
import { useSupportStore } from '@/modules/crm/support/store/useSupportStore';

export default function MaintenancePage() {
  const { fetchMaintenance } = useSupportStore();

  useEffect(() => {
    fetchMaintenance();
  }, [fetchMaintenance]);

  return (
    <div className="space-y-5">
      <PageHeader 
        title="Maintenance Schedules" 
        description="Track routine panel cleaning, servicing, and technician dispatch" 
      />
      <MaintenanceTable />
    </div>
  );
}
