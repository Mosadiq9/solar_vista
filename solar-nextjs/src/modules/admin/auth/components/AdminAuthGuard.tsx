'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sun } from 'lucide-react';
import { useAdminAuth, hasPermission } from '@/modules/admin/auth/hooks/useAdminAuth';
import type { AdminRole } from '@/modules/admin/types';

interface AdminAuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: AdminRole[];
}

export function AdminAuthGuard({ children, requiredRoles }: AdminAuthGuardProps) {
  const { isAuthenticated, isLoading, user } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/admin/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-12 w-12 animate-pulse items-center justify-center rounded-xl bg-brand-primary/10">
            <Sun className="h-6 w-6 text-brand-primary" />
          </div>
          <p className="text-sm text-white/30">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (requiredRoles && !hasPermission(user?.role, requiredRoles)) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <p className="font-display text-lg font-semibold text-white/60">Access Denied</p>
          <p className="mt-1 text-sm text-white/30">
            You don&apos;t have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
