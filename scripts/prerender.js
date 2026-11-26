import fs from 'fs';
import path from 'path';
import http from 'http';
import { spawn } from 'child_process';
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
const DOM_CACHE_FILE = path.join(__dirname, 'ssg-dom-cache.json');
const SITE_URL = 'https://thekaransinghvaidh.com';

const EXTRA_PUBLIC_ROUTES = [
    '/login',
    '/register',
    '/forgot-password',
    '/cart',
    '/checkout'
];

/**
 * Cleanly pretty-prints an HTML string so View Page Source (Ctrl+U) shows multi-line indented HTML
 */
export function prettyPrintHtml(rawHtml = '') {
    if (!rawHtml) return '';
    // Keep SVGs compact on single lines so the source code focuses on readable HTML structure
    const svgPlaceholders = [];
    let html = rawHtml.replace(/<svg[\s\S]*?<\/svg>/gi, (match) => {
        const idx = svgPlaceholders.length;
        svgPlaceholders.push(match.replace(/\s+/g, ' ').trim());
        return `__SVG_PLACEHOLDER_${idx}__`;
    });

    // Insert line breaks between adjacent tags
    html = html.replace(/>\s*</g, '>\n<');

    const voidTags = new Set([
        'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
        'link', 'meta', 'param', 'source', 'track', 'wbr'
    ]);

    const lines = html.split('\n');
    let indent = 2;
    const formatted = [];

    for (let rawLine of lines) {
        const line = rawLine.trim();
        if (!line) continue;

        const isClosingTag = /^<\//.test(line);
        const isCommentOrDoctype = /^<!--|^<!/.test(line);
        const isSelfClosing = /\/>$/.test(line);
        const tagMatch = line.match(/^<([a-zA-Z0-9-]+)[\s>]/);
        const tagName = tagMatch ? tagMatch[1].toLowerCase() : null;
        const isVoid = tagName ? voidTags.has(tagName) : false;
        const hasClosingOnSameLine = tagName
            ? new RegExp(`</${tagName}>\\s*$`, 'i').test(line)
            : false;

        if (isClosingTag && indent > 2) {
            indent--;
        }

        const pad = '  '.repeat(Math.max(0, indent));
        formatted.push(`${pad}${line}`);

        if (
            tagName &&
            !isClosingTag &&
            !isCommentOrDoctype &&
            !isSelfClosing &&
            !isVoid &&
            !hasClosingOnSameLine
        ) {
            indent++;
        }
    }

    let result = formatted.join('\n');
    svgPlaceholders.forEach((svgStr, idx) => {
        result = result.replace(`__SVG_PLACEHOLDER_${idx}__`, svgStr);
    });
    return result;
}

/**
 * Find installed Chrome / Edge / Chromium binary for real React DOM pre-rendering
 */
function findBrowserExecutable() {
    const candidates = [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
        '/usr/bin/google-chrome',
        '/usr/bin/google-chrome-stable',
        '/usr/bin/chromium-browser',
        '/usr/bin/chromium'
    ];
    for (const c of candidates) {
        if (fs.existsSync(c)) return c;
    }
    return null;
}

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
};

/**
 * Starts a fast local HTTP server serving dist/ + instant in-memory /api responses
 */
function startLocalSSGServer(baseTemplate, { products, blogs }) {
    return new Promise((resolve) => {
        const categories = Array.from(
            new Map(
                products
                    .filter((p) => p.category && (p.category.name || typeof p.category === 'string'))
                    .map((p) => {
                        const catObj = typeof p.category === 'object' ? p.category : { _id: p.category, name: p.category };
                        return [catObj.name, catObj];
                    })
            ).values()
        );

        const server = http.createServer((req, res) => {
            const urlObj = new URL(req.url, 'http://localhost');
            const pathname = decodeURIComponent(urlObj.pathname);

            // Mock API endpoints for instant <1ms response during pre-rendering
            if (pathname === '/api/products') {
                res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                res.end(JSON.stringify(products));
                return;
            }
            if (pathname.startsWith('/api/products/')) {
                const rawSlug = pathname.replace('/api/products/', '').replace(/\/+$/, '');
                const resolvedSlug = SLUG_ALIASES[rawSlug] || rawSlug;
                const stripped = resolvedSlug.replace(/-\d+$/, '');
                const prod = products.find(
                    (p) =>
                        p.slug === rawSlug ||
                        p.slug === resolvedSlug ||
                        p.slug === stripped ||
                        p.slug === `${stripped}-ayurvedic-treatment` ||
                        String(p._id) === rawSlug
                ) || products[0];
                res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                res.end(JSON.stringify(prod));
                return;
            }
            if (pathname === '/api/blogs') {
                res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                res.end(JSON.stringify({ blogs, page: 1, pages: 1, total: blogs.length, categories: ['Digestive Care'] }));
                return;
            }
            if (pathname.startsWith('/api/blogs/')) {
                const slug = pathname.replace('/api/blogs/', '').replace(/\/+$/, '');
                const blog = blogs.find((b) => b.slug === slug || String(b._id) === slug) || blogs[0];
                res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                res.end(JSON.stringify({ blog, relatedBlogs: blogs.filter((b) => b.slug !== blog?.slug) }));
                return;
            }
            if (pathname === '/api/categories') {
                res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                res.end(JSON.stringify(categories));
                return;
            }
            if (pathname === '/api/banners') {
                res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                res.end(JSON.stringify([]));
                return;
            }
            if (pathname.startsWith('/api/')) {
                res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                res.end(JSON.stringify({}));
                return;
            }

            // Serve static files from dist/
            const filePath = path.join(DIST_DIR, pathname);
            if (pathname !== '/' && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                const ext = path.extname(filePath).toLowerCase();
                res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
                fs.createReadStream(filePath).pipe(res);
                return;
            }

            // Otherwise serve clean SPA base template so React Router renders the route
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(baseTemplate);
        });

        server.listen(0, '127.0.0.1', () => {
            const { port } = server.address();
            resolve({ server, port });
        });
    });
}

