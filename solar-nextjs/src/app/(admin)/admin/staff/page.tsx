'use client';

import { useEffect } from 'react';
import { PageHeader } from '@/modules/admin/shared/components/ui/PageHeader';
import { StaffTable } from '@/modules/crm/staff/components/StaffTable';
import { useStaffStore } from '@/modules/crm/staff/store/useStaffStore';

export default function StaffPage() {
  const { fetchStaff } = useStaffStore();

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  return (
    <div className="space-y-5">
      <PageHeader 
        title="Staff Directory" 
        description="Manage system users, assign roles, and control access permissions" 
      />
      <StaffTable />
    </div>
  );
}
