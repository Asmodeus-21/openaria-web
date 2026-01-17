# SEO Refactor: Server-Side Canonical URLs with Vite

## Problem Solved

**Previous Issue**: Canonical tags were generated client-side using the `useLocation` hook, meaning they were only injected into the DOM after JavaScript executed. This caused delays with Googlebot's Web Rendering Service (WRS), which has a latency period between fetching the HTML and executing JavaScript.

**Solution**: Canonical tags are now injected at **build time** by a custom Vite plugin (`vite-plugin-canonical.ts`), ensuring they're present in the initial HTML response.

---

## How It Works

### 1. Build-Time Injection (`vite-plugin-canonical.ts`)

The Vite plugin:
- Runs during the build process (after bundling)
- Iterates through all predefined routes
- Creates route-specific HTML files (or copies from `dist/index.html`)
- Injects canonical tags directly into each HTML file's `<head>`
- Writes updated HTML back to disk

**Key Routes Supported**:
```
/ → https://openaria.app/
/ai-receptionist → https://openaria.app/ai-receptionist
/ai-call-answering → https://openaria.app/ai-call-answering
/industries/real-estate → https://openaria.app/industries/real-estate
/industries/healthcare → https://openaria.app/industries/healthcare
/industries/hvac → https://openaria.app/industries/hvac
/industries/law-firms → https://openaria.app/industries/law-firms
/blog/ai-receptionist-vs-human → https://openaria.app/blog/ai-receptionist-vs-human
/blog/missed-calls-cost → https://openaria.app/blog/missed-calls-cost
/blog/small-business-ai-receptionist → https://openaria.app/blog/small-business-ai-receptionist
/legal → https://openaria.app/legal
```

### 2. SEOHead Component (`components/SEOHead.tsx`)

- Uses React Helmet to manage meta tags at runtime
- **Removed** the `useLocation` hook (no more client-side route detection)
- Canonical tags from `seo.config.ts` are passed as props and rendered
- For routes without a predefined canonical in `seo.config.ts`, the build-time injected tag applies
- All other SEO meta tags (OG, Twitter) remain functional

### 3. Updated vite.config.ts

- Imports and registers the `canonicalPlugin()`
- Plugin runs after the build completes

---

## Build Process

When you run `npm run build`:

1. **Vite bundles React app** → `dist/` folder
2. **CSS/JS minified and hashed**
3. **canonicalPlugin runs** → Injects canonical tags into HTML files
4. **Sitemap generated** → `scripts/generate-sitemap.js`

**Final Output**:
```
dist/
├── index.html                          (with canonical: https://openaria.app/)
├── ai-receptionist/index.html          (with canonical: https://openaria.app/ai-receptionist)
├── ai-call-answering/index.html        (with canonical: https://openaria.app/ai-call-answering)
├── industries/
│   ├── real-estate/index.html
│   ├── healthcare/index.html
│   ├── hvac/index.html
│   └── law-firms/index.html
├── blog/
│   ├── ai-receptionist-vs-human/index.html
│   ├── missed-calls-cost/index.html
│   └── small-business-ai-receptionist/index.html
├── legal/index.html
├── assets/
│   ├── main.xxxxx.js
│   └── main.xxxxx.css
└── sitemap.xml
```

---

## Verification

### 1. Check Initial HTML Response

After building, inspect any HTML file:

```bash
cat dist/ai-receptionist/index.html | grep "canonical"
```

Expected output:
```html
<link rel="canonical" href="https://openaria.app/ai-receptionist" />
```

### 2. Build Command

```bash
npm run build
```

Console output will show:
```
✓ Canonical tag injected: / → https://openaria.app/
✓ Canonical tag injected: /ai-receptionist → https://openaria.app/ai-receptionist
✓ Canonical tag injected: /ai-call-answering → https://openaria.app/ai-call-answering
... (all routes listed)
```

### 3. Test with Local Server

```bash
npm run preview
```

Open DevTools → Network tab → Click any page → Headers → Look for `Link: <...>; rel="canonical"`

---

## Adding New Routes

To add a new route's canonical tag:

1. **Edit `vite-plugin-canonical.ts`** → Add to `routes` array:
   ```typescript
   { path: '/new-page', canonical: 'https://openaria.app/new-page' }
   ```

2. **Edit `seo.config.ts`** → Add metadata:
   ```typescript
   export const NEW_PAGE_META: PageMetadata = {
     title: '...',
     description: '...',
     canonical: 'https://openaria.app/new-page',
     ...
   };
   ```

3. **Rebuild**:
   ```bash
   npm run build
   ```

---

## Why This Approach?

| Aspect | Client-Side (Previous) | Build-Time (Current) |
|--------|----------------------|----------------------|
| **HTML Fetch** | Canonical ❌ | Canonical ✅ |
| **JS Execution** | Canonical ✅ | Canonical ✅ |
| **Googlebot WRS** | Latency issue ⚠️ | Immediate ✅ |
| **SEO Impact** | Slower indexing | Faster indexing |
| **Performance** | Extra JS | Zero runtime cost |

---

## Future: Migration to Next.js App Router

When ready, this build-time approach can be replaced with Next.js Metadata API:

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://openaria.app'),
};

// app/ai-receptionist/page.tsx
export const metadata: Metadata = {
  title: 'AI Receptionist for Businesses | OpenAria - 24/7 Call Answering',
  description: '...',
  canonical: 'https://openaria.app/ai-receptionist',
};
```

This would be **true server-side rendering** with dynamic route support.

---

## Files Modified

- **Created**: `vite-plugin-canonical.ts` - Custom Vite plugin for canonical injection
- **Updated**: `vite.config.ts` - Register plugin
- **Updated**: `components/SEOHead.tsx` - Removed `useLocation` hook
- **Unchanged**: `seo.config.ts` - Metadata definitions remain the same

---

## Testing Canonical Tags

### Using cURL:
```bash
curl -I https://openaria.app/ai-receptionist | grep -i canonical
```

### Using SEO Inspection Tools:
- Google Search Console → Coverage → URL Inspection
- Screaming Frog → Display → Response Headers
- Ahrefs → Site Audit → Page Report

---

## Troubleshooting

### Canonical tag not appearing?

1. **Rebuild**: `npm run build`
2. **Check output**: `cat dist/your-route/index.html | grep canonical`
3. **Verify plugin runs**: Look for `✓ Canonical tag injected` in console

### Wrong canonical URL?

1. Update `vite-plugin-canonical.ts` → `routes` array
2. Update `seo.config.ts` → corresponding metadata object
3. Rebuild: `npm run build`

### Multiple canonical tags?

The plugin removes existing ones before injecting. If duplicates appear:
1. Clear `dist/` folder: `rm -rf dist/`
2. Rebuild: `npm run build`

---

## Summary

✅ Canonical tags now in initial HTML response  
✅ No client-side JavaScript required for canonical URLs  
✅ Googlebot sees canonicals immediately (WRS compatible)  
✅ Build-time injection = zero runtime performance impact  
✅ All routes automatically get canonical tags on build  
✅ Easy to add new routes  
