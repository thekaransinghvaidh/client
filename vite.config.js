import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'
import { fetchSSGData, renderRouteToHtml } from './scripts/ssgRenderer.js'

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
        // Skip admin or SEO portal routes
        if (reqUrl.startsWith('/admin') || reqUrl.startsWith('/seo')) {
          return html
        }
        const data = await getSSGDataLazy()
        return renderRouteToHtml(html, reqUrl, data)
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
