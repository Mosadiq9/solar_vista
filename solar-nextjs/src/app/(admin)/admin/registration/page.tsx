'use client';

import { PageHeader } from '@/modules/admin/shared/components/ui/PageHeader';
import { GenericStageTable } from '@/modules/crm/lifecycle/components/GenericStageTable';
import { FileText } from 'lucide-react';

export default function RegistrationPage() {
  return (
    <div className="space-y-5">
      <PageHeader 
        title="Project Registration" 
        description="Stage 1: Track GEB / DISCOM registration and approvals for new projects" 
      />
      <GenericStageTable 
        stageName="registration" 
        emptyMessage="No projects currently in registration" 
        icon={FileText} 
      />
    </div>
  );
}
