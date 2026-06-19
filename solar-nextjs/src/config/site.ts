// ─────────────────────────────────────────────────────────────────────────────
// SITE CONFIGURATION — Single source of truth for all site-wide settings
// ─────────────────────────────────────────────────────────────────────────────

export const siteConfig = {
  name: 'Chauhan Solar LLP',
  tagline: 'Powering Tomorrow, Sustainably.',
  shortName: 'Chauhan Solar',
  description:
    "India's premier solar energy solutions provider. Residential, commercial, and industrial solar installations with cutting-edge technology and guaranteed performance.",
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://chauhansolar.com',
  locale: 'en',
  locales: ['en', 'hi', 'gu'],

  // Contact
  contact: {
    email: 'info@chauhansolar.com',
    phone: '+91 98765 43210',
    whatsapp: '+919876543210',
    address: 'Solar House, Ahmedabad, Gujarat, India',
    mapLink: 'https://maps.google.com',
  },

  // Social Links
  social: {
    facebook: 'https://facebook.com/chauhansolar',
    instagram: 'https://instagram.com/chauhansolar',
    youtube: 'https://youtube.com/@chauhansolar',
    linkedin: 'https://linkedin.com/company/chauhansolar',
    twitter: 'https://twitter.com/chauhansolar',
  },

  // SEO defaults
  seo: {
    defaultTitle: 'Chauhan Solar LLP — Powering Tomorrow, Sustainably.',
    titleTemplate: '%s | Chauhan Solar LLP',
    defaultDescription:
      "India's premier solar energy solutions provider. Save up to 90% on electricity with our premium solar installations.",
    defaultOgImage: '/og-image.jpg',
    twitterHandle: '@chauhansolar',
    keywords: [
      'solar energy',
      'solar panels',
      'solar installation',
      'Gujarat solar',
      'renewable energy India',
      'rooftop solar',
      'solar subsidy',
      'Chauhan Solar',
    ],
  },

  // Business
  business: {
    gstin: 'XXXXXXXXXXXXXXXXX',
    founded: '2015',
    installations: 5000,
    statesServed: 12,
    yearsExperience: 9,
    warrantyYears: 25,
  },

  // Feature flags (enables/disables features without code changes)
  features: {
    chatbot: false, // Enable when AI chatbot is ready
    blog: false, // Enable when blog CMS is ready
    calculator: true, // Solar calculator
    adminPanel: false, // Enable when admin is ready
    multiLanguage: true, // Multilingual support
    whatsapp: true, // WhatsApp floating button
    analytics: false, // Enable when analytics is configured
  },
} as const;

export type SiteConfig = typeof siteConfig;
