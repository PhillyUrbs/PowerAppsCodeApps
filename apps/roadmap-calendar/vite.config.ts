import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { powerApps } from "@microsoft/power-apps-vite/plugin"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), powerApps()],
  server: {
    proxy: {
      '/api/roadmap': {
        target: 'https://www.microsoft.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/roadmap/, '/releasecommunications/api/v2'),
      },
    },
  },
});
