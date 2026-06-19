'use client';

import { cn } from '@/lib/utils';
import { useAdminUIStore } from '@/modules/admin/shared/store/adminUIStore';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopNav } from './AdminTopNav';
import { ToastSystem } from '@/modules/admin/shared/components/ui/ToastSystem';

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const { sidebarCollapsed } = useAdminUIStore();

  return (
    <div className="flex h-screen overflow-hidden bg-brand-bg">
      <AdminSidebar />

      {/* Main content — offset by sidebar width */}
      <div
        className={cn(
          'ease-out-expo flex flex-1 flex-col overflow-hidden transition-all duration-300',
          sidebarCollapsed ? 'ml-16' : 'ml-60'
        )}
      >
        <AdminTopNav />

        {/* Scrollable page area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="min-h-full p-5 lg:p-6">{children}</div>
        </main>
      </div>

      <ToastSystem />
    </div>
  );
}
