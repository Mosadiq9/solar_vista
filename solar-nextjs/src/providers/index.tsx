'use client';

import { ThemeProvider } from './ThemeProvider';
import { SmoothScrollProvider } from './SmoothScrollProvider';
import { SupabaseProvider } from './SupabaseProvider';

/**
 * RootProviders — Composes all global providers in the correct order.
 *
 * Order matters:
 * 1. SupabaseProvider — auth state first
 * 2. ThemeProvider — applies theme class
 * 3. SmoothScrollProvider — GSAP + Lenis (client-side only)
 */
export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseProvider>
      <ThemeProvider>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </ThemeProvider>
    </SupabaseProvider>
  );
}
