// ─────────────────────────────────────────────────────────────────────────────
// FRAMER MOTION ANIMATION PRESETS
// ─────────────────────────────────────────────────────────────────────────────
// Centralised motion variants — import and use in components.
// Keeps animation logic OUT of component JSX.

import type { Variants, Transition } from 'framer-motion';

// ─── Shared Transitions ────────────────────────────────────────────────────

export const transitions = {
  fast: { duration: 0.15, ease: [0.4, 0, 0.2, 1] } satisfies Transition,
  normal: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } satisfies Transition,
  slow: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } satisfies Transition,
  spring: { type: 'spring', stiffness: 300, damping: 30 } satisfies Transition,
  springBouncy: { type: 'spring', stiffness: 400, damping: 20 } satisfies Transition,
  easeOutExpo: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } satisfies Transition,
  easeOutBack: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] } satisfies Transition,
} as const;

// ─── Core Animation Variants ───────────────────────────────────────────────

/**
 * fadeIn — Simple opacity fade
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    transition: transitions.fast,
  },
};

/**
 * fadeUp — Fade in with upward movement (most common)
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.easeOutExpo,
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: transitions.fast,
  },
};

/**
 * fadeDown — Fade in with downward movement
 */
export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.easeOutExpo,
  },
};

/**
 * fadeLeft — Slide in from the left
 */
export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.easeOutExpo,
  },
};

/**
 * fadeRight — Slide in from the right
 */
export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.easeOutExpo,
  },
};

/**
 * scaleReveal — Scale up from 95% with fade
 */
export const scaleReveal: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.easeOutExpo,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: transitions.fast,
  },
};

/**
 * scaleRevealBouncy — Scale with spring bounce
 */
export const scaleRevealBouncy: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.springBouncy,
  },
};

/**
 * staggerContainer — Parent variant that staggers children
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/**
 * staggerContainerSlow — Slower stagger for dramatic effect
 */
export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

/**
 * staggerItem — Item inside a stagger container
 */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.easeOutExpo,
  },
};

/**
 * textReveal — Reveal text character by character (use with split text)
 */
export const textReveal: Variants = {
  hidden: { opacity: 0, y: '100%' },
  visible: {
    opacity: 1,
    y: '0%',
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * textRevealContainer — Container for text reveal
 */
export const textRevealContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.1,
    },
  },
};

/**
 * glowPulse — Pulsing glow effect for CTAs and highlights
 */
export const glowPulse: Variants = {
  rest: {
    boxShadow: '0 0 20px rgba(245, 166, 35, 0.4)',
  },
  pulse: {
    boxShadow: [
      '0 0 20px rgba(245, 166, 35, 0.4)',
      '0 0 40px rgba(245, 166, 35, 0.8)',
      '0 0 20px rgba(245, 166, 35, 0.4)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * slideInUp — For modals, drawers, bottom sheets
 */
export const slideInUp: Variants = {
  hidden: { y: '100%', opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: transitions.easeOutExpo,
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: transitions.fast,
  },
};

/**
 * slideInRight — For side panels and drawers
 */
export const slideInRight: Variants = {
  hidden: { x: '100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: transitions.easeOutExpo,
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: transitions.fast,
  },
};

/**
 * backdropFade — For modal backdrops
 */
export const backdropFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

/**
 * navItem — Hover state for navigation items
 */
export const navItem: Variants = {
  rest: { x: 0 },
  hover: { x: 4, transition: transitions.spring },
};

// ─── Utility Helpers ──────────────────────────────────────────────────────

/**
 * withDelay — Add delay to any variant
 */
export function withDelay(variant: Variants, delay: number): Variants {
  return {
    ...variant,
    visible: {
      ...(variant.visible as object),
      transition: {
        ...((variant.visible as { transition?: object })?.transition ?? {}),
        delay,
      },
    },
  };
}

/**
 * customFadeUp — Customizable fadeUp with params
 */
export function customFadeUp(distance = 32, duration = 0.6, delay = 0): Variants {
  return {
    hidden: { opacity: 0, y: distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration, ease: [0.16, 1, 0.3, 1], delay },
    },
  };
}
