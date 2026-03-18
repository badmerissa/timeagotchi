import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@vercel/analytics/next': '@vercel/analytics/react',
    },
  },
  ssgOptions: {
    includedRoutes() {
      return ['/', '/log', '/history', '/report', '/settings']
    },
    formatting: 'minify',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
})
