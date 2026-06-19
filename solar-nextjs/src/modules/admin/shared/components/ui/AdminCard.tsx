'use client';

import { cn } from '@/lib/utils';

interface AdminCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'primary' | 'accent' | 'none';
  padding?: 'sm' | 'md' | 'lg' | 'none';
  onClick?: () => void;
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

const glowMap = {
  none: '',
  primary: 'hover:shadow-glow-primary hover:border-brand-primary/30',
  accent: 'hover:shadow-glow-accent hover:border-brand-accent/30',
};

export function AdminCard({
  children,
  className,
  hover = false,
  glow = 'none',
  padding = 'md',
  onClick,
}: AdminCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-xl border border-white/[0.06] bg-brand-surface-2 shadow-card',
        'transition-all duration-200',
        paddingMap[padding],
        hover && 'cursor-pointer hover:border-white/10 hover:shadow-card-hover',
        glow !== 'none' && glowMap[glow],
        className
      )}
    >
      {children}
    </div>
  );
}

interface AdminCardHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function AdminCardHeader({
  title,
  description,
  action,
  icon,
  className,
}: AdminCardHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-3', className)}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
            {icon}
          </div>
        )}
        <div>
          <h3 className="font-display text-sm font-semibold text-white">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-white/40">{description}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
