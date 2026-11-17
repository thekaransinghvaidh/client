import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'
import { fetchSSGData, renderRouteToHtml } from './scripts/ssgRenderer.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DIST_DIR = path.join(__dirname, 'dist')

let cachedSSGData = null
let loadingPromise = null

const getSSGDataLazy = async () => {
  if (cachedSSGData) return cachedSSGData
  if (!loadingPromise) {
    loadingPromise = fetchSSGData().then((data) => {
      cachedSSGData = data
      return data
    })
  }
  return loadingPromise
}

const ssgDevHtmlPlugin = () => ({
  name: 'vite-plugin-ssg-html-source',
  apply: 'serve',
  transformIndexHtml: {
    order: 'pre',
    async handler(html, ctx) {
      try {
        const reqUrl = (ctx?.originalUrl || ctx?.path || '/').split('?')[0]
        if (reqUrl.startsWith('/admin') || reqUrl.startsWith('/seo')) {
          return html
        }

        const data = await getSSGDataLazy()
        let rendered = renderRouteToHtml(html, reqUrl, data)

        // If dist/<route>/index.html exists from SSG build, use its full pretty-printed React DOM body!
        const cleanRoute = reqUrl.replace(/^\/+|\/+$/g, '')
        const distFile = cleanRoute === ''
          ? path.join(DIST_DIR, 'index.html')
          : path.join(DIST_DIR, cleanRoute, 'index.html')

        if (fs.existsSync(distFile)) {
          const distHtml = fs.readFileSync(distFile, 'utf8')
          const bodyMatch = distHtml.match(/<div id="root"><!-- SSG_BODY -->([\s\S]*?)<!-- \/SSG_BODY --><\/div>/)
          if (bodyMatch && bodyMatch[1]) {
            rendered = rendered.replace(
              /<div id="root">[\s\S]*?<!-- \/SSG_BODY --><\/div>/,
              `<div id="root"><!-- SSG_BODY -->${bodyMatch[1]}<!-- /SSG_BODY --></div>`
            )
          }
        }
        return rendered
      } catch {
        return html
      }
    }
  }
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    ssgDevHtmlPlugin(),
    react(),
    viteCompression({ algorithm: 'brotliCompress', ext: '.br' }),
    viteCompression({ algorithm: 'gzip', ext: '.gz' })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    emptyOutDir: false,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'vendor-animation';
            if (id.includes('lucide-react') || id.includes('react-icons')) return 'vendor-icons';
          }
        }
      }
    }
  }
})
