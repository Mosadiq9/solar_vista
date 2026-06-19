'use client';

import { cn } from '@/lib/utils';
import type { LeadStatus } from '@/modules/admin/types';

// ── Lead Status Badge ─────────────────────────────────────────────────────────

const LEAD_STATUS_CONFIG: Record<LeadStatus, { label: string; classes: string; dot: string }> = {
  new: {
    label: 'New',
    classes: 'bg-brand-primary/10 text-brand-primary border-brand-primary/20',
    dot: 'bg-brand-primary',
  },
  contacted: {
    label: 'Contacted',
    classes: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    dot: 'bg-blue-400',
  },
  qualified: {
    label: 'Qualified',
    classes: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    dot: 'bg-violet-400',
  },
  proposal_sent: {
    label: 'Proposal Sent',
    classes: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    dot: 'bg-cyan-400',
  },
  converted: {
    label: 'Converted',
    classes: 'bg-brand-accent/10 text-brand-accent border-brand-accent/20',
    dot: 'bg-brand-accent',
  },
  closed: {
    label: 'Closed',
    classes: 'bg-white/5 text-white/40 border-white/10',
    dot: 'bg-white/30',
  },
};

interface LeadStatusBadgeProps {
  status: LeadStatus;
  showDot?: boolean;
  size?: 'sm' | 'md';
}

export function LeadStatusBadge({ status, showDot = true, size = 'md' }: LeadStatusBadgeProps) {
  const config = LEAD_STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-2xs' : 'px-2.5 py-1 text-xs',
        config.classes
      )}
    >
      {showDot && <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />}
      {config.label}
    </span>
  );
}

// ── Generic Status Badge ──────────────────────────────────────────────────────

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'primary';

const VARIANT_CONFIG: Record<BadgeVariant, string> = {
  success: 'bg-brand-accent/10 text-brand-accent border-brand-accent/20',
  warning: 'bg-brand-primary/10 text-brand-primary border-brand-primary/20',
  error: 'bg-red-500/10 text-red-400 border-red-500/20',
  info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  neutral: 'bg-white/5 text-white/50 border-white/10',
  primary: 'bg-brand-primary/10 text-brand-primary border-brand-primary/20',
};

interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

export function StatusBadge({ label, variant = 'neutral', className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        VARIANT_CONFIG[variant],
        className
      )}
    >
      {label}
    </span>
  );
}
