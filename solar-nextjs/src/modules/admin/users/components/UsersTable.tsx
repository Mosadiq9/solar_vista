'use client';

import { Shield, UserPlus, UserCog } from 'lucide-react';
import { AdminCard } from '@/modules/admin/shared/components/ui/AdminCard';
import { StatusBadge } from '@/modules/admin/shared/components/ui/StatusBadge';
import type { AdminUser, AdminRole } from '@/modules/admin/types';

const MOCK_USERS: AdminUser[] = [
  {
    id: 'u1',
    email: 'test2@gmail.com',
    name: 'Admin User',
    role: 'super_admin',
    createdAt: Date.now() - 7776000000,
  },
  {
    id: 'u2',
    email: 'sales@chauhansolar.com',
    name: 'Sales Executive',
    role: 'admin',
    createdAt: Date.now() - 2592000000,
  },
  {
    id: 'u3',
    email: 'content@chauhansolar.com',
    name: 'Content Editor',
    role: 'editor',
    createdAt: Date.now() - 1296000000,
  },
  {
    id: 'u4',
    email: 'support@chauhansolar.com',
    name: 'Support Agent',
    role: 'support',
    createdAt: Date.now() - 604800000,
  },
];

const ROLE_CONFIG: Record<
  AdminRole,
  { label: string; variant: 'warning' | 'primary' | 'info' | 'neutral' }
> = {
  super_admin: { label: 'Super Admin', variant: 'warning' },
  admin: { label: 'Admin', variant: 'primary' },
  editor: { label: 'Editor', variant: 'info' },
  support: { label: 'Support', variant: 'neutral' },
};

export function UsersTable() {
  return (
    <div className="space-y-5">
      {/* RBAC info card */}
      <div className="flex items-start gap-4 rounded-xl border border-brand-accent/15 bg-brand-accent/5 p-4">
        <Shield className="mt-0.5 h-5 w-5 shrink-0 text-brand-accent" />
        <div>
          <h3 className="font-display text-sm font-semibold text-white">
            Role-Based Access Control
          </h3>
          <p className="mt-1 text-xs text-white/50">
            4 roles: <strong className="text-white/70">Super Admin</strong> (full access) ·{' '}
            <strong className="text-white/70">Admin</strong> (CRM + CMS) ·{' '}
            <strong className="text-white/70">Editor</strong> (CMS only) ·{' '}
            <strong className="text-white/70">Support</strong> (leads read-only). Supabase Row Level
            Security enforces permissions at the database level.
          </p>
        </div>
      </div>

      {/* Users list */}
      <AdminCard padding="none">
        <div className="flex items-center justify-between border-b border-white/[0.06] p-4">
          <div className="flex items-center gap-2">
            <UserCog className="h-4 w-4 text-brand-primary" />
            <h2 className="font-display text-sm font-semibold text-white">Admin Users</h2>
          </div>
          <button className="flex items-center gap-1.5 rounded-lg border border-brand-primary/20 bg-brand-primary/5 px-3 py-1.5 text-xs font-medium text-brand-primary transition-colors hover:bg-brand-primary/10">
            <UserPlus className="h-3.5 w-3.5" /> Invite User
          </button>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {MOCK_USERS.map((user) => {
            const roleConfig = ROLE_CONFIG[user.role];
            return (
              <div
                key={user.id}
                className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-white/[0.02]"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-xs font-bold text-brand-primary">
                  {user.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white/80">{user.name}</p>
                  <p className="text-xs text-white/35">{user.email}</p>
                </div>
                <StatusBadge label={roleConfig.label} variant={roleConfig.variant} />
              </div>
            );
          })}
        </div>

        <div className="border-t border-white/[0.06] px-4 py-3">
          <p className="text-xs text-white/25">
            Full user management via Supabase Auth dashboard. Invitation system coming soon.
          </p>
        </div>
      </AdminCard>
    </div>
  );
}
