'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, hint, required, className, id, rows = 4, ...props }, ref) => {
    const fieldId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={fieldId} className="text-xs font-medium text-white/60">
            {label}
            {required && <span className="ml-0.5 text-brand-primary">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={fieldId}
          rows={rows}
          className={cn(
            'w-full resize-y rounded-lg border bg-brand-surface px-3 py-2.5 text-sm text-white placeholder:text-white/25',
            'outline-none transition-colors duration-150',
            error
              ? 'border-red-500/50 focus:border-red-500'
              : 'border-white/10 focus:border-brand-primary/50',
            'disabled:cursor-not-allowed disabled:opacity-40',
            className
          )}
          {...props}
        />
        {hint && !error && <p className="text-xs text-white/30">{hint}</p>}
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);
FormTextarea.displayName = 'FormTextarea';
