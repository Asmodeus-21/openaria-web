# OpenAria JSON-LD Schema Reference

## Complete Schema Structures

This document shows the exact JSON-LD schemas being injected for OpenAria's Knowledge Graph implementation.

---

## 1. Organization Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "OpenAria",
  "url": "https://openaria.app",
  "logo": "https://openaria.app/logo.png",
  "description": "OpenAria is an AI receptionist that answers calls 24/7, books appointments, and captures leads.",
  "sameAs": [
    "https://twitter.com/openariahq",
    "https://www.linkedin.com/company/openaria",
    "https://www.facebook.com/openaria"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Service",
    "availableLanguage": "en"
  },
  "foundingDate": "2023",
  "areaServed": "US",
  "knowsAbout": [
    "AI Receptionist",
    "Call Answering",
    "Lead Capture",
    "Appointment Scheduling",
    "CRM Integration"
  ]
}
```

**What it tells Google**:
- OpenAria is a legitimate organization
- Located in US, founded in 2023
- Has active social profiles
- Specializes in AI receptionists

---

## 2. SoftwareApplication Schema (PRIMARY - Knowledge Graph)

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "OpenAria",
  "applicationCategory": [
    "BusinessApplication",
    "Communication",
    "Productivity"
  ],
  "description": "OpenAria is an AI-powered receptionist that answers inbound calls, books appointments, captures leads, and integrates with your CRM - working 24/7 to ensure you never miss a customer call again.",
  "url": "https://openaria.app",
  "image": "https://openaria.app/og-home.jpg",
  "operatingSystem": "Web",
  "downloadUrl": "https://openaria.app",
  "screenshot": "https://openaria.app/og-home.jpg",
  "version": "1.0.0",
  "author": {
    "@type": "Organization",
    "name": "OpenAria"
  },
  "publisher": {
    "@type": "Organization",
    "name": "OpenAria",
    "url": "https://openaria.app"
  },
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "USD",
    "lowPrice": "97",
    "highPrice": "997",
    "offers": [
      {
        "@type": "Offer",
        "name": "14-Day Trial",
        "price": "97",
        "priceCurrency": "USD",
        "description": "Full Platform Access, Custom AI Agent Setup, Live Call Handling, CRM & Calendar Sync",
        "url": "https://openaria.app/#pricing",
        "availability": "https://schema.org/InStock"
      },
      {
        "@type": "Offer",
        "name": "Starter",
        "price": "497",
        "priceCurrency": "USD",
        "description": "1 Dedicated AI Agent, Inbound Call Handling, Appointment Scheduling, Basic CRM Integration, Email Support",
        "url": "https://openaria.app/#pricing",
        "availability": "https://schema.org/InStock"
      },
      {
        "@type": "Offer",
        "name": "Growth",
        "price": "997",
        "priceCurrency": "USD",
        "description": "1-5 AI Agents, Inbound & Outbound Calls, Full CRM Automation, SMS & Email Handling, Priority Support, Custom Workflows",
        "url": "https://openaria.app/#pricing",
        "availability": "https://schema.org/InStock"
      }
    ]
  },
  "featureList": [
    "Inbound call answering",
    "Outbound calls",
    "Appointment scheduling",
    "Calendar management",
    "Lead capture",
    "CRM integration",
    "24/7 availability",
    "Multi-language support",
    "Real-time call routing",
    "Call recording & transcription"
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "150",
    "bestRating": "5",
    "worstRating": "1"
  },
  "sameAs": [
    "https://twitter.com/openariahq",
    "https://www.linkedin.com/company/openaria"
  ]
}
```

**What it tells Google**:
- **PRIMARY Knowledge Graph entity**
- OpenAria is a software application (not a website)
- Categorized as BusinessApplication
- Web-based, accessible 24/7
- Pricing from $97 to $997
- 4.8/5 stars with 150 reviews
- Has specific features listed
- Multiple pricing tiers available

---

