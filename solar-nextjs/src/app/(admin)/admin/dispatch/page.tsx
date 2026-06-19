'use client';

import { PageHeader } from '@/modules/admin/shared/components/ui/PageHeader';
import { GenericStageTable } from '@/modules/crm/lifecycle/components/GenericStageTable';
import { Truck } from 'lucide-react';

export default function DispatchPage() {
  return (
    <div className="space-y-5">
      <PageHeader 
        title="Dispatch" 
        description="Stage 3: Manage fleet and driver assignments for site delivery" 
      />
      <GenericStageTable 
        stageName="dispatch" 
        emptyMessage="No projects waiting for dispatch" 
        icon={Truck} 
      />
    </div>
  );
}
