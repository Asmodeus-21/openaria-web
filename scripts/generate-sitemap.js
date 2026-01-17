/**
 * Sitemap Generation Script
 * Runs after build to generate sitemap.xml
 * 
 * Features:
 * - Generates sitemap for static routes
 * - Dynamically includes all 9 industry solution pages from INDUSTRIES_DATA
 * - Proper priority and changefreq for SEO optimization
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ============================================================================
// IMPORT DYNAMIC INDUSTRIES DATA
// ============================================================================

// Read and parse industriesSemanticData.ts to extract INDUSTRIES_DATA
const dataFilePath = path.join(__dirname, '../data/industriesSemanticData.ts');
const dataFileContent = fs.readFileSync(dataFilePath, 'utf-8');

// Extract industries array from TypeScript file
// This regex captures the INDUSTRIES_DATA array definition
const industriesMatch = dataFileContent.match(/export const INDUSTRIES_DATA: IndustryData\[\] = \[([\s\S]*?)\n\];/);
let industriesSlugs = [];

if (industriesMatch) {
  // Parse each industry entry to extract slug
  const industriesText = industriesMatch[1];
  const slugMatches = industriesText.match(/slug:\s*['"`]([^'"`]+)['"`]/g);
  
  if (slugMatches) {
    industriesSlugs = slugMatches.map(match => 
      match.replace(/slug:\s*['"`]|['"`]/g, '')
    );
  }
}

console.log(`📊 Found ${industriesSlugs.length} industries for sitemap`);

// ============================================================================
// STATIC ROUTES
// ============================================================================

const SITE_URL = 'https://openaria.app';
const STATIC_ROUTES = [
  { url: '/', priority: 1.0, changefreq: 'weekly' },
  { url: '/ai-receptionist', priority: 0.95, changefreq: 'weekly' },
  { url: '/ai-call-answering', priority: 0.9, changefreq: 'weekly' },
  { url: '/solutions', priority: 0.95, changefreq: 'weekly' },  // Solutions hub
];

// ============================================================================
// DYNAMIC INDUSTRY ROUTES
// ============================================================================

const INDUSTRY_ROUTES = industriesSlugs.map(slug => ({
  url: `/solutions/${slug}`,
  priority: 0.9,
  changefreq: 'weekly'
}));

// Combine all routes
const SITEMAP_ROUTES = [...STATIC_ROUTES, ...INDUSTRY_ROUTES];

// ============================================================================
// GENERATE SITEMAP XML
// ============================================================================

function generateSitemap() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SITEMAP_ROUTES.map(
  ({ url, priority, changefreq }) => `  <url>
    <loc>${SITE_URL}${url}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`
).join('\n')}
</urlset>`;

  return sitemap;
}

// ============================================================================
// OUTPUT SITEMAP
// ============================================================================

// Generate sitemap XML
const sitemapXml = generateSitemap();

// Write to public/sitemap.xml so it gets deployed
const publicSitemapPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(publicSitemapPath, sitemapXml);

// Also write to dist for local testing
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  const distSitemapPath = path.join(distPath, 'sitemap.xml');
  fs.writeFileSync(distSitemapPath, sitemapXml);
}

// ============================================================================
// VERIFICATION & LOGGING
// ============================================================================

console.log('');
console.log('✅ Sitemap Generation Complete');
console.log('─'.repeat(60));
console.log(`📍 Site URL: ${SITE_URL}`);
console.log(`📄 Static routes: ${STATIC_ROUTES.length}`);
console.log(`🏭 Industry routes: ${INDUSTRY_ROUTES.length}`);
console.log(`📊 Total URLs: ${SITEMAP_ROUTES.length}`);
console.log('─'.repeat(60));
console.log('🔗 Industries included:');
industriesSlugs.forEach((slug, idx) => {
  console.log(`   ${idx + 1}. /solutions/${slug}`);
});
console.log('─'.repeat(60));
console.log(`💾 Output: public/sitemap.xml`);
console.log('');

