import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2019',
    minify: 'esbuild',
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) return 'vendor-react'
            if (id.includes('framer-motion')) return 'vendor-motion'
            if (id.includes('recharts')) return 'vendor-charts'
            return undefined
          }
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: process.env.PORT ? parseInt(process.env.PORT) : 5173,
    strictPort: false,
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT ? parseInt(process.env.PORT) : 5173,
    strictPort: false,
  }
})