/**
 * Renders a route inside Headless Chrome via CDP WebSocket and returns the rendered #root innerHTML
 */
async function renderRouteViaCDP(cdpPort, serverPort, route) {
    // Create a new target tab
    const targetUrl = `http://127.0.0.1:${serverPort}${route}`;
    const putRes = await fetch(`http://127.0.0.1:${cdpPort}/json/new?${encodeURIComponent(targetUrl)}`, {
        method: 'PUT'
    });
    const targetInfo = await putRes.json();
    const wsUrl = targetInfo.webSocketDebuggerUrl;
    const targetId = targetInfo.id;

    return new Promise((resolve) => {
        const ws = new WebSocket(wsUrl);
        let msgId = 1;
        let finished = false;

        const cleanup = async (htmlResult) => {
            if (finished) return;
            finished = true;
            try { ws.close(); } catch {}
            try { await fetch(`http://127.0.0.1:${cdpPort}/json/close/${targetId}`); } catch {}
            resolve(htmlResult);
        };

        const timeout = setTimeout(() => cleanup(''), 12000);

        ws.addEventListener('open', () => {
            // Evaluate script in page that waits for React & lazy chunks to finish rendering
            const waitAndExtractExpr = `
              new Promise((resolve) => {
                let attempts = 0;
                const checkReady = () => {
                  attempts++;
                  const root = document.getElementById('root');
                  const html = root ? root.innerHTML : '';
                  const hasSpinner = root ? !!root.querySelector('.animate-spin') : false;
                  if (html.length > 500 && (!hasSpinner || attempts > 25)) {
                    // Scroll to trigger any intersection observers / below-the-fold sections
                    window.scrollTo(0, document.body.scrollHeight);
                    setTimeout(() => {
                      window.scrollTo(0, 0);
                      resolve(root ? root.innerHTML : '');
                    }, 120);
                  } else if (attempts > 35) {
                    resolve(html);
                  } else {
                    setTimeout(checkReady, 100);
                  }
                };
                setTimeout(checkReady, 200);
              })
            `;
            ws.send(
                JSON.stringify({
                    id: msgId++,
                    method: 'Runtime.evaluate',
                    params: {
                        expression: waitAndExtractExpr,
                        awaitPromise: true,
                        returnByValue: true
                    }
                })
            );
        });

        ws.addEventListener('message', (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.id === 1 && data.result?.result?.value !== undefined) {
                    clearTimeout(timeout);
                    cleanup(data.result.result.value);
                }
            } catch {}
        });

        ws.addEventListener('error', () => {
            clearTimeout(timeout);
            cleanup('');
        });
    });
}

