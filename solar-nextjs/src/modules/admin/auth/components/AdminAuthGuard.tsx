'use client';

import { useEffect, useState } from 'react';
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

  const [hasTimedOut, setHasTimedOut] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/admin/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Absolute fallback: NEVER load for more than 8 seconds.
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isLoading) {
      timeoutId = setTimeout(() => {
        setHasTimedOut(true);
      }, 8000);
    }
    return () => clearTimeout(timeoutId);
  }, [isLoading]);

  if (hasTimedOut && isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-bg">
        <div className="flex flex-col items-center gap-4 text-center max-w-md p-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20">
            <Sun className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-white">Connection Timeout</h2>
          <p className="text-sm text-white/50">
            The server took too long to respond while verifying your authentication. This usually means the database is unreachable or offline.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white transition-colors border border-white/10"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-12 w-12 animate-pulse items-center justify-center rounded-xl bg-brand-primary/10">
            <Sun className="h-6 w-6 text-brand-primary" />
          </div>
          <p className="text-sm text-white/30">Connecting to database...</p>
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
