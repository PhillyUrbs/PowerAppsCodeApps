import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {RelativePath, propagateQueryPlugin} from './vite-plugins.ts';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), RelativePath(), propagateQueryPlugin()],
  server: {
    port: 3000,
  },
})
