import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
    fetchSSGData,
    renderRouteToHtml,
    STATIC_PAGE_SEO,
    CATEGORY_SEO_ROUTES,
    SLUG_ALIASES
} from './ssgRenderer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLIENT_ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.join(CLIENT_ROOT, 'dist');
const PUBLIC_DIR = path.join(CLIENT_ROOT, 'public');
const SITE_URL = 'https://thekaransinghvaidh.com';

async function runSSGPrerender() {
    console.log('\n🚀 [SSG] Starting React + Vite Static Site Generation (SSG)...');

    const distIndexPath = path.join(DIST_DIR, 'index.html');
    if (!fs.existsSync(distIndexPath)) {
        console.error('❌ [SSG] dist/index.html not found! Run `vite build` first.');
        process.exit(1);
    }

    // Keep clean template before any route injection
    const baseTemplate = fs.readFileSync(distIndexPath, 'utf8');

    // Fetch live products & blogs from backend (or cache fallback)
    const { products, blogs } = await fetchSSGData();
    console.log(`📦 [SSG] Loaded ${products.length} products and ${blogs.length} blogs from API/cache.`);

    // Build complete list of public routes to pre-render
    const routesSet = new Set([
        ...Object.keys(STATIC_PAGE_SEO),
        ...Object.keys(CATEGORY_SEO_ROUTES)
    ]);

    // Add all product slugs
    for (const p of products) {
        if (p.slug) {
            routesSet.add(`/product/${p.slug}`);
        }
    }
    // Add all product alias slugs so they also have complete HTML
    for (const aliasSlug of Object.keys(SLUG_ALIASES)) {
        routesSet.add(`/product/${aliasSlug}`);
    }

    // Add all blog slugs
    for (const b of blogs) {
        if (b.slug) {
            routesSet.add(`/blog/${b.slug}`);
            routesSet.add(`/blogs/${b.slug}`);
            routesSet.add(`/ayurvedic-blog/${b.slug}`);
        }
    }

    const routes = Array.from(routesSet);
    let generatedCount = 0;

    for (const route of routes) {
        const html = renderRouteToHtml(baseTemplate, route, { products, blogs });

        if (route === '/') {
            fs.writeFileSync(distIndexPath, html, 'utf8');
        } else {
            const cleanRoute = route.replace(/^\/+|\/+$/g, '');
            const routeDir = path.join(DIST_DIR, cleanRoute);
            fs.mkdirSync(routeDir, { recursive: true });
            fs.writeFileSync(path.join(routeDir, 'index.html'), html, 'utf8');
        }
        generatedCount++;
    }

    // Generate updated sitemap.xml with all canonical routes
    const today = new Date().toISOString().split('T')[0];
    const canonicalRoutes = new Set([
        '/',
        '/ayurvedic-products',
        '/ayurvedic-treatment-products',
        '/about-ayurvedic-doctor-in-solan',
        '/contact',
        '/book-appointment',
        '/patient-reports',
        '/blogs',
        '/faq',
        '/ayurvedic-asthma-treatment',
        '/gallbladder-stone-ayurvedic-treatment',
        '/ayurvedic-piles-treatment',
        '/ayurvedic-gastric-treatment',
        '/ayurvedic-diabetes-treatment',
        '/ayurvedic-tuberculosis-support',
        '/ayurvedic-migraine-treatment',
        '/ayurvedic-thyroid-treatment',
        '/kidney-stone-ayurvedic-treatment',
        '/high-blood-pressure-ayurvedic-treatment'
    ]);

    for (const p of products) {
        if (p.slug) canonicalRoutes.add(`/product/${p.slug}`);
    }
    for (const b of blogs) {
        if (b.slug) canonicalRoutes.add(`/blog/${b.slug}`);
    }

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Array.from(canonicalRoutes).map(r => {
    const priority = r === '/' ? '1.0' : r.startsWith('/product/') || r.includes('-treatment') ? '0.9' : '0.8';
    const changefreq = r === '/' || r === '/ayurvedic-products' || r === '/blogs' ? 'daily' : 'weekly';
    return `  <url>
    <loc>${SITE_URL}${r === '/' ? '/' : r}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}).join('\n')}
</urlset>
`;

    fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf8');
    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapXml, 'utf8');

    console.log(`✅ [SSG] Pre-rendered ${generatedCount} static HTML pages into dist/<route>/index.html`);
    console.log(`🗺️  [SSG] Updated sitemap.xml with ${canonicalRoutes.size} canonical URLs.\n`);
}

runSSGPrerender().catch((err) => {
    console.error('❌ [SSG] Error during pre-render:', err);
    process.exit(1);
});
