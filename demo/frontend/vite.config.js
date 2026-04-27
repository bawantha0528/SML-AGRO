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
    port: 5173,
    // Host config only for local development if needed
    host: process.env.RAILWAY ? '0.0.0.0' : 'localhost',
  },
  preview: {
    port: 5173,
  }
})
