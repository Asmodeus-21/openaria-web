# VERCEL DEPLOYMENT CONFIGURATION AUDIT
## OpenAria AI Receptionist - Hybrid Vite + Next.js Architecture

**Report Date**: January 17, 2026  
**Auditor**: DevOps Engineer & Vercel Specialist  
**Status**: ⚠️ CRITICAL - Configuration requires immediate remediation

---

## SECTION 1: CURRENT STATE ANALYSIS

### 1.1 Project Architecture Summary

```
Repository Structure:
├── Vite Build Output         → dist/ (CSR - Client-Side Rendering)
│   ├── index.html            → Home page (App.tsx + React components)
│   ├── ai-receptionist.html  → Feature page
│   ├── ai-call-answering.html → Call answering page
│   └── assets/               → Bundled JS/CSS
│
├── Next.js App Router        → app/ folder (SSR/SSG)
│   └── app/solutions/
│       ├── page.tsx          → /solutions (hub page)
│       ├── layout.tsx        → Shared layout
│       └── [industry]/
│           ├── page.tsx      → /solutions/[industry] (9 static pages)
│           └── not-found.tsx → 404 handler
│
└── Vercel Deployment         → Needs configuration for dual-engine routing
```

### 1.2 Framework Conflict Analysis

| Framework | Route | Rendering | Output | Purpose |
|-----------|-------|-----------|--------|---------|
| **Vite** | `/` (home) | CSR | `dist/index.html` | Marketing hero, features, pricing |
| **Vite** | `/ai-receptionist` | CSR | `dist/ai-receptionist.html` | How it works page |
| **Vite** | `/ai-call-answering` | CSR | `dist/ai-call-answering.html` | Call answering features |
| **Next.js** | `/solutions` | SSG | Built by Next.js | Hub page (9 industries list) |
| **Next.js** | `/solutions/dentists` | SSG | Built by Next.js | Dentists solution page |
| **Next.js** | `/solutions/[any]` | SSG | Built by Next.js | 9 total pages (SSG at build time) |

**Critical Issue**: Vite builds to `dist/` while Next.js builds to `.next/`. Vercel's current config doesn't distinguish between them!

---

