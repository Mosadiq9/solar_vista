'use client';

import Link from 'next/link';
import { UserPlus, FileText, Briefcase, BarChart3, MessageSquare, Zap } from 'lucide-react';
import { AdminCard } from '@/modules/admin/shared/components/ui/AdminCard';
import { cn } from '@/lib/utils';

const ACTIONS = [
  {
    label: 'Add Lead',
    icon: UserPlus,
    href: '/admin/crm',
    color: 'primary',
    description: 'New enquiry',
  },
  {
    label: 'Write Post',
    icon: FileText,
    href: '/admin/blog/new',
    color: 'accent',
    description: 'Blog content',
  },
  {
    label: 'Add Project',
    icon: Briefcase,
    href: '/admin/projects/new',
    color: 'primary',
    description: 'Case study',
  },
  {
    label: 'Analytics',
    icon: BarChart3,
    href: '/admin/analytics',
    color: 'accent',
    description: 'View reports',
  },
] as const;

export function QuickActions() {
  return (
    <AdminCard padding="none">
      <div className="p-5 pb-3">
        <h3 className="font-display text-sm font-semibold text-white">Quick Actions</h3>
        <p className="mt-0.5 text-xs text-white/40">Common tasks at a glance</p>
      </div>
      <div className="grid grid-cols-2 gap-2 p-3 pt-0">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              className={cn(
                'group flex flex-col gap-2 rounded-lg border p-3.5 transition-all duration-150',
                action.color === 'primary'
                  ? 'border-brand-primary/10 bg-brand-primary/5 hover:border-brand-primary/20 hover:bg-brand-primary/10'
                  : 'border-brand-accent/10 bg-brand-accent/5 hover:border-brand-accent/20 hover:bg-brand-accent/10'
              )}
            >
              <Icon
                className={cn(
                  'h-4 w-4',
                  action.color === 'primary' ? 'text-brand-primary' : 'text-brand-accent'
                )}
              />
              <div>
                <p className="text-xs font-semibold text-white/80">{action.label}</p>
                <p className="text-2xs text-white/35">{action.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </AdminCard>
  );
}
