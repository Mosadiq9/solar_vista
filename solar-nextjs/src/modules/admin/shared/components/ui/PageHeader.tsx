'use client';

import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, badge, className }: PageHeaderProps) {
  return (
    <div
      className={cn('flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between', className)}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
            {title}
          </h1>
          {badge}
        </div>
        {description && <p className="mt-1 text-sm text-white/50">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2 pt-1">{actions}</div>}
    </div>
  );
}
