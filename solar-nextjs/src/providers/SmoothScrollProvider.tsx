'use client';

import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from '@/lib/gsap';
import { ScrollTrigger } from '@/lib/gsap';

import { usePathname } from '@/i18n/navigation';

/**
 * SmoothScrollProvider — Initializes Lenis smooth scroll
 * and syncs it with GSAP's ScrollTrigger for precise scroll animations.
 *
 * Rules:
 * - Lenis controls scroll physics (smooth damping)
 * - GSAP ScrollTrigger reads scroll position FROM Lenis
 * - This creates perfect sync between animations and scroll
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  // Restore scroll to top on route change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo ease
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Add lenis to GSAP ticker for proper animation loop
    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateLenis);

    // Disable GSAP's lagSmoothing so Lenis handles it
    gsap.ticker.lagSmoothing(0);

    // Expose lenis globally for components that need direct access
    (window as Window & { lenis?: Lenis }).lenis = lenis;

    return () => {
      lenis.off('scroll', ScrollTrigger.update);
      lenis.destroy();
      (window as Window & { lenis?: Lenis }).lenis = undefined;
      gsap.ticker.remove(updateLenis);
    };
  }, []);

  return <>{children}</>;
}
