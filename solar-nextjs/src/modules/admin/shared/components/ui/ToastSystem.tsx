'use client';

import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminUIStore } from '@/modules/admin/shared/store/adminUIStore';

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const STYLES = {
  success: 'border-brand-accent/20 bg-brand-accent/5 text-brand-accent',
  error: 'border-red-500/20 bg-red-500/5 text-red-400',
  warning: 'border-brand-primary/20 bg-brand-primary/5 text-brand-primary',
  info: 'border-blue-500/20 bg-blue-500/5 text-blue-400',
};

export function ToastSystem() {
  const { toasts, removeToast } = useAdminUIStore();

  return (
    <div className="fixed bottom-4 right-4 z-toast flex flex-col gap-2">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type];
        return (
          <div
            key={toast.id}
            className={cn(
              'flex min-w-72 max-w-sm animate-fade-up items-start gap-3 rounded-xl border p-4 shadow-card backdrop-blur-md',
              'bg-brand-surface-2',
              STYLES[toast.type]
            )}
          >
            <Icon className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white">{toast.title}</p>
              {toast.message && <p className="mt-0.5 text-xs text-white/50">{toast.message}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 rounded p-0.5 text-white/30 transition-colors hover:text-white/60"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
