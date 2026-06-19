'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  description?: string;
}

interface AdminUIStore {
  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (v: boolean) => void;

  // Modals
  activeModal: string | null;
  modalData: unknown;
  openModal: (id: string, data?: unknown) => void;
  closeModal: () => void;

  // Toasts
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;

  // Command palette
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (v: boolean) => void;
}

export const useAdminUIStore = create<AdminUIStore>()(
  devtools(
    (set, get) => ({
      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),

      activeModal: null,
      modalData: null,
      openModal: (id, data = null) => set({ activeModal: id, modalData: data }),
      closeModal: () => set({ activeModal: null, modalData: null }),

      toasts: [],
      addToast: (toast) => {
        const id = `toast-${Date.now()}`;
        set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
        setTimeout(() => get().removeToast(id), 4000);
      },
      removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

      commandPaletteOpen: false,
      setCommandPaletteOpen: (v) => set({ commandPaletteOpen: v }),
    }),
    { name: 'admin-ui-store' }
  )
);
