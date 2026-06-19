'use client';

import { cn } from '@/lib/utils';

interface LeadScoreIndicatorProps {
  score: number | undefined;
  size?: 'sm' | 'md';
}

export function LeadScoreIndicator({ score, size = 'md' }: LeadScoreIndicatorProps) {
  if (score === undefined) return null;

  const color =
    score >= 80
      ? 'text-brand-accent'
      : score >= 60
        ? 'text-brand-primary'
        : score >= 40
          ? 'text-yellow-400'
          : 'text-red-400';

  const bgColor =
    score >= 80
      ? 'bg-brand-accent'
      : score >= 60
        ? 'bg-brand-primary'
        : score >= 40
          ? 'bg-yellow-400'
          : 'bg-red-400';

  return (
    <div className={cn('flex items-center gap-1.5', size === 'sm' && 'gap-1')}>
      <div
        className={cn('h-1.5 w-8 overflow-hidden rounded-full bg-white/10', size === 'sm' && 'w-6')}
      >
        <div
          className={cn('h-full rounded-full transition-all', bgColor, 'opacity-70')}
          style={{ width: `${score}%` }}
        />
      </div>
      <span
        className={cn('font-semibold tabular-nums', color, size === 'sm' ? 'text-2xs' : 'text-xs')}
      >
        {score}
      </span>
    </div>
  );
}
