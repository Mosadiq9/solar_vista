'use client';

import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  width?: 'md' | 'lg' | 'xl';
}

export function Drawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  width = 'md',
}: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const widthClasses = {
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return createPortal(
    <div className="fixed inset-0 z-modal flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        className={cn(
          'relative w-full h-full bg-brand-surface shadow-2xl transition-transform duration-300 ease-out-expo flex flex-col',
          widthClasses[width]
        )}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            {description && <p className="mt-1 text-sm text-white/50">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/[0.05] hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
