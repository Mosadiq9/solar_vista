'use client';

import { PageHeader } from '@/modules/admin/shared/components/ui/PageHeader';
import { GenericStageTable } from '@/modules/crm/lifecycle/components/GenericStageTable';
import { PackageOpen } from 'lucide-react';

export default function KitReadyPage() {
  return (
    <div className="space-y-5">
      <PageHeader 
        title="Kit Ready" 
        description="Stage 2: Assign panels, inverters, and structures to projects" 
      />
      <GenericStageTable 
        stageName="kit_ready" 
        emptyMessage="No projects waiting for kit assignment" 
        icon={PackageOpen} 
      />
    </div>
  );
}
