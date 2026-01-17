// Programmatic SEO helper: Generate static params and metadata for industry pages
// This file helps with both SSR caching and SSG static generation

import { getIndustrySlugs, getIndustryBySlug, getAllIndustries, IndustrySolution } from '../data/industryPages';

/**
 * Generate Static Params for Industry Pages
 * 
 * In a Next.js app, this would be used like:
 * export function generateStaticParams() {
 *   return getIndustryStaticParams();
 * }
 * 
 * For Vite + React:
 * - Use during build-time to generate static HTML files
 * - Or use with a prerendering strategy
 */
export interface StaticParams {
  industry: string;
}

export function getIndustryStaticParams(): StaticParams[] {
  const slugs = getIndustrySlugs();
  return slugs.map(slug => ({ industry: slug }));
}

/**
 * Generate Metadata for Industry Pages Dynamically
 * 
 * In Next.js, this would be:
 * export async function generateMetadata({ params }) {
 *   return getIndustryMetadata(params.industry);
 * }
 * 
 * For Vite + React:
 * - Use in the component to set dynamic meta tags via React Helmet
 */
export interface IndustryMetadata {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  ogType: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
}

export function getIndustryMetadata(slug: string): IndustryMetadata | null {
  const industry = getIndustryBySlug(slug);
  
  if (!industry) return null;

  const canonical = `https://openaria.app/solutions/${industry.slug}`;

  return {
    title: industry.metaTitle,
    description: industry.metaDescription,
    keywords: industry.keywords.join(', '),
    canonical,
    ogTitle: industry.metaTitle,
    ogDescription: industry.metaDescription,
    ogUrl: canonical,
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: industry.metaTitle,
    twitterDescription: industry.metaDescription,
  };
}

/**
 * Generate Structured Data for Industry Pages
 * 
 * Used to generate JSON-LD schema for each industry solution page
 */
export function getIndustryStructuredData(industry: IndustrySolution) {
  const url = `https://openaria.app/solutions/${industry.slug}`;

  // LocalBusiness schema specific to the industry solution
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `OpenAria - ${industry.industryName} Solutions`,
    description: industry.metaDescription,
    url: url,
    sameAs: [
      'https://twitter.com/openariahq',
      'https://www.linkedin.com/company/openaria',
    ],
  };

  // BreadcrumbList schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://openaria.app',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Solutions',
        item: 'https://openaria.app/solutions',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: industry.industryName,
        item: url,
      },
    ],
  };

  // Article schema for the industry solution page
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: industry.metaTitle,
    description: industry.metaDescription,
    url: url,
    author: {
      '@type': 'Organization',
      name: 'OpenAria',
    },
    datePublished: new Date().toISOString().split('T')[0],
    dateModified: new Date().toISOString().split('T')[0],
    publisher: {
      '@type': 'Organization',
      name: 'OpenAria',
    },
  };

  return {
    localBusiness: localBusinessSchema,
    breadcrumb: breadcrumbSchema,
    article: articleSchema,
  };
}

/**
 * Generate Programmatic Sitemap Entries for Industry Pages
 * 
 * These entries should be added to your sitemap.xml
 */
export function getIndustrySitemapEntries() {
  const industries = getAllIndustries();
  const baseUrl = 'https://openaria.app';
  const today = new Date().toISOString().split('T')[0];

  return industries.map(industry => ({
    url: `${baseUrl}/solutions/${industry.slug}`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.7',
  }));
}

/**
 * Generate Programmatic Robots.txt entries for Industry Pages
 * 
 * All industry solution pages should be crawlable
 */
export function getIndustryRobotsEntries(): string {
  const industries = getAllIndustries();
  const entries = industries
    .map(industry => `Allow: /solutions/${industry.slug}`)
    .join('\n');

  return `
# Industry Solution Pages - Programmatically Generated
${entries}
`;
}

/**
 * Validate industry slug
 * 
 * Useful for route guards and 404 handling
 */
export function isValidIndustrySlug(slug: string): boolean {
  return getIndustrySlugs().includes(slug);
}

/**
 * Get all canonical URLs for industry pages
 * 
 * Useful for generating link tags and sitemaps
 */
export function getAllIndustryCanonicalUrls(): string[] {
  return getIndustrySlugs().map(
    slug => `https://openaria.app/solutions/${slug}`
  );
}

/**
 * Caching strategy for industry pages
 * 
 * Recommended cache headers for production:
 */
export const INDUSTRY_CACHE_HEADERS = {
  // Development: No cache
  development: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
  
  // Production: Aggressive caching
  production: {
    // Cache in browser for 1 hour
    // Cache on CDN for 24 hours
    'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    'ETag': 'W/"industry-page-v1"',
  },
};

/**
 * Generate structured data for JSON-LD schema.org markup
 * 
 * Includes all recommended schemas for industry solution pages:
 * - Organization (corporate entity)
 * - BreadcrumbList (navigation)
 * - Article (content type)
 * - LocalBusiness (service provider)
 */
export function getCompleteIndustryPageSchema(industry: IndustrySolution): string {
  const schemas = getIndustryStructuredData(industry);
  
  return `
    <script type="application/ld+json">
      ${JSON.stringify(schemas.breadcrumb, null, 2)}
    </script>
    <script type="application/ld+json">
      ${JSON.stringify(schemas.article, null, 2)}
    </script>
  `;
}

export default {
  getIndustryStaticParams,
  getIndustryMetadata,
  getIndustryStructuredData,
  getIndustrySitemapEntries,
  getIndustryRobotsEntries,
  isValidIndustrySlug,
  getAllIndustryCanonicalUrls,
  getCompleteIndustryPageSchema,
  INDUSTRY_CACHE_HEADERS,
};
