import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icon-192.png', 'icon-512.png'],
      manifest: false,
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https?.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'farmsphere-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 24 * 60 * 60
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      external: [],
      output: {
        manualChunks: undefined,
      },
    },
    minify: "esbuild",
    sourcemap: false,
  },
  esbuild: {
    target: "es2020",
  },
  base: mode === 'production' ? '/' : '/',
}));
