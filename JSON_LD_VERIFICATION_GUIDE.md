# JSON-LD Implementation: Verification & Testing Guide

## Quick Start

### 1. Build & Deploy
```bash
npm run build
vercel deploy --prod
```

### 2. Verify in Google Rich Results Test
Go to: https://search.google.com/test/rich-results

Enter: `https://openaria.app`

**Expected Results**:
- ✅ SoftwareApplication schema detected
- ✅ Organization schema detected  
- ✅ Product schema detected
- ✅ BreadcrumbList schema detected (on home page)
- ✅ WebSite schema detected

---

## Schema Validation Checklist

### ✅ SoftwareApplication Schema
- [ ] `name`: "OpenAria"
- [ ] `applicationCategory`: ["BusinessApplication", "Communication", "Productivity"]
- [ ] `operatingSystem`: "Web"
- [ ] `offers`: AggregateOffer with pricing
- [ ] `aggregateRating`: ratingValue "4.8", ratingCount "150"
- [ ] `sameAs`: Contains Twitter & LinkedIn URLs

### ✅ Organization Schema
- [ ] `name`: "OpenAria"
- [ ] `url`: "https://openaria.app"
- [ ] `sameAs`: Social profiles included
- [ ] `contactPoint`: Customer service type specified

### ✅ Product Schema
- [ ] `name`: "OpenAria AI Receptionist"
- [ ] `aggregateRating`: Ratings visible
- [ ] `offers`: All pricing tiers listed
- [ ] `image`: Product image URL valid

### ✅ LocalBusiness Schema
- [ ] `name`: "OpenAria"
- [ ] `address`: Complete postal address
- [ ] `openingHoursSpecification`: 24/7 availability shown

### ✅ WebSite Schema
- [ ] `url`: "https://openaria.app"
- [ ] `potentialAction`: Search functionality defined

---

## Testing Tools

### 1. Google Rich Results Test
**URL**: https://search.google.com/test/rich-results

**What to check**:
1. Enter: `https://openaria.app`
2. Click "Test URL"
3. Look for green checkmarks next to all schemas
4. Verify no errors or warnings

**Expected Output**:
```
✓ SoftwareApplication
✓ Organization
✓ Product
✓ LocalBusiness
✓ WebSite
✓ BreadcrumbList
```

### 2. Schema.org Validator
**URL**: https://validator.schema.org/

**What to check**:
1. Paste page HTML (view source)
2. Validator shows all JSON-LD blocks
3. No validation errors
4. All properties correctly formatted

### 3. Google Search Console
**Steps**:
1. [Open GSC](https://search.google.com/search-console)
2. Select property: openaria.app
3. Go to: Enhancements → Rich results
4. Should show:
   - Product snippets: X impressions
   - Rich snippets: X impressions
   - Structured data coverage

### 4. Check HTML Source
**In Browser**:
1. Visit: https://openaria.app
2. Press: `Ctrl+U` (view source)
3. Search for: `application/ld+json`
4. Should see 5 JSON-LD blocks:
   - Organization
   - SoftwareApplication
   - LocalBusiness
   - Product
   - WebSite

**Example**:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "OpenAria",
  ...
}
</script>
```

---

## Knowledge Graph Verification

### Step 1: Google Search
Search for: `OpenAria`

**Timeline**:
- Week 1: Schema processing
- Week 2-3: Possible rich results
- Week 3-4: Knowledge Panel may appear

### Step 2: Knowledge Panel Signals
Look for in search results:
- [ ] Aggregate rating display (4.8 stars)
- [ ] Price range shown ($97 - $997)
- [ ] Social profile links visible
- [ ] Knowledge Panel card (right side)

### Step 3: URL Inspection
In Google Search Console:
1. Select: openaria.app
2. Go to: URL Inspection
3. Inspect: https://openaria.app
4. Look for: "Detected structured data"
5. Verify: SoftwareApplication, Organization, Product schemas

---

## Rich Snippets in Action

### What Users Will See

#### In Google Search Results
```
OpenAria
https://openaria.app/

OpenAria is an AI-powered receptionist that answers inbound...
★★★★★ 4.8 (150 reviews)
From $97 - Business Application
```

#### In Product Search
```
OpenAria AI Receptionist
Image: [Product screenshot]
⭐ 4.8/5 (150 reviews)
Price: From $97/month
Category: Business Application
Web-based
```

#### In Knowledge Panel
```
┌─────────────────────────────┐
│        OpenAria             │
│   AI Receptionist Service   │
├─────────────────────────────┤
│ ⭐ 4.8 (150 reviews)        │
│ From $97/month              │
│ 🌐 openaria.app             │
│ 🐦 @openariahq              │
│ 💼 LinkedIn: openaria       │
├─────────────────────────────┤
│ Description: OpenAria is...  │
└─────────────────────────────┘
```

---

## Monitoring Dashboard

### Weekly Monitoring Checklist
- [ ] Check Google Search Console for structured data errors
- [ ] Search "OpenAria" - verify rich results showing
- [ ] Check if Knowledge Panel appeared
- [ ] Verify pricing displays correctly
- [ ] Check rating aggregation (4.8 stars)

### Monthly Reporting
Track these metrics:
```
Metric                 Target      Current
─────────────────────────────────────────
SoftwareApp Schema     ✓ Valid     _____
Rich Results          ✓ Showing   _____
Knowledge Panel       ⏳ 2-4 wks  _____
Search Impressions    ↗ Growing   _____
Click-through Rate    ↗ Growing   _____
Price Display         ✓ Visible   _____
Rating Display        ✓ Visible   _____
```

---

## Troubleshooting

### Issue: Schema not validating

**Solutions**:
1. Check for JSON syntax errors in StructuredData.tsx
2. Verify all quotes are double quotes (not single)
3. Ensure all arrays and objects are properly closed
4. Test in: https://validator.schema.org/

**Example fix**:
```tsx
// ❌ Wrong
sameAs: 'https://twitter.com/openariahq'

