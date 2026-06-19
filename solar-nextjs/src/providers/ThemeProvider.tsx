'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/stores/ui.store';

/**
 * ThemeProvider — Applies the active theme class to <html>
 * and handles system preference detection.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useUIStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }

    // Set color-scheme for native browser elements (scrollbars, inputs)
    root.style.colorScheme = theme;
  }, [theme]);

  return <>{children}</>;
}
