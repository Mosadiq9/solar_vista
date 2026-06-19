'use client';

import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TableSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function TableSearch({
  value,
  onChange,
  placeholder = 'Search...',
  className,
}: TableSearchProps) {
  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/25" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'h-8 w-full rounded-lg border border-white/10 bg-brand-surface pl-8 pr-8 text-sm text-white placeholder:text-white/25',
          'outline-none transition-colors focus:border-brand-primary/40'
        )}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 transition-colors hover:text-white/60"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
