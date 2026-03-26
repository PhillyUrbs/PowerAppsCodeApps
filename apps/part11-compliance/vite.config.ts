import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "./",
  server: {
    host: "::",
    port: 3000,
  },
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'fluent-ui': ['@fluentui/react-components', '@fluentui/react-icons'],
        }
      }
    }
  },
})
