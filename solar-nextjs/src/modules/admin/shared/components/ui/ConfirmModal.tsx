'use client';

import { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
}: ConfirmModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const confirmClasses = {
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    warning: 'bg-brand-primary hover:bg-brand-primary-dark text-brand-bg',
    info: 'bg-blue-500 hover:bg-blue-600 text-white',
  };

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md animate-scale-in rounded-2xl border border-white/10 bg-brand-surface-2 p-6 shadow-card">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-start gap-4">
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
              variant === 'danger'
                ? 'bg-red-500/10 text-red-400'
                : variant === 'warning'
                  ? 'bg-brand-primary/10 text-brand-primary'
                  : 'bg-blue-500/10 text-blue-400'
            )}
          >
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-base font-semibold text-white">{title}</h3>
            {description && <p className="mt-1.5 text-sm text-white/50">{description}</p>}
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="hover:bg-white/8 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50',
              confirmClasses[variant]
            )}
          >
            {isLoading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