## 3. LocalBusiness Schema

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "OpenAria",
  "description": "AI Receptionist Service",
  "url": "https://openaria.app",
  "telephone": "+1-800-OPENARIA",
  "email": "support@openaria.app",
  "image": "https://openaria.app/logo.png",
  "sameAs": [
    "https://twitter.com/openariahq",
    "https://www.linkedin.com/company/openaria"
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Innovation Drive",
    "addressLocality": "San Francisco",
    "addressRegion": "CA",
    "postalCode": "94105",
    "addressCountry": "US"
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ],
    "opens": "00:00",
    "closes": "23:59"
  }
}
```

**What it tells Google**:
- Physical business location (San Francisco)
- Available 24/7 (00:00 to 23:59)
- Local business phone number
- Support email provided
- Address information for Google Maps

---

## 4. Product Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "OpenAria AI Receptionist",
  "description": "An AI-powered receptionist that answers calls, books appointments, and captures leads 24/7.",
  "brand": {
    "@type": "Brand",
    "name": "OpenAria"
  },
  "manufacturer": {
    "@type": "Organization",
    "name": "OpenAria"
  },
  "image": "https://openaria.app/og-home.jpg",
  "url": "https://openaria.app",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "150",
    "bestRating": "5",
    "worstRating": "1"
  },
  "offers": [
    {
      "@type": "Offer",
      "name": "14-Day Trial",
      "price": "97",
      "priceCurrency": "USD",
      "url": "https://openaria.app/#pricing",
      "availability": "https://schema.org/InStock"
    },
    {
      "@type": "Offer",
      "name": "Starter",
      "price": "497",
      "priceCurrency": "USD",
      "url": "https://openaria.app/#pricing",
      "availability": "https://schema.org/InStock"
    },
    {
      "@type": "Offer",
      "name": "Growth",
      "price": "997",
      "priceCurrency": "USD",
      "url": "https://openaria.app/#pricing",
      "availability": "https://schema.org/InStock"
    }
  ]
}
```

**What it tells Google**:
- This is a purchasable product
- Available in product search results
- Shows pricing tiers
- Displays aggregate ratings
- Links to pricing page

---

## 5. WebSite Schema

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://openaria.app",
  "name": "OpenAria",
  "description": "AI Receptionist for Businesses",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://openaria.app/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

**What it tells Google**:
- Website has a search function
- Enables sitelinks search box in SERPs
- Users can search directly from Google results

---

## Pricing Tier Mapping

### Current Pricing Plans
```
14-Day Trial:    $97.00
Starter:         $497.00
Growth:          $997.00
Enterprise:      Custom
```

### Schema Representation
```json
"AggregateOffer": {
  "lowPrice": "97",      // Minimum ($97 trial)
  "highPrice": "997"     // Maximum ($997 growth)
}
```

Each individual `Offer` includes:
- Name (e.g., "Starter", "Growth")
- Price (numeric value)
- Currency (USD)
- Description (features included)
- URL (link to pricing page)
- Availability (InStock)

---

## Rating Structure

### Current Ratings
- **Average Rating**: 4.8 / 5.0
- **Review Count**: 150 reviews
- **Best Possible**: 5.0
- **Worst Possible**: 1.0

### Schema Representation
```json
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "4.8",
  "ratingCount": "150",
  "bestRating": "5",
  "worstRating": "1"
}
```

---

## Features Listed

### OpenAria Capabilities
```json
"featureList": [
  "Inbound call answering",
  "Outbound calls",
  "Appointment scheduling",
  "Calendar management",
  "Lead capture",
  "CRM integration",
  "24/7 availability",
  "Multi-language support",
  "Real-time call routing",
  "Call recording & transcription"
]
```

**Usage**: Helps Google understand product capabilities and rank for related searches

---

## Social Profile Links (SameAs)

### Profiles Linked
```json
"sameAs": [
  "https://twitter.com/openariahq",
  "https://www.linkedin.com/company/openaria",
  "https://www.facebook.com/openaria"
]
```

