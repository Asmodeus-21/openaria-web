# ⚡ Quick Reference Card

## One-Page SEO Refactor Summary

### 🎯 What Changed
- **Removed**: Client-side `useLocation` hook for canonical generation
- **Added**: Build-time canonical injection via `vite-plugin-canonical.ts`
- **Result**: Canonical tags in initial HTML response (WRS compatible)

---

## 📋 Checklist

### Pre-Build
- [ ] All routes defined in `vite-plugin-canonical.ts`
- [ ] Metadata defined in `seo.config.ts`
- [ ] `vite.config.ts` imports plugin
- [ ] `components/SEOHead.tsx` updated (no useLocation)

### Build
```bash
npm run build
```
- [ ] Completes without errors
- [ ] Shows "✓ Canonical tag injected" × 11
- [ ] `dist/` folder created

### Verify
```powershell
Get-Content dist/ai-receptionist/index.html | Select-String "canonical"
```
- [ ] Canonical tag found in HTML
- [ ] URL matches `https://openaria.app/ai-receptionist`

### Test Locally
```bash
npm run preview
```
- [ ] Pages load correctly
- [ ] Canonical visible in DevTools
- [ ] No console errors

### Deploy
```bash
vercel deploy --prod
```
- [ ] Build succeeds
- [ ] Site loads on production
- [ ] Canonical tag in live HTML

---

## 🔑 Key Files

| File | Purpose | Status |
|------|---------|--------|
| `vite-plugin-canonical.ts` | Build-time injector | ✅ NEW |
| `vite.config.ts` | Plugin registration | ✅ UPDATED |
| `components/SEOHead.tsx` | Meta tag manager | ✅ UPDATED |
| `seo.config.ts` | Metadata definitions | ✅ OK |
| `public/robots.txt` | Crawler rules | ✅ UPDATED |

---

## 📚 Documentation Map

| Document | Use When |
|----------|----------|
| **SEO_REFACTOR_README.md** | Need overview |
| **SEO_ARCHITECTURE_DIAGRAMS.md** | Need visual flow |
| **SEO_REFACTOR_SUMMARY.md** | Need details |
| **SEO_REFACTOR_SERVER_SIDE.md** | Need technical deep-dive |
| **BUILD_AND_DEPLOY_GUIDE.md** | Ready to build/deploy |
| **NEXT_JS_MIGRATION_GUIDE.md** | Planning future upgrade |

---

## 🚀 Build & Deploy Flow

```
npm run build
    ↓
✓ Check: 11 canonicals injected
    ↓
npm run preview
    ↓
✓ Check: DevTools shows <link rel="canonical" ...>
    ↓
vercel deploy --prod
    ↓
✓ Check: curl https://openaria.app/... | grep canonical
    ↓
✓ Submit to Google Search Console
    ↓
DONE! 🎉
```

---

## 🔧 Adding New Routes

1. **Update `vite-plugin-canonical.ts`**:
   ```typescript
   { path: '/new-page', canonical: 'https://openaria.app/new-page' }
   ```

2. **Update `seo.config.ts`**:
   ```typescript
   export const NEW_PAGE_META = {
     title: '...',
     canonical: 'https://openaria.app/new-page',
     ...
   }
   ```

3. **Rebuild**:
   ```bash
   npm run build
   ```

---

## 🧪 Verification Commands

### Windows PowerShell
```powershell
# Check canonical in HTML
Get-Content dist/ai-receptionist/index.html | Select-String "canonical"

# Check all routes have canonicals
Get-ChildItem dist -Recurse -Include "index.html" | 
  ForEach-Object { 
    Write-Host "Checking: $_"
    Get-Content $_ | Select-String "canonical"
  }
```

### macOS/Linux
```bash
# Check canonical
grep canonical dist/ai-receptionist/index.html

# Check all canonicals
find dist -name "index.html" -exec grep -l "canonical" {} \;
```

### Live Site
```bash
# Check production
curl -I https://openaria.app/ai-receptionist | grep -i canonical

# Full check
curl https://openaria.app/ai-receptionist | grep -E "canonical|og:url|twitter:url"
```

---

## ⚠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| No "✓ Canonical injected" | Check `vite-plugin-canonical.ts` routes array |
| Canonical not in HTML | `rm -rf dist/` then `npm run build` |
| Plugin not running | Verify `vite.config.ts` includes plugin |
| Multiple canonicals | Plugin auto-removes, rebuild with clean dist |
| Build fails | Check TypeScript errors, verify plugin syntax |

---

## 📊 Routes Covered

```
/                                          ✅
/ai-receptionist                           ✅
/ai-call-answering                         ✅
/industries/real-estate                    ✅
/industries/healthcare                     ✅
/industries/hvac                           ✅
/industries/law-firms                      ✅
/blog/ai-receptionist-vs-human             ✅
/blog/missed-calls-cost                    ✅
/blog/small-business-ai-receptionist       ✅
/legal                                     ✅
```

---

## 🎯 Success Criteria

✅ Canonical tags in initial HTML (not JS-injected)  
✅ All 11 routes have correct canonicals  
✅ Google Search Console detects canonicals  
✅ No "Duplicate without user-selected canonical" errors  
✅ Indexing speed improves  
✅ Zero runtime performance impact  

---

## 📞 Quick Help

**Technical questions?** → [SEO_REFACTOR_SERVER_SIDE.md](./SEO_REFACTOR_SERVER_SIDE.md)  
**Deployment issues?** → [BUILD_AND_DEPLOY_GUIDE.md](./BUILD_AND_DEPLOY_GUIDE.md)  
**Visual learner?** → [SEO_ARCHITECTURE_DIAGRAMS.md](./SEO_ARCHITECTURE_DIAGRAMS.md)  
**Future planning?** → [NEXT_JS_MIGRATION_GUIDE.md](./NEXT_JS_MIGRATION_GUIDE.md)  

---

## ✨ Bottom Line

| Before | After |
|--------|-------|
| Canonical in JS | ✅ **Canonical in HTML** |
| WRS latency | ✅ **Immediate indexing** |
| Manual hook | ✅ **Automatic injection** |
| 1KB+ JS overhead | ✅ **Zero overhead** |

**Ready?** → `npm run build` → `vercel deploy --prod` → Done! 🚀

---

**Last Updated**: January 17, 2026  
**Status**: ✅ Production Ready
