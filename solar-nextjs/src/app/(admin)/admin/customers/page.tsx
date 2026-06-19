'use client';

import { useEffect } from 'react';
import { PageHeader } from '@/modules/admin/shared/components/ui/PageHeader';
import { CustomersTable } from '@/modules/crm/customers/components/CustomersTable';
import { useCustomersStore } from '@/modules/crm/customers/store/useCustomersStore';

export default function CustomersPage() {
  const { fetchCustomers } = useCustomersStore();

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return (
    <div className="space-y-5">
      <PageHeader title="Customers" description="Manage converted customers and view their current lifecycle stage" />
      <CustomersTable />
    </div>
  );
}
