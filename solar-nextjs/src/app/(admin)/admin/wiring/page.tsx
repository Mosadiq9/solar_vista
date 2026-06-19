'use client';

import { PageHeader } from '@/modules/admin/shared/components/ui/PageHeader';
import { GenericStageTable } from '@/modules/crm/lifecycle/components/GenericStageTable';
import { Zap } from 'lucide-react';

export default function WiringPage() {
  return (
    <div className="space-y-5">
      <PageHeader 
        title="Wiring" 
        description="Stage 5: Track electrical wiring and inverter setup" 
      />
      <GenericStageTable 
        stageName="wiring" 
        emptyMessage="No projects currently in wiring" 
        icon={Zap} 
      />
    </div>
  );
}
