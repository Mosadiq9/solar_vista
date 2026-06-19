'use client';

import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  hint?: string;
  placeholder?: string;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, options, error, hint, placeholder, className, id, ...props }, ref) => {
    const fieldId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={fieldId} className="text-xs font-medium text-white/60">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={fieldId}
            className={cn(
              'h-9 w-full appearance-none rounded-lg border bg-brand-surface px-3 pr-8 text-sm text-white',
              'outline-none transition-colors duration-150',
              error
                ? 'border-red-500/50 focus:border-red-500'
                : 'border-white/10 focus:border-brand-primary/50',
              'disabled:cursor-not-allowed disabled:opacity-40',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" className="bg-brand-surface">
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-brand-surface">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30" />
        </div>
        {hint && !error && <p className="text-xs text-white/30">{hint}</p>}
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);
FormSelect.displayName = 'FormSelect';
