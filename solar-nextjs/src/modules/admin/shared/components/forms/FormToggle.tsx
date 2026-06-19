'use client';

import { cn } from '@/lib/utils';

interface FormToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function FormToggle({ label, description, checked, onChange, disabled }: FormToggleProps) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-start gap-3',
        disabled && 'cursor-not-allowed opacity-40'
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative mt-0.5 h-5 w-9 shrink-0 rounded-full border transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary',
          checked ? 'border-brand-accent/30 bg-brand-accent/20' : 'bg-white/8 border-white/15'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-3.5 w-3.5 rounded-full transition-all duration-200',
            checked ? 'left-[calc(100%-1.125rem)] bg-brand-accent' : 'left-0.5 bg-white/40'
          )}
        />
      </button>
      <div>
        <span className="text-sm font-medium text-white/80">{label}</span>
        {description && <p className="text-xs text-white/35">{description}</p>}
      </div>
    </label>
  );
}
