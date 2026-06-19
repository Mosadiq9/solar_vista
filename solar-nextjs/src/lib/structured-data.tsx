// ─────────────────────────────────────────────────────────────────────────────
// STRUCTURED DATA — JSON-LD for rich search results
// ─────────────────────────────────────────────────────────────────────────────

import { siteConfig } from '@/config/site';
import type { StructuredDataOrganization } from '@/types/seo';

/**
 * organizationSchema — JSON-LD for organization rich results
 */
export const organizationSchema: StructuredDataOrganization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/images/logo.png`,
  description: siteConfig.description,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: siteConfig.contact.phone,
    contactType: 'customer service',
    availableLanguage: ['English', 'Hindi', 'Gujarati'],
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Ahmedabad',
    addressRegion: 'Gujarat',
    addressCountry: 'IN',
  },
  sameAs: Object.values(siteConfig.social),
};

/**
 * localBusinessSchema — For Google Maps / Local SEO
 */
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  telephone: siteConfig.contact.phone,
  email: siteConfig.contact.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Solar House',
    addressLocality: 'Ahmedabad',
    addressRegion: 'Gujarat',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 23.0225, // Ahmedabad approximate
    longitude: 72.5714,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '09:00',
    closes: '19:00',
  },
  priceRange: '₹₹₹',
};

/**
 * JsonLd — Server component for injecting structured data
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
