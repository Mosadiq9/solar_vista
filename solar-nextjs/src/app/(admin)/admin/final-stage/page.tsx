'use client';

import { PageHeader } from '@/modules/admin/shared/components/ui/PageHeader';
import { FinalStageTable } from '@/modules/crm/lifecycle/components/FinalStageTable';

export default function FinalStagePage() {
  return (
    <div className="space-y-5">
      <PageHeader 
        title="Final Stage & Handover" 
        description="Stage 6: Complete the mandatory quality checklist before final handover" 
      />
      <FinalStageTable />
    </div>
  );
}
