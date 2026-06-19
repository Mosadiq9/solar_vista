// ─────────────────────────────────────────────────────────────────────────────
// GSAP ANIMATION UTILITIES
// ─────────────────────────────────────────────────────────────────────────────
// Centralised GSAP config and reusable scroll animation builders.
// Keep GSAP scroll logic HERE — not inside components.

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins (safe to call multiple times)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── GSAP Default Config ───────────────────────────────────────────────────

export const gsapDefaults = {
  ease: 'power3.out',
  duration: 0.8,
  stagger: 0.1,
} as const;

// ─── ScrollTrigger Defaults ────────────────────────────────────────────────

export const scrollTriggerDefaults = {
  start: 'top 80%',
  end: 'bottom 20%',
  toggleActions: 'play none none reverse',
} as const;

// ─── Reusable GSAP Animations ─────────────────────────────────────────────

/**
 * gsapFadeUp — Animate elements from bottom with opacity
 */
export function gsapFadeUp(
  targets: string | Element | Element[],
  options?: {
    delay?: number;
    duration?: number;
    stagger?: number;
    y?: number;
    scrollTrigger?: ScrollTrigger.Vars;
  }
) {
  const {
    delay = 0,
    duration = gsapDefaults.duration,
    stagger = gsapDefaults.stagger,
    y = 40,
    scrollTrigger,
  } = options ?? {};

  return gsap.from(targets, {
    opacity: 0,
    y,
    duration,
    delay,
    stagger,
    ease: gsapDefaults.ease,
    scrollTrigger: scrollTrigger ? { ...scrollTriggerDefaults, ...scrollTrigger } : undefined,
  });
}

/**
 * gsapFadeIn — Simple opacity reveal
 */
export function gsapFadeIn(
  targets: string | Element | Element[],
  options?: {
    delay?: number;
    duration?: number;
    stagger?: number;
    scrollTrigger?: ScrollTrigger.Vars;
  }
) {
  const {
    delay = 0,
    duration = gsapDefaults.duration,
    stagger = gsapDefaults.stagger,
    scrollTrigger,
  } = options ?? {};

  return gsap.from(targets, {
    opacity: 0,
    duration,
    delay,
    stagger,
    ease: 'power2.inOut',
    scrollTrigger: scrollTrigger ? { ...scrollTriggerDefaults, ...scrollTrigger } : undefined,
  });
}

/**
 * gsapScaleReveal — Scale from smaller with fade
 */
export function gsapScaleReveal(
  targets: string | Element | Element[],
  options?: {
    from?: number;
    delay?: number;
    duration?: number;
    stagger?: number;
    scrollTrigger?: ScrollTrigger.Vars;
  }
) {
  const { from = 0.9, delay = 0, duration = 0.7, stagger = 0.08, scrollTrigger } = options ?? {};

  return gsap.from(targets, {
    opacity: 0,
    scale: from,
    duration,
    delay,
    stagger,
    ease: 'back.out(1.2)',
    scrollTrigger: scrollTrigger ? { ...scrollTriggerDefaults, ...scrollTrigger } : undefined,
  });
}

/**
 * gsapHorizontalScroll — Horizontal scroll section
 */
export function gsapHorizontalScroll(
  container: string | Element,
  panels: string | Element | Element[]
) {
  const panelElements = gsap.utils.toArray<Element>(panels);

  return gsap.to(panelElements, {
    xPercent: -100 * (panelElements.length - 1),
    ease: 'none',
    scrollTrigger: {
      trigger: container,
      pin: true,
      scrub: 1,
      snap: 1 / (panelElements.length - 1),
      end: () => `+=${(container as Element).scrollWidth}`,
    },
  });
}

/**
 * gsapParallax — Parallax effect on scroll
 */
export function gsapParallax(target: string | Element, speed = 0.3, trigger?: string | Element) {
  return gsap.to(target, {
    y: () => -(window.innerHeight * speed),
    ease: 'none',
    scrollTrigger: {
      trigger: trigger || target,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
}

/**
 * gsapTextReveal — Split text line-by-line reveal
 */
export function gsapTextReveal(
  target: string | Element,
  options?: {
    scrollTrigger?: ScrollTrigger.Vars;
    delay?: number;
  }
) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return null;

  return gsap.from(el, {
    opacity: 0,
    y: 30,
    duration: 1,
    delay: options?.delay ?? 0,
    ease: 'power3.out',
    scrollTrigger: options?.scrollTrigger
      ? { ...scrollTriggerDefaults, ...options.scrollTrigger }
      : undefined,
  });
}

/**
 * gsapCountUp — Animated number counter
 */
export function gsapCountUp(
  target: string | Element,
  endValue: number,
  options?: {
    duration?: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    scrollTrigger?: ScrollTrigger.Vars;
  }
) {
  const { duration = 2, prefix = '', suffix = '', decimals = 0, scrollTrigger } = options ?? {};

  const obj = { value: 0 };
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return null;

  return gsap.to(obj, {
    value: endValue,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      (el as HTMLElement).textContent = `${prefix}${obj.value.toFixed(decimals)}${suffix}`;
    },
    scrollTrigger: scrollTrigger ? { ...scrollTriggerDefaults, ...scrollTrigger } : undefined,
  });
}

/**
 * killScrollTriggers — Cleanup utility for component unmount
 */
export function killScrollTriggers(triggers: gsap.core.Tween[] | null[]) {
  triggers.forEach((t) => {
    if (t) {
      const st = (t as gsap.core.Tween & { scrollTrigger?: ScrollTrigger }).scrollTrigger;
      if (st) st.kill();
      t.kill();
    }
  });
}

// Re-export gsap and ScrollTrigger for convenience
export { gsap, ScrollTrigger };