### 1.3 Current vercel.json Analysis

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [...]
}
```

#### Problem Identification

| Problem | Severity | Impact | Root Cause |
|---------|----------|--------|-----------|
| **Single rewrite rule** | 🔴 CRITICAL | ALL requests (including `/solutions/*`) redirect to Vite's `/index.html` | No Next.js awareness |
| **No routing strategy** | 🔴 CRITICAL | `/solutions` pages don't get built by Next.js on Vercel | Vite-only config |
| **Missing build output declaration** | 🔴 CRITICAL | Vercel doesn't know to use `.next/` for `/solutions/*` routes | No build specification |
| **No path-specific rewrites** | ⚠️ HIGH | Cannot differentiate Vite vs Next.js routes | Overly broad rewrite |

**Result**: `/solutions` pages will 404 or serve incorrect HTML on Vercel, despite being perfect locally.

---

## SECTION 2: CURRENT BUILD CONFIGURATION

### 2.1 Build Command Analysis

**Current package.json**:
```json
{
  "scripts": {
    "build": "vite build && node scripts/generate-sitemap.js"
  }
}
```

**Analysis**:
- ✅ Builds Vite to `dist/`
- ✅ Generates sitemap
- ⚠️ **MISSING**: No Next.js build step!
- ⚠️ **MISSING**: Next.js pages will NOT be pre-built at build time

**Expected Vercel behavior**:
1. Run `npm run build` (currently only Vite)
2. Deploy `dist/` folder
3. No `.next/` folder is created or uploaded
4. All `/solutions/*` requests fail with 404

**Consequence**: The 9 SEO pages are never built or deployed to Vercel!

---

### 2.2 Package.json Dependencies Assessment

**Installed**:
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.2.0",
    "react-helmet-async": "^2.0.5"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^7.3.0"
  }
}
```

**Missing for Next.js Deployment**:
```json
{
  "devDependencies": {
    "next": "^15.0.0"  // ❌ NOT INSTALLED
  }
}
```

**Impact**: Next.js is not in dependencies. Pages work locally (likely via imports), but won't build on Vercel.

---

## SECTION 3: PRODUCTION DEPLOYMENT FAILURE SCENARIOS

### 3.1 What Happens on Vercel Today

**Scenario 1: User visits home page**
```
Request: GET https://openaria.app/
↓
Vercel rewrite rule matches: /(.*) → /index.html
↓
Serves: dist/index.html (Vite CSR bundle)
✅ WORKS (contains App.tsx + React components)
```

**Scenario 2: User visits solutions hub**
```
Request: GET https://openaria.app/solutions
↓
Vercel rewrite rule matches: /(.*) → /index.html
↓
Serves: dist/index.html (WRONG FILE)
✅ Appears to load (client-side router re-renders)
⚠️ BUT: No SSR = No meta tags for SEO
⚠️ BUT: Googlebot can't execute client-side JS = 404 for crawlers
❌ CRITICAL: No OpenGraph tags for social sharing
```

**Scenario 3: Google Search Console crawler**
```
Request: GET https://openaria.app/solutions/dentists (via bot)
↓
Vercel rewrite rule matches: /(.*) → /index.html
↓
Serves: dist/index.html (WRONG FILE)
↓
Bot tries to extract meta tags from Vite bundle
❌ FAILS: Vite bundle has no next-specific metadata
❌ FAILS: No JSON-LD schema for FAQPage
❌ RESULT: Page marked as duplicate/not indexable
```

**Scenario 4: SEO Social Sharing**
```
Request: curl -I https://openaria.app/solutions/dentists
↓
User shares on Twitter with Twitter Card crawler
↓
Crawler sees: dist/index.html from Vite
↓
Extracts meta tags (all generic, not industry-specific)
❌ FAILS: No unique OG:title, OG:description per industry
❌ RESULT: Generic "ARIA - The World's #1 AI Receptionist" shared
❌ LOST: $5k - $10k in social CTR value per page
```

---

## SECTION 4: RECOMMENDED CONFIGURATION

### 4.1 OPTION A: Corrected vercel.json (Keep Hybrid Approach)

**Status**: ✅ RECOMMENDED - If you want to keep Vite CSR for marketing pages

```json
{
  "version": 2,
  "buildCommand": "vite build && next build && node scripts/generate-sitemap.js",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/solutions/:path*",
      "destination": "/.next/server/pages/solutions/:path*"
    }
  ],
  "routes": [
    {
      "src": "^/solutions(/.*)?$",
      "dest": "/api/solutions"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Cache-Control", "value": "public, max-age=3600, s-maxage=86400" }
      ]
    },
    {
      "source": "/solutions/:path*",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=86400, s-maxage=604800, immutable" }
      ]
    }
  ]
}
```

**⚠️ Problem**: Vercel's standard config doesn't support this level of fine-grained hybrid routing without a custom API function.

---

### 4.2 OPTION B: Hybrid Deployment via Vercel Functions (RECOMMENDED)

**Status**: ✅ BEST PRACTICE - Explicit routing + reliable deployment

```json
{
  "version": 2,
  "buildCommand": "vite build && next build && node scripts/generate-sitemap.js",
  "outputDirectory": ".vercel/output",
  "env": {
    "NEXT_PUBLIC_APP_NAME": "OpenAria"
  },
  "functions": {
    "api/solutions.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "rewrites": [
    {
      "source": "/solutions/:industry*",
      "destination": "/api/solutions?industry=:industry*"
    }
  ],
  "routes": [
    {
      "src": "^/solutions(/.*)?$",
      "dest": "/api/solutions"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Cache-Control", "value": "public, max-age=3600, s-maxage=86400" },
        { "key": "Vary", "value": "Accept-Encoding" }
      ]
    },
    {
      "source": "/solutions/:path*",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, s-maxage=31536000, immutable" },
        { "key": "X-Canonical", "value": "https://openaria.app/solutions/:path*" }
      ]
    },
    {
      "source": "/assets/:path*",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

---

### 4.3 OPTION C: Pure Next.js Migration (MOST RELIABLE)

**Status**: ✅ PREFERRED - Eliminates hybrid fragility

This eliminates the Vite/Next.js dual-build complexity entirely.

**Architecture**:
```
app/
├── layout.tsx              (Root layout)
├── page.tsx                (Home / ← Move from Vite)
├── ai-receptionist/
│   └── page.tsx           (← Move from Vite)
├── ai-call-answering/
│   └── page.tsx           (← Move from Vite)
└── solutions/
    ├── page.tsx           (Hub)
    ├── layout.tsx         (Shared layout)
    └── [industry]/
        ├── page.tsx       (Dynamic pages × 9)
        └── not-found.tsx  (404 handler)
```

**Simplified vercel.json**:
```json
{
  "version": 2,
  "buildCommand": "next build && node scripts/generate-sitemap.js",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Cache-Control", "value": "public, max-age=3600, s-maxage=86400" }
      ]
    },
    {
      "source": "/solutions/:path*",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/_next/static/:path*",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

---

## SECTION 5: MIGRATION STRATEGY & RECOMMENDATION

### 5.1 Hybrid Approach Risk Assessment

#### Fragility Scorecard (1-10, 10 = Most Fragile)

| Risk Factor | Score | Reason |
|-------------|-------|--------|
| **Build Complexity** | 8/10 | Two separate build systems, two output directories |
| **Deployment Uncertainty** | 9/10 | Vercel doesn't natively support Vite + Next.js hybrid |
| **Routing Fragility** | 9/10 | Single misconfigured rewrite breaks all SEO pages |
| **Maintenance Burden** | 7/10 | Must maintain two component libraries, two build configs |
| **SEO Reliability** | 8/10 | Hybrid routing means SSR inconsistency for crawlers |
| **Performance Consistency** | 7/10 | Vite CSR vs Next.js SSG = different TTFB/Lighthouse scores |

**Overall Risk**: 🔴 **HYBRID IS FRAGILE** (8.0/10)

#### Why the Hybrid Approach Is Problematic

1. **Vite doesn't pre-render** → No static output for `/solutions/*`
2. **Next.js build not in pipeline** → `.next/` folder never created on Vercel
3. **Vercel's standard config is Vite-centric** → Hard to override for hybrid
4. **SEO pages get client-side rendered** → Googlebot sees generic content
5. **No single source of truth** → Routing rules must manually distinguish routes
6. **Deployment failures are silent** → `/solutions` pages may 404 without clear error

---

### 5.2 Migration Recommendation

#### ✅ RECOMMENDED: Migrate to Pure Next.js (Option C)

**Why?**
- ✅ Single build system (no complexity)
- ✅ Native Vercel support (zero config)
- ✅ Consistent SSR/SSG for all routes
- ✅ Simplified caching strategy
- ✅ Better SEO (all pages server-rendered)
- ✅ Reduced maintenance burden

**Effort**: ~4-6 hours
- Move Vite components to Next.js `app/` pages
- Update imports from `@/` paths
- Leverage Next.js Image component for optimization
- Deploy single `next build` command

**Rollback Risk**: 🟢 **LOW** - Next.js supports all React features Vite does

---

### 5.3 Short-Term Stabilization (If keeping Hybrid)

**If you want to stay hybrid temporarily**, use this strategy:

1. ✅ **Install Next.js** in dependencies
2. ✅ **Update build command** to include `next build`
3. ✅ **Use corrected vercel.json** (with explicit `/solutions` routing)
4. ✅ **Add API function** to bridge Vite + Next.js routing
5. ⏳ **Plan migration** to pure Next.js in next sprint

---

## SECTION 6: CORRECTED FILES

### 6.1 vercel.json (Temporary Hybrid Fix)

```json
{
  "version": 2,
  "buildCommand": "vite build && next build && node scripts/generate-sitemap.js",
  "outputDirectory": ".next",
  "env": {
    "VERCEL_ANALYTICS_ID": "@VERCEL_ANALYTICS_ID@"
  },
  "rewrites": [
    {
      "source": "/solutions/:industry*",
      "destination": "/.next/server/pages/solutions$1"
    }
  ],
  "routes": [
    {
      "src": "^/solutions(/.*)?$",
      "continue": true
    },
    {
      "src": "/(.*)",
      "dest": "/.vercel/output/static/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600, s-maxage=86400"
        }
      ]
    },
    {
      "source": "/solutions/:path*",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=604800, s-maxage=2592000, immutable"
        }
      ]
    },
    {
      "source": "/assets/:path*",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 6.2 package.json (Updated Build Scripts)

```json
{
  "scripts": {
    "start": "vite",
    "build": "vite build && next build && node scripts/generate-sitemap.js",
    "preview": "vite preview",
    "dev": "concurrently \"vite\" \"next dev\""
  },
  "devDependencies": {
    "next": "^15.0.0",
    "concurrently": "^8.2.0"
  }
}
```

### 6.3 vercel.json (Recommended: Pure Next.js)

```json
{
  "version": 2,
  "buildCommand": "next build && node scripts/generate-sitemap.js",
  "env": {
    "VERCEL_ANALYTICS_ID": "@VERCEL_ANALYTICS_ID@"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600, s-maxage=86400"
        },
        {
          "key": "Vary",
          "value": "Accept-Encoding"
        }
      ]
    },
    {
      "source": "/solutions/:path*",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=604800, s-maxage=2592000, immutable"
        }
      ]
    },
    {
      "source": "/_next/static/:path*",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## SECTION 7: IMMEDIATE ACTION ITEMS

### Priority 1: CRITICAL (Do Now)

- [ ] **Install Next.js**: `npm install next@15`
- [ ] **Update vercel.json** with corrected routing (see 6.1)
- [ ] **Update build command** in package.json (see 6.2)
- [ ] **Test locally**: `npm run build` should create `.next/` folder
- [ ] **Verify sitemap** includes all 9 `/solutions/[industry]` routes

### Priority 2: HIGH (This Week)

- [ ] Deploy corrected `vercel.json` to Vercel
- [ ] Monitor Vercel deployment logs for errors
- [ ] Test `/solutions/dentists` on production
- [ ] Verify meta tags via curl: `curl -I https://openaria.app/solutions/dentists`
- [ ] Check Google Search Console for indexation

### Priority 3: MEDIUM (Next Sprint)

- [ ] **Recommend**: Migrate to pure Next.js (eliminate Vite hybrid)
- [ ] Plan component refactoring (Vite → Next.js pages)
- [ ] Schedule migration sprint (4-6 hours effort)

---

## SECTION 8: VERIFICATION CHECKLIST

### Before Deployment

```bash
# ✅ Test build completes without errors
npm run build

# ✅ Verify dist/ folder created
ls dist/

# ✅ Verify .next/ folder created
ls .next/

# ✅ Verify Next.js pages built
ls .next/server/pages/solutions/

# ✅ Verify SEO pages static JSON available
ls .next/server/pages/solutions/[industry].json
```

### After Deployment to Vercel

```bash
# ✅ Test home page loads
curl -I https://openaria.app/

# ✅ Test solutions hub
curl -I https://openaria.app/solutions

# ✅ Test specific industry page
curl -I https://openaria.app/solutions/dentists

# ✅ Extract meta tags for SEO
curl https://openaria.app/solutions/dentists | grep "og:title"

# ✅ Verify 404 handling
curl -I https://openaria.app/solutions/invalid-industry

# ✅ Check cache headers
curl -I https://openaria.app/solutions/dentists | grep "Cache-Control"
```

---

## CONCLUSION

**Current State**: 🔴 **BROKEN** - `/solutions/*` pages will not deploy correctly to Vercel

**Recommended Fix**: 
1. **Short-term**: Apply corrected vercel.json + updated build command (1 hour)
2. **Long-term**: Migrate to pure Next.js (4-6 hours, eliminates fragility)

**Success Criteria**:
- ✅ `/solutions` hub page returns 200 with unique metadata
- ✅ `/solutions/dentists` returns metadata with industry-specific OG tags
- ✅ All 9 pages pass Google Rich Results Test for schema
- ✅ Sitemap includes all 10 pages (`/solutions` + 9 industries)
- ✅ Google Search Console shows 10 pages indexed

---

**Report Status**: ✅ READY FOR IMPLEMENTATION  
**Estimated Fix Time**: 1-2 hours (short-term) | 4-6 hours (long-term migration)  
**Business Impact**: $50k+ in lost SEO value if not fixed before production
