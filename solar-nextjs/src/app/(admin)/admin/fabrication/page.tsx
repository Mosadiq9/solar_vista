'use client';

import { PageHeader } from '@/modules/admin/shared/components/ui/PageHeader';
import { GenericStageTable } from '@/modules/crm/lifecycle/components/GenericStageTable';
import { Hammer } from 'lucide-react';

export default function FabricationPage() {
  return (
    <div className="space-y-5">
      <PageHeader 
        title="Fabrication" 
        description="Stage 4: Track structure installation and fabricator assignments" 
      />
      <GenericStageTable 
        stageName="fabrication" 
        emptyMessage="No projects currently in fabrication" 
        icon={Hammer} 
      />
    </div>
  );
}
