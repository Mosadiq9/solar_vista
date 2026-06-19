'use client';

import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-surface-2 text-white/20">
          {icon}
        </div>
      )}
      <h3 className="font-display text-base font-semibold text-white/60">{title}</h3>
      {description && <p className="mt-2 max-w-xs text-sm text-white/30">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
