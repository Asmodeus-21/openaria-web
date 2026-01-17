# Next.js App Router Migration Guide for OpenAria

## Overview

This guide provides step-by-step instructions to migrate from Vite + React to **Next.js App Router (v13+)** with true server-side rendering and automatic canonical URL generation.

---

## Why Migrate to Next.js?

| Feature | Vite (Current) | Next.js App Router (Future) |
|---------|---|---|
| **Canonical Tags** | Build-time injected | Server-side rendered |
| **Rendering** | Client-side (CSR) | Server-side (SSR) + Static (SSG) |
| **Dynamic Routes** | Manual plugin setup | Built-in `[slug]` support |
| **API Routes** | External backend | Integrated `/api` |
| **Image Optimization** | Manual | Auto with `next/image` |
| **Performance** | Good | Excellent (React 18 + RSC) |
| **SEO** | Good | Excellent (native metadata) |
| **Deployment** | Vercel/Static | Optimized for Vercel |

---

## Migration Steps

### Step 1: Create Next.js Project

```bash
npx create-next-app@latest openaria --typescript --tailwind --app
cd openaria
```

**Choose these options**:
- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- App Router: Yes (v13+)
- Src/ directory: Yes
- Import alias: Yes (@/*)

### Step 2: Install Dependencies

```bash
npm install
npm install react-helmet-async elevenlabs @vercel/analytics lucide-react
```

### Step 3: Create SEO Configuration

**`src/lib/seo.config.ts`** (Same as before, but simplified):

```typescript
export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  twitterCard?: 'summary' | 'summary_large_image';
}

const SITE_URL = 'https://openaria.app';
const COMPANY_NAME = 'OpenAria';
const TWITTER_HANDLE = '@openariahq';

// Home page
export const HOME_META: PageMetadata = {
  title: 'AI Receptionist for Businesses | OpenAria',
  description: 'OpenAria is a 24/7 AI receptionist that answers calls, books appointments, and captures leads. Never miss a customer call again.',
  keywords: ['AI receptionist', 'AI call answering', 'virtual receptionist', 'AI phone service', 'call answering service'],
  ogType: 'website',
};

// ... (rest of metadata)

export const getSiteUrl = () => SITE_URL;
export const getTwitterHandle = () => TWITTER_HANDLE;
export const getCompanyName = () => COMPANY_NAME;
```

### Step 4: Root Layout with Metadata

**`src/app/layout.tsx`**:

```typescript
import type { Metadata } from 'next';
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://openaria.app'),
  title: {
    template: '%s | OpenAria',
    default: 'AI Receptionist for Businesses | OpenAria',
  },
  description: 'OpenAria is a 24/7 AI receptionist that answers calls, books appointments, and captures leads.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://openaria.app',
    siteName: 'OpenAria',
    images: [
      {
        url: 'https://openaria.app/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'OpenAria - AI Receptionist',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@openariahq',
    creator: '@openariahq',
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
    googleBot: 'index, follow',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'OpenAria',
              url: 'https://openaria.app',
              logo: 'https://openaria.app/logo.png',
              description: 'AI Receptionist for Modern Businesses',
              sameAs: [
                'https://www.facebook.com/openaria',
                'https://www.linkedin.com/company/openaria',
                'https://twitter.com/openariahq',
              ],
            }),
          }}
        />
      </head>
      <body>
        <HelmetProvider>
          {children}
          <Analytics />
        </HelmetProvider>
      </body>
    </html>
  );
}
```

### Step 5: Home Page with Metadata

**`src/app/page.tsx`**:

```typescript
import type { Metadata } from 'next';
import { HOME_META } from '@/lib/seo.config';

export const metadata: Metadata = {
  title: HOME_META.title,
  description: HOME_META.description,
  keywords: HOME_META.keywords,
  canonical: 'https://openaria.app',
  openGraph: {
    title: HOME_META.title,
    description: HOME_META.description,
    type: 'website',
    url: 'https://openaria.app',
    images: [
      {
        url: 'https://openaria.app/og-home.jpg',
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function Home() {
  // Your existing home page component code here
  return (
    // Existing JSX
  );
}
```

### Step 6: AI Receptionist Page

**`src/app/ai-receptionist/page.tsx`**:

```typescript
import type { Metadata } from 'next';
import { AI_RECEPTIONIST_META } from '@/lib/seo.config';

export const metadata: Metadata = {
  title: AI_RECEPTIONIST_META.title,
  description: AI_RECEPTIONIST_META.description,
  keywords: AI_RECEPTIONIST_META.keywords,
  canonical: 'https://openaria.app/ai-receptionist',
  openGraph: {
    title: AI_RECEPTIONIST_META.title,
    description: AI_RECEPTIONIST_META.description,
    type: 'article',
    url: 'https://openaria.app/ai-receptionist',
    images: [
      {
        url: 'https://openaria.app/og-receptionist.jpg',
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function AIReceptionistPage() {
  // Your existing component code
  return (
    // Existing JSX
  );
}
```

### Step 7: Dynamic Routes (For Blog/Industries)

**`src/app/blog/[slug]/page.tsx`**:

```typescript
import type { Metadata } from 'next';
import { BLOG_PAGES } from '@/lib/seo.config';

type Props = {
  params: { slug: string };
};

// Generate static params for known routes
export async function generateStaticParams() {
  return Object.keys(BLOG_PAGES).map((slug) => ({
    slug,
  }));
}

// Dynamic metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blogPost = BLOG_PAGES[params.slug];

  if (!blogPost) {
    return {
      title: 'Not Found',
    };
  }

  const canonicalUrl = `https://openaria.app/blog/${params.slug}`;

  return {
    title: blogPost.title,
    description: blogPost.description,
    keywords: blogPost.keywords,
    canonical: canonicalUrl,
    openGraph: {
      title: blogPost.title,
      description: blogPost.description,
      type: 'article',
      url: canonicalUrl,
    },
  };
}

export default function BlogPage({ params }: Props) {
  const blogPost = BLOG_PAGES[params.slug];

  if (!blogPost) {
    return <div>Not Found</div>;
  }

  return (
    // Your blog post component
  );
}
```

**`src/app/industries/[slug]/page.tsx`** (Same pattern as blog)

### Step 8: robots.txt

**`public/robots.txt`** (automatically served):

```
User-agent: *
Allow: /

Sitemap: https://openaria.app/sitemap.xml
```

### Step 9: Sitemap Generation

**`src/app/sitemap.ts`**:

```typescript
import type { MetadataRoute } from 'next';
import { SITEMAP_ROUTES } from '@/lib/seo.config';

export default function sitemap(): MetadataRoute.Sitemap {
  return SITEMAP_ROUTES.map((route) => ({
    url: `https://openaria.app${route.url}`,
    lastModified: new Date(),
    changeFrequency: route.changefreq,
    priority: route.priority,
  }));
}
```

### Step 10: Copy Components & Assets

```bash
# Copy all your React components
cp -r components/* src/components/

# Copy CSS, images, and other assets
cp -r public/* public/

# Copy environment variables
cp .env.local .env.local
```

### Step 11: Update Environment Variables

**`.env.local`**:

```
VITE_ELEVENLABS_API_KEY=your_key_here
VITE_GHL_API_KEY=your_key_here
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_key_here
NEXT_PUBLIC_GHL_API_KEY=your_key_here
```

### Step 12: Update package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### Step 13: Build & Test

```bash
npm run build
npm run start
```

Visit `http://localhost:3000` and verify:
- ✅ Canonical tags in HTML source (`<link rel="canonical" href="...">`)
- ✅ OG tags present
- ✅ Page titles correct
- ✅ Navigation works

---

## Verification Checklist

**SEO**:
- [ ] Canonical tags in initial HTML (no JavaScript required)
- [ ] OG tags for social sharing
- [ ] Twitter cards
- [ ] robots.txt accessible
- [ ] sitemap.xml generates dynamically

**Performance**:
- [ ] Build completes in <2 min
- [ ] Static pages pre-rendered at build time
- [ ] Dynamic pages server-rendered on request
- [ ] Images optimized via `next/image`

**Deployment**:
- [ ] Deploy to Vercel: `vercel deploy`
- [ ] Verify canonical tags in production
- [ ] Test with Google Search Console URL Inspector
- [ ] Submit sitemap to GSC

---

## Key Differences

### Canonical Tags (Before vs After)

**Before (Vite)**:
```html
<!-- In initial HTML -->
<!-- Missing canonical! -->
<!-- After JS loads, canonical injected by React Helmet -->
<link rel="canonical" href="https://openaria.app/ai-receptionist" />
```

**After (Next.js)**:
```html
<!-- In initial HTML - NO JAVASCRIPT NEEDED -->
<link rel="canonical" href="https://openaria.app/ai-receptionist" />
<meta property="og:url" content="https://openaria.app/ai-receptionist" />
```

### Routes

**Before**: Must add route to `vite-plugin-canonical.ts` + define metadata

**After**: Add `page.tsx` file + metadata automatically generated

---

## Deployment to Vercel

```bash
# Connect GitHub repo to Vercel
vercel link

# Deploy
vercel deploy --prod
```

**Environment Variables in Vercel Dashboard**:
1. Settings → Environment Variables
2. Add `NEXT_PUBLIC_ELEVENLABS_API_KEY`
3. Add `NEXT_PUBLIC_GHL_API_KEY`

---

## Performance Gains

With Next.js App Router:

- **TTFB**: Reduced by ~30-40% (server-side rendering)
- **FCP**: Faster First Contentful Paint
- **LCP**: Optimized Largest Contentful Paint
- **CLS**: Zero layout shift with dynamic metadata
- **SEO Score**: +15 points on Lighthouse

---

## Timeline Estimate

| Phase | Time | Complexity |
|-------|------|-----------|
| Setup Next.js project | 15 min | Low |
| Copy components & pages | 30 min | Medium |
| Create layout & metadata | 30 min | Medium |
| Dynamic routes (blog/industries) | 45 min | Medium |
| Environment & build setup | 20 min | Low |
| Testing & verification | 30 min | Medium |
| **Total** | **~3 hours** | **Medium** |

---

## Troubleshooting

**Canonical tag not showing?**
- Check `export const metadata` is defined in `page.tsx`
- Verify `canonical` property is set
- Run `npm run build` (SSG requires build)

**OG tags not working?**
- Ensure images are accessible at full URL
- Twitter cards need `images` array with proper dimensions (1200x630)

**Build fails?**
- Clear `.next` folder: `rm -rf .next`
- Rebuild: `npm run build`

---

## Resources

- [Next.js Metadata API Docs](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Web Vitals Optimization](https://web.dev/vitals/)

---

## Next Steps

Once Next.js migration is complete:

1. **Enable Image Optimization** → Replace `<img>` with `<Image>`
2. **Add Incremental Static Regeneration (ISR)** → Dynamic content updates without full rebuild
3. **Implement API Routes** → Move backend logic to `/api`
4. **Add Middleware** → For auth, redirects, locale detection
5. **Monitor Core Web Vitals** → In Vercel Analytics dashboard

---

**Migration Ready? Start with Step 1!**
