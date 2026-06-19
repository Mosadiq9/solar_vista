'use client';

import {
  TrendingUp,
  TrendingDown,
  Users,
  UserPlus,
  CheckCircle,
  Zap,
  IndianRupee,
  BarChart3,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, LucideIcon> = {
  Users,
  UserPlus,
  CheckCircle,
  TrendingUp,
  Zap,
  IndianRupee,
  BarChart3,
};

interface StatCardProps {
  id: string;
  label: string;
  value: string | number;
  change: number;
  positive: boolean;
  icon: string;
  color: 'primary' | 'accent';
  className?: string;
}

export function StatCard({
  label,
  value,
  change,
  positive,
  icon,
  color,
  className,
}: StatCardProps) {
  const Icon = ICON_MAP[icon] ?? BarChart3;
  const isPositive = positive && change > 0;

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border border-white/[0.06] bg-brand-surface-2 p-5',
        'transition-all duration-200 hover:border-white/10 hover:shadow-card-hover',
        className
      )}
    >
      {/* Subtle glow orb */}
      <div
        className={cn(
          'absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100',
          color === 'primary' ? 'bg-brand-primary/20' : 'bg-brand-accent/20'
        )}
      />

      <div className="relative flex items-start justify-between">
        <div
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg',
            color === 'primary'
              ? 'bg-brand-primary/10 text-brand-primary'
              : 'bg-brand-accent/10 text-brand-accent'
          )}
        >
          <Icon className="h-4 w-4" />
        </div>

        {/* Change indicator */}
        <div
          className={cn(
            'flex items-center gap-0.5 rounded-full px-2 py-0.5 text-2xs font-semibold',
            isPositive ? 'bg-brand-accent/10 text-brand-accent' : 'bg-red-500/10 text-red-400'
          )}
        >
          {isPositive ? (
            <TrendingUp className="h-2.5 w-2.5" />
          ) : (
            <TrendingDown className="h-2.5 w-2.5" />
          )}
          {Math.abs(change)}%
        </div>
      </div>

      <div className="mt-4">
        <p className="font-display text-2xl font-bold tracking-tight text-white">{value}</p>
        <p className="mt-1 text-xs text-white/40">{label}</p>
      </div>
    </div>
  );
}