async function runSSGPrerender() {
    console.log('\n[SSG] Starting React + Vite Full DOM Static Site Generation (SSG)...');

    const distIndexPath = path.join(DIST_DIR, 'index.html');
    if (!fs.existsSync(distIndexPath)) {
        console.error('[SSG] dist/index.html not found! Run `vite build` first.');
        process.exit(1);
    }

    // Ensure clean base template with empty <div id="root"></div>
    const rawDistIndex = fs.readFileSync(distIndexPath, 'utf8');
    const baseTemplate = rawDistIndex
        .replace(/<!-- SSG Pre-rendered SEO Meta[\s\S]*?<!-- \/SSG Pre-rendered SEO Meta -->/g, '')
        .replace(/<div id="root">[\s\S]*?<!-- \/SSG_BODY --><\/div>/, '<div id="root"></div>');

    // Fetch live products & blogs from backend (or cache fallback)
    const { products, blogs } = await fetchSSGData();
    console.log(`[SSG] Loaded ${products.length} products and ${blogs.length} blogs from API/cache.`);

    // Build complete list of public routes to pre-render
    const routesSet = new Set([
        ...Object.keys(STATIC_PAGE_SEO),
        ...Object.keys(CATEGORY_SEO_ROUTES),
        ...EXTRA_PUBLIC_ROUTES
    ]);

    for (const p of products) {
        if (p.slug) routesSet.add(`/product/${p.slug}`);
    }
    for (const aliasSlug of Object.keys(SLUG_ALIASES)) {
        routesSet.add(`/product/${aliasSlug}`);
    }
    for (const b of blogs) {
        if (b.slug) {
            routesSet.add(`/blog/${b.slug}`);
            routesSet.add(`/blogs/${b.slug}`);
            routesSet.add(`/ayurvedic-blog/${b.slug}`);
        }
    }

    const routes = Array.from(routesSet);

    // Check if local Chrome/Edge is available to capture 100% real React DOM
    const browserPath = findBrowserExecutable();
    const realDomMap = new Map();

    const forceRefreshAll = process.argv.includes('--refresh-dom');
    const forceRefreshBlogs = process.argv.includes('--refresh-blogs');

    if (fs.existsSync(DOM_CACHE_FILE) && !forceRefreshAll) {
        try {
            const cachedDom = JSON.parse(fs.readFileSync(DOM_CACHE_FILE, 'utf8'));
            for (const [k, v] of Object.entries(cachedDom)) {
                if (forceRefreshBlogs && (k === '/blogs' || k.startsWith('/blog/') || k.startsWith('/blogs/') || k.startsWith('/ayurvedic-blog/'))) {
                    continue;
                }
                realDomMap.set(k, v);
            }
        } catch {}
    }

    const routesToCapture = routes.filter((r) => !realDomMap.has(r));

    if (browserPath && typeof WebSocket !== 'undefined' && routesToCapture.length > 0) {
        console.log(`[SSG] Rendering real React DOM for ${routesToCapture.length} route(s) via Headless Browser...`);
        const { server, port } = await startLocalSSGServer(baseTemplate, { products, blogs });
        const cdpPort = 9333 + Math.floor(Math.random() * 500);
        const userDataDir = path.join(__dirname, `.chrome-ssg-profile-${cdpPort}`);

        const chromeProc = spawn(
            browserPath,
            [
                '--headless=new',
                '--disable-gpu',
                '--no-sandbox',
                '--disable-dev-shm-usage',
                '--window-size=1440,2400',
                `--remote-debugging-port=${cdpPort}`,
                `--user-data-dir=${userDataDir}`,
                'about:blank'
            ],
            { stdio: 'ignore' }
        );

        let cdpReady = false;
        for (let i = 0; i < 30; i++) {
            try {
                const res = await fetch(`http://127.0.0.1:${cdpPort}/json/version`);
                if (res.ok) {
                    cdpReady = true;
                    break;
                }
            } catch {}
            await new Promise((r) => setTimeout(r, 200));
        }

        if (cdpReady) {
            const concurrency = 6;
            for (let i = 0; i < routesToCapture.length; i += concurrency) {
                const batch = routesToCapture.slice(i, i + concurrency);
                const results = await Promise.all(
                    batch.map((r) => renderRouteViaCDP(cdpPort, port, r))
                );
                batch.forEach((r, idx) => {
                    if (results[idx] && results[idx].length > 200) {
                        const cleanedDom = results[idx]
                            .replace(/<script\s+type=["']application\/ld\+json["'][\s\S]*?<\/script>/gi, '')
                            .replace(new RegExp(`http://127\\.0\\.0\\.1:${port}`, 'g'), SITE_URL);
                        realDomMap.set(r, prettyPrintHtml(cleanedDom));
                    }
                });
            }
            console.log(`[SSG] Captured full React DOM for ${realDomMap.size}/${routes.length} routes.`);
            try {
                fs.writeFileSync(DOM_CACHE_FILE, JSON.stringify(Object.fromEntries(realDomMap), null, 2), 'utf8');
            } catch {}
        }

        try { chromeProc.kill(); } catch {}
        try { server.close(); } catch {}
        try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch {}
    }

    let generatedCount = 0;
    for (const route of routes) {
        let html = renderRouteToHtml(baseTemplate, route, { products, blogs });

        // If we captured the 100% real React DOM from Headless Chrome, inject the pretty-printed React DOM!
        const realReactDom = realDomMap.get(route);
        if (realReactDom) {
            html = html.replace(
                /<div id="root">[\s\S]*?<!-- \/SSG_BODY --><\/div>/,
                `<div id="root"><!-- SSG_BODY -->\n${realReactDom}\n  <!-- /SSG_BODY --></div>`
            );
        }

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
${Array.from(canonicalRoutes).map((r) => {
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

    console.log(`[SSG] Pre-rendered ${generatedCount} static HTML pages into dist/<route>/index.html`);
    console.log(`[SSG] Updated sitemap.xml with ${canonicalRoutes.size} canonical URLs.\n`);
    process.exit(0);
}

runSSGPrerender().catch((err) => {
    console.error('[SSG] Error during pre-render:', err);
    process.exit(1);
});
