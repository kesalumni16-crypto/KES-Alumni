import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    historyApiFallback: {
      index: '/index.html',
      rewrites: [
        { from: /^\/login/, to: '/index.html' },
        { from: /^\/register/, to: '/index.html' },
        { from: /^\/profile/, to: '/index.html' },
        { from: /^\/about/, to: '/index.html' },
        { from: /^\/alumni-globe/, to: '/index.html' },
        { from: /^\/career/, to: '/index.html' },
        { from: /^\/news-events/, to: '/index.html' },
        { from: /^\/coming-soon/, to: '/index.html' },
      ]
    }
  },
  preview: {
    port: 4173,
    host: true,
    historyApiFallback: {
      index: '/index.html'
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})