// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────
// Navigation items are defined here (labels use i18n keys)
// Actual translated labels come from locale files

import type { NavItem } from '@/types/navigation';

export const mainNavItems: NavItem[] = [
  { label: 'nav.home', href: '/' },
  { label: 'nav.about', href: '/about' },
  {
    label: 'nav.solutions',
    href: '/solutions',
    children: [
      { label: 'nav.solutionsGroup.residential', href: '/solutions/residential' },
      { label: 'nav.solutionsGroup.commercial', href: '/solutions/commercial' },
      { label: 'nav.solutionsGroup.industrial', href: '/solutions/industrial' },
    ],
  },
  { label: 'nav.products', href: '/products' },
  { label: 'nav.calculator', href: '/calculator' },
  { label: 'nav.blog', href: '/blog' },
  { label: 'nav.contact', href: '/contact' },
];

export const footerNavGroups = [
  {
    title: 'nav.footer.company',
    items: [
      { label: 'nav.about', href: '/about' },
      { label: 'nav.careers', href: '/careers' },
      { label: 'nav.press', href: '/press' },
    ],
  },
  {
    title: 'nav.footer.solutions',
    items: [
      { label: 'nav.solutionsGroup.residential', href: '/solutions/residential' },
      { label: 'nav.solutionsGroup.commercial', href: '/solutions/commercial' },
      { label: 'nav.solutionsGroup.industrial', href: '/solutions/industrial' },
    ],
  },
  {
    title: 'nav.footer.support',
    items: [
      { label: 'nav.contact', href: '/contact' },
      { label: 'nav.faq', href: '/faq' },
      { label: 'nav.warranty', href: '/warranty' },
    ],
  },
  {
    title: 'nav.footer.legal',
    items: [
      { label: 'nav.privacy', href: '/privacy' },
      { label: 'nav.terms', href: '/terms' },
      { label: 'nav.cookies', href: '/cookies' },
    ],
  },
];
