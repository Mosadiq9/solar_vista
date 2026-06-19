'use client';

import { Bell, Search, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAdminUIStore } from '@/modules/admin/shared/store/adminUIStore';
import { useAdminAuth } from '@/modules/admin/auth/hooks/useAdminAuth';
import { AdminBreadcrumbs } from './AdminBreadcrumbs';

function ProfileMenu({
  user,
  onSignOut,
}: {
  user: { name: string; email: string; role: string } | null;
  onSignOut: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-1.5 transition-colors hover:bg-white/[0.06]"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary/20 text-2xs font-bold text-brand-primary">
          {user?.name?.charAt(0) ?? 'A'}
        </div>
        <div className="hidden text-left sm:block">
          <p className="text-xs font-medium leading-none text-white/80">{user?.name}</p>
          <p className="mt-0.5 text-2xs capitalize text-white/35">
            {user?.role?.replace('_', ' ')}
          </p>
        </div>
        <ChevronDown
          className={cn('h-3 w-3 text-white/30 transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-dropdown mt-1.5 w-48 animate-scale-in rounded-xl border border-white/[0.08] bg-brand-surface-2 py-1 shadow-card">
          <div className="border-b border-white/[0.06] px-3 py-2">
            <p className="text-xs font-medium text-white/70">{user?.name}</p>
            <p className="text-2xs text-white/35">{user?.email}</p>
          </div>
          <Link
            href="/admin/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 text-xs text-white/60 transition-colors hover:bg-white/[0.04] hover:text-white/80"
          >
            <Settings className="h-3.5 w-3.5" /> Settings
          </Link>
          <button
            onClick={() => {
              setOpen(false);
              onSignOut();
            }}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-red-400/80 transition-colors hover:bg-red-500/5 hover:text-red-400"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export function AdminTopNav() {
  const { setCommandPaletteOpen } = useAdminUIStore();
  const { user, signOut } = useAdminAuth();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-white/[0.06] bg-brand-surface/80 px-4 backdrop-blur-md">
      {/* Left — breadcrumbs */}
      <AdminBreadcrumbs />

      {/* Right — actions */}
      <div className="flex shrink-0 items-center gap-2">
        {/* Command palette trigger */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs text-white/30 transition-colors hover:bg-white/[0.05] hover:text-white/50 sm:flex"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search...</span>
          <kbd className="bg-white/8 ml-1 rounded px-1 py-0.5 font-mono text-2xs text-white/20">
            ⌘K
          </kbd>
        </button>

        {/* Notification bell */}
        <button className="relative flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/[0.05] hover:text-white/70">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-brand-primary" />
        </button>

        {/* Profile */}
        <ProfileMenu user={user} onSignOut={signOut} />
      </div>
    </header>
  );
}
