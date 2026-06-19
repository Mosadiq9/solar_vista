'use client';

import { usePathname } from 'next/navigation';
import { AdminShell } from '@/modules/admin/shared/components/layout';
import { AdminAuthGuard } from '@/modules/admin/auth/components/AdminAuthGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login' || pathname.endsWith('/admin/login');

  console.log('[AdminLayout] pathname:', pathname, 'isLoginPage:', isLoginPage);

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <AdminAuthGuard>
      <AdminShell>{children}</AdminShell>
    </AdminAuthGuard>
  );
}
