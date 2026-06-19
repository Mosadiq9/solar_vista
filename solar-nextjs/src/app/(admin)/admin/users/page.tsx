import type { Metadata } from 'next';
import { PageHeader } from '@/modules/admin/shared/components/ui/PageHeader';
import { UsersTable } from '@/modules/admin/users/components/UsersTable';

export const metadata: Metadata = { title: 'Users' };

export default function UsersPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Users" description="Manage admin accounts and role-based access" />
      <UsersTable />
    </div>
  );
}
