/**
 * Vite Plugin: Inject Canonical URLs at Build Time
 * This plugin injects canonical tags into the HTML during the build process
 * so they're available in the initial HTML response, not client-side injected
 */

import { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

interface CanonicalRoute {
  path: string;
  canonical: string;
}

export function canonicalPlugin(): Plugin {
  const routes: CanonicalRoute[] = [
    { path: '/', canonical: 'https://openaria.app/' },
    { path: '/ai-receptionist', canonical: 'https://openaria.app/ai-receptionist' },
    { path: '/ai-call-answering', canonical: 'https://openaria.app/ai-call-answering' },
    { path: '/industries/real-estate', canonical: 'https://openaria.app/industries/real-estate' },
    { path: '/industries/healthcare', canonical: 'https://openaria.app/industries/healthcare' },
    { path: '/industries/hvac', canonical: 'https://openaria.app/industries/hvac' },
    { path: '/industries/law-firms', canonical: 'https://openaria.app/industries/law-firms' },
    { path: '/blog/ai-receptionist-vs-human', canonical: 'https://openaria.app/blog/ai-receptionist-vs-human' },
    { path: '/blog/missed-calls-cost', canonical: 'https://openaria.app/blog/missed-calls-cost' },
    { path: '/blog/small-business-ai-receptionist', canonical: 'https://openaria.app/blog/small-business-ai-receptionist' },
    { path: '/legal', canonical: 'https://openaria.app/legal' },
  ];

  return {
    name: 'canonical-plugin',
    apply: 'build',
    enforce: 'post',
    async writeBundle() {
      const outDir = 'dist';
      
      // Process each route's HTML file
      for (const route of routes) {
        const htmlPath = path.join(outDir, route.path === '/' ? 'index.html' : `${route.path}/index.html`);
        
        // Ensure directory exists
        const dir = path.dirname(htmlPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        // Copy index.html to route path if it doesn't exist
        if (!fs.existsSync(htmlPath)) {
          const srcIndexPath = path.join(outDir, 'index.html');
          if (fs.existsSync(srcIndexPath)) {
            fs.mkdirSync(dir, { recursive: true });
            fs.copyFileSync(srcIndexPath, htmlPath);
          }
        }

        // Update HTML with canonical tag
        if (fs.existsSync(htmlPath)) {
          let html = fs.readFileSync(htmlPath, 'utf-8');
          
          // Remove existing canonical tag if present
          html = html.replace(/<link rel="canonical"[^>]*>/g, '');
          
          // Insert canonical tag in <head> before </head>
          const canonicalTag = `<link rel="canonical" href="${route.canonical}" />`;
          html = html.replace('</head>', `${canonicalTag}\n</head>`);
          
          fs.writeFileSync(htmlPath, html);
          console.log(`✓ Canonical tag injected: ${route.path} → ${route.canonical}`);
        }
      }
    }
  };
}
