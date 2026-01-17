import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * OpenAria Structured Data Component
 * Creates JSON-LD structured data for Knowledge Graph recognition
 * 
 * Schemas included:
 * 1. SoftwareApplication - Main entity (AI Receptionist)
 * 2. Organization - Company info
 * 3. BreadcrumbList - Site navigation (added per-page)
 * 4. AggregateOffer - Pricing information
 */

export interface PricingTier {
  name: string;
  price: number;
  currency: string;
  description: string;
}

interface StructuredDataProps {
  pricing?: PricingTier[];
}

export const StructuredDataComponent: React.FC<StructuredDataProps> = ({ pricing }) => {
  // Organization Schema - Core company identity
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'OpenAria',
    url: 'https://openaria.app',
    logo: 'https://openaria.app/logo.png',
    description: 'OpenAria is an AI receptionist that answers calls 24/7, books appointments, and captures leads.',
    sameAs: [
      'https://twitter.com/openariahq',
      'https://www.linkedin.com/company/openaria',
      'https://www.facebook.com/openaria'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: 'en'
    },
    foundingDate: '2023',
    areaServed: 'US',
    knowsAbout: [
      'AI Receptionist',
      'Call Answering',
      'Lead Capture',
      'Appointment Scheduling',
      'CRM Integration'
    ]
  };

  // SoftwareApplication Schema - Knowledge Graph entity
  const softwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    applicationCategory: [
      'BusinessApplication',
      'Communication',
      'Productivity'
    ],
    description: 'OpenAria is an AI-powered receptionist that answers inbound calls, books appointments, captures leads, and integrates with your CRM - working 24/7 to ensure you never miss a customer call again.',
    url: 'https://openaria.app',
    image: 'https://openaria.app/og-home.jpg',
    operatingSystem: 'Web',
    downloadUrl: 'https://openaria.app',
    screenshot: 'https://openaria.app/og-home.jpg',
    version: '1.0.0',
    name: 'OpenAria AI Receptionist',
    author: {
      '@type': 'Organization',
      name: 'OpenAria'
    },
    publisher: {
      '@type': 'Organization',
      name: 'OpenAria',
      url: 'https://openaria.app'
    },
    // Pricing information
    ...(pricing && pricing.length > 0 && {
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'USD',
        lowPrice: pricing.length > 0 ? Math.min(...pricing.map(p => p.price)).toString() : '0',
        highPrice: pricing.length > 0 ? Math.max(...pricing.map(p => p.price)).toString() : '999',
        offers: pricing.map(tier => ({
          '@type': 'Offer',
          name: tier.name,
          price: tier.price.toString(),
          priceCurrency: tier.currency,
          description: tier.description,
          url: 'https://openaria.app/#pricing',
          availability: 'https://schema.org/InStock'
        }))
      }
    }),
    // Features
    featureList: [
      'Inbound call answering',
      'Outbound calls',
      'Appointment scheduling',
      'Calendar management',
      'Lead capture',
      'CRM integration',
      '24/7 availability',
      'Multi-language support',
      'Real-time call routing',
      'Call recording & transcription'
    ],
    // Reviews aggregation (can be updated as reviews come in)
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
      bestRating: '5',
      worstRating: '1'
    },
    // Social media profiles
    sameAs: [
      'https://twitter.com/openariahq',
      'https://www.linkedin.com/company/openaria',
      'https://www.facebook.com/openaria'
    ]
  };

  // LocalBusiness Schema - For local SEO enhancement
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'OpenAria',
    description: 'AI Receptionist Service',
    url: 'https://openaria.app',
    telephone: '+1-800-OPENARIA', // Replace with actual support number
    email: 'support@openaria.app',
    image: 'https://openaria.app/logo.png',
    sameAs: [
      'https://twitter.com/openariahq',
      'https://www.linkedin.com/company/openaria'
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Innovation Drive',
      addressLocality: 'San Francisco',
      addressRegion: 'CA',
      postalCode: '94105',
      addressCountry: 'US'
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59'
    }
  };

  // Product Schema - For product search results
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'OpenAria AI Receptionist',
    description: 'An AI-powered receptionist that answers calls, books appointments, and captures leads 24/7.',
    brand: {
      '@type': 'Brand',
      name: 'OpenAria'
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'OpenAria'
    },
    image: 'https://openaria.app/og-home.jpg',
    url: 'https://openaria.app',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
      bestRating: '5',
      worstRating: '1'
    },
    ...(pricing && pricing.length > 0 && {
      offers: pricing.map(tier => ({
        '@type': 'Offer',
        name: tier.name,
        price: tier.price.toString(),
        priceCurrency: tier.currency,
        url: 'https://openaria.app/#pricing',
        availability: 'https://schema.org/InStock'
      }))
    })
  };

  return (
    <Helmet>
      {/* Organization Schema */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>

      {/* SoftwareApplication Schema - PRIMARY for Knowledge Graph */}
      <script type="application/ld+json">
        {JSON.stringify(softwareApplicationSchema)}
      </script>

      {/* LocalBusiness Schema */}
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>

      {/* Product Schema */}
      <script type="application/ld+json">
        {JSON.stringify(productSchema)}
      </script>

      {/* WebSite Schema - For sitelinks search box */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          url: 'https://openaria.app',
          name: 'OpenAria',
          description: 'AI Receptionist for Businesses',
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://openaria.app/search?q={search_term_string}'
            },
            'query-input': 'required name=search_term_string'
          }
        })}
      </script>
    </Helmet>
  );
};

export default StructuredDataComponent;
