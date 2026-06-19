import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import type { PageMetadata } from '@/types/seo';

/**
 * generateMetadata — Create Next.js metadata object for any page.
 * Handles title, description, OG, Twitter, canonical, and robots.
 */
export function generateMetadata(page: Partial<PageMetadata> = {}): Metadata {
  const title = page.title ? `${page.title} | ${siteConfig.name}` : siteConfig.seo.defaultTitle;

  const description = page.description || siteConfig.seo.defaultDescription;
  const ogImage = page.ogImage || siteConfig.seo.defaultOgImage;
  const canonical = page.canonical || siteConfig.url;

  return {
    title,
    description,
    keywords: [...siteConfig.seo.keywords, ...(page.keywords || [])],
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,

    metadataBase: new URL(siteConfig.url),

    alternates: {
      canonical,
      languages: {
        en: `${siteConfig.url}/en`,
        hi: `${siteConfig.url}/hi`,
        gu: `${siteConfig.url}/gu`,
      },
    },

    openGraph: {
      type: page.ogType || 'website',
      url: canonical,
      title,
      description,
      siteName: siteConfig.name,
      locale: 'en_IN',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: page.twitterCard || 'summary_large_image',
      title,
      description,
      site: siteConfig.seo.twitterHandle,
      creator: siteConfig.seo.twitterHandle,
      images: [ogImage],
    },

    robots: {
      index: !page.noIndex,
      follow: !page.noIndex,
      googleBot: {
        index: !page.noIndex,
        follow: !page.noIndex,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    verification: {
      // google: 'your-google-verification-id',
      // yandex: 'your-yandex-verification-id',
    },
  };
}

/**
 * Base metadata — Used in root layout as fallback
 */
export const baseMetadata: Metadata = generateMetadata();
