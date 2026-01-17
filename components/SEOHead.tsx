import React from 'react';
import { Helmet } from 'react-helmet-async';
import type { PageMetadata } from '../seo.config';

interface SEOHeadProps {
  metadata: PageMetadata;
  children?: React.ReactNode;
}

/**
 * SEO Head Component
 * Manages all meta tags, OpenGraph, Twitter, and structured data
 * 
 * NOTE: Canonical tags are now injected at build time by the vite-plugin-canonical
 * This ensures canonical tags are present in the initial HTML response, not client-side injected.
 * This is critical for Googlebot's WRS (Web Rendering Service) to see the canonical
 * immediately without waiting for JavaScript to execute.
 */
export const SEOHead: React.FC<SEOHeadProps> = ({ metadata, children }) => {
  const {
    title,
    description,
    keywords,
    canonical,
    ogImage,
    ogType = 'website',
    twitterCard = 'summary_large_image',
    structuredData
  } = metadata;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}

      {/* Canonical URL - Pre-injected at build time by vite-plugin-canonical */}
      {/* This ensures the canonical tag is in the initial HTML payload for immediate Googlebot indexing */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* OpenGraph / Facebook */}
      <meta property="og:type" content={ogType} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter */}
      <meta property="twitter:card" content={twitterCard} />
      {canonical && <meta property="twitter:url" content={canonical} />}
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      {ogImage && <meta property="twitter:image" content={ogImage} />}

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}

      {children}
    </Helmet>
  );
};

export default SEOHead;
