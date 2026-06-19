// ─────────────────────────────────────────────────────────────────────────────
// SEO TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  canonical?: string;
  noIndex?: boolean;
}

export interface StructuredDataOrganization {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo: string;
  description: string;
  contactPoint?: {
    '@type': 'ContactPoint';
    telephone: string;
    contactType: string;
    availableLanguage: string[];
  };
  address?: {
    '@type': 'PostalAddress';
    streetAddress?: string;
    addressLocality: string;
    addressRegion: string;
    postalCode?: string;
    addressCountry: string;
  };
  sameAs?: string[];
}

export interface StructuredDataProduct {
  '@context': 'https://schema.org';
  '@type': 'Product';
  name: string;
  description: string;
  image: string[];
  brand: {
    '@type': 'Brand';
    name: string;
  };
  offers?: {
    '@type': 'Offer';
    priceCurrency: string;
    price: string;
    availability: string;
  };
}