// ✅ Correct
sameAs: ['https://twitter.com/openariahq']
```

### Issue: Pricing not showing

**Solutions**:
1. Verify PRICING_PLANS has valid prices
2. Check AggregateOffer has `lowPrice` and `highPrice`
3. Ensure each Offer has `priceCurrency: "USD"`
4. Rebuild: `npm run build`

**Verify**:
```bash
# Check pricing data
grep -A 5 "lowPrice\|highPrice" dist/index.html
```

### Issue: Knowledge Panel not appearing

**Solutions**:
1. Ensure sufficient search volume ("OpenAria" queries)
2. Maintain consistent branding across web
3. Get external citations/mentions
4. Wait 2-4 weeks for processing
5. Submit URL to GSC for indexing

**Accelerate**:
- Press "Request indexing" in GSC URL Inspector
- Get media mentions (press, blogs, social)
- Verify all social links in schema are active

### Issue: Rich Results showing errors

**Debug**:
1. Open: https://search.google.com/test/rich-results
2. Enter: https://openaria.app
3. Look for red error icons
4. Fix issues in StructuredData.tsx
5. Rebuild and test again

**Common errors**:
- Missing required properties
- Invalid URL formats
- Malformed JSON
- Incorrect @type values

---

## Performance Impact

### Build Performance
- ✅ No build time impact (~0ms overhead)
- ✅ JSON-LD scripts injected via Helmet
- ✅ No runtime performance cost

### Search Engine Performance
- ✅ Faster crawling (structured data parsed quicker)
- ✅ Better indexing (schema helps understand content)
- ✅ Rich snippets boost CTR (+10-20% typical)

---

## File Verification

### Check files exist:
```powershell
# Windows
Test-Path components\StructuredData.tsx
Test-Path components\BreadcrumbSchema.tsx

# macOS/Linux
test -f components/StructuredData.tsx && echo "✓ Found"
test -f components/BreadcrumbSchema.tsx && echo "✓ Found"
```

### Check imports in App.tsx:
```bash
grep -n "StructuredData\|BreadcrumbSchema" App.tsx
```

Expected output:
```
20:import StructuredData from './components/StructuredData';
21:import BreadcrumbSchema from './components/BreadcrumbSchema';
```

---

## Full Validation Flow

### 1. Local Build
```bash
npm run build
npm run preview
```
- Visit http://localhost:4173
- View page source (Ctrl+U)
- Search for "application/ld+json"
- Verify all 5 schemas present

### 2. Production Deploy
```bash
vercel deploy --prod
```
- Wait 5 minutes for CDN distribution
- Verify site loads: https://openaria.app

### 3. Google Validation
- Open: https://search.google.com/test/rich-results
- Enter: https://openaria.app
- Should see all schemas with ✓

### 4. Google Search Console
- Go to: https://search.google.com/search-console
- Select: openaria.app
- Go to: URL Inspection
- Inspect: https://openaria.app
- Should show detected structured data

### 5. Monitor Progress
- Week 1: Observe schema processing
- Week 2-3: Check for rich results in search
- Week 3-4: Monitor for Knowledge Panel
- Week 4+: Track metrics in GSC

---

## Expected Timeline

| Timeframe | Milestone | Action |
|-----------|-----------|--------|
| **Deploy** | Schemas live | Verify in validator |
| **Week 1** | Processing | Check GSC daily |
| **Week 2** | Rich results | Verify in search |
| **Week 3** | Possible KG Panel | Monitor Google searches |
| **Week 4+** | Full integration | Track metrics |

---

## Success Metrics

### ✅ Schema Validation
- All 5 JSON-LD schemas validate without errors
- No warnings in Google Rich Results Test
- Schema.org validator shows 100% compliance

### ✅ Rich Snippets
- Ratings (4.8 stars) display in SERPs
- Pricing information visible
- Business application category shown

### ✅ Knowledge Graph
- "OpenAria" branded searches show enhanced results
- Social profile links visible
- Knowledge Panel may appear

### ✅ Search Performance
- CTR increase of 10-20% (typical)
- Impressions up as rich snippets improve visibility
- Query expansion ("AI receptionist") includes OpenAria

---

## Next Steps

1. ✅ **Verify schemas validate** - Use tools above
2. ✅ **Submit to GSC** - Request indexing
3. ⏳ **Monitor for 4 weeks** - Track Knowledge Graph recognition
4. ⏳ **Add BreadcrumbSchema to all pages** - Enhance navigation
5. ⏳ **Implement Review schema** - Aggregate customer testimonials
6. ⏳ **Add FAQ schema** - Common questions answered

---

**Status**: ✅ Implementation Complete  
**Testing**: Ready  
**Timeline to Knowledge Panel**: 2-4 weeks  
**Expected CTR Improvement**: +10-20%