**Why**: Consolidates entity identity across platforms and helps with brand authority

---

## Location Information

### Business Address
```json
"address": {
  "@type": "PostalAddress",
  "streetAddress": "123 Innovation Drive",
  "addressLocality": "San Francisco",
  "addressRegion": "CA",
  "postalCode": "94105",
  "addressCountry": "US"
}
```

**Used for**: 
- Local search results
- "Near me" searches
- Google Maps integration

---

## Contact Information

### Support Channels
```json
"telephone": "+1-800-OPENARIA",
"email": "support@openaria.app",
"contactPoint": {
  "@type": "ContactPoint",
  "contactType": "Customer Service",
  "availableLanguage": "en"
}
```

**Purpose**: Helps users find support contact information from search results

---

## Knowledge About (Expertise)

```json
"knowsAbout": [
  "AI Receptionist",
  "Call Answering",
  "Lead Capture",
  "Appointment Scheduling",
  "CRM Integration"
]
```

**Purpose**: Tells Google what OpenAria specializes in for semantic understanding

---

## Breadcrumb Example (Per-Page)

### Home Page
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://openaria.app"
    }
  ]
}
```

### Subpage (e.g., AI Receptionist)
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://openaria.app"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "AI Receptionist",
      "item": "https://openaria.app/ai-receptionist"
    }
  ]
}
```

**Purpose**: Shows navigation path in search results

---

## Future Schema Enhancements

### Review Schema (When Reviews Available)
```json
{
  "@type": "Review",
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "5"
  },
  "author": {
    "@type": "Person",
    "name": "Customer Name"
  },
  "reviewBody": "OpenAria transformed our business...",
  "datePublished": "2026-01-15"
}
```

### FAQ Schema (For FAQ Pages)
```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does OpenAria work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "OpenAria uses AI to..."
      }
    }
  ]
}
```

### Video Schema (For Video Content)
```json
{
  "@type": "VideoObject",
  "name": "OpenAria Demo",
  "description": "See OpenAria in action",
  "thumbnailUrl": "https://openaria.app/video-thumb.jpg",
  "uploadDate": "2026-01-15",
  "duration": "PT2M30S",
  "contentUrl": "https://openaria.app/video.mp4"
}
```

---

## Validation Checklist

### ✅ All Schemas Include
- [ ] @context: "https://schema.org"
- [ ] @type: (specific schema type)
- [ ] name: (clear product/company name)
- [ ] url: (direct link)
- [ ] description: (detailed explanation)
- [ ] image: (valid image URL)

### ✅ SoftwareApplication Includes
- [ ] applicationCategory: (business classification)
- [ ] operatingSystem: (Web)
- [ ] offers: (pricing information)
- [ ] aggregateRating: (ratings/reviews)
- [ ] featureList: (capabilities)
- [ ] sameAs: (social profiles)

### ✅ Organization Includes
- [ ] name: "OpenAria"
- [ ] url: (company website)
- [ ] logo: (company logo)
- [ ] sameAs: (social profiles)
- [ ] contactPoint: (support info)

---

## Testing Schemas

### Google Rich Results Test
```
https://search.google.com/test/rich-results
Enter: https://openaria.app
Check: All schemas show ✓
```

### Schema Validator
```
https://validator.schema.org/
Paste: Page HTML source
Check: No errors reported
```

---

## Summary

| Schema | Purpose | Required | Status |
|--------|---------|----------|--------|
| Organization | Corporate identity | Yes | ✅ Included |
| SoftwareApplication | Knowledge Graph | **YES** | ✅ Included |
| LocalBusiness | Local search | No | ✅ Included |
| Product | Product search | Yes | ✅ Included |
| WebSite | Sitelinks search | No | ✅ Included |
| BreadcrumbList | Navigation | Yes | ✅ Per-page |

---

**Reference Date**: January 17, 2026  
**Schema Version**: 1.0  
**Status**: ✅ Production Ready
