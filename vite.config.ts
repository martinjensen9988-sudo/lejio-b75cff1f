import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: [["@emotion/babel-plugin"]],
      },
    }),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "script-defer",
      includeAssets: ["favicon.ico", "robots.txt", "index.html"],
      manifest: {
        name: "LEJIO – Find din lejebil",
        short_name: "LEJIO",
        description: "LEJIO gør det nemt at leje køretøjer. Søg blandt private udlejere og forhandlere.",
        theme_color: "#2962FF",
        background_color: "#FDF8F3",
        display: "standalone",
        orientation: "portrait-primary",
        scope: "/",
        start_url: "/",
        categories: ["business", "lifestyle"],
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        // Optimized caching strategy
        globPatterns: ["**/*.{js,css,ico,png,svg,woff2,html}"],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "supabase-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24,
              },
            },
          },
          {
            urlPattern: /index\.html$/,
            handler: "NetworkOnly",
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "ES2020",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: mode === "production",
        drop_debugger: true,
      },
    },
    reportCompressedSize: false,
    sourcemap: mode === "development",
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
            return "react-vendor";
          }
          if (id.includes("node_modules/react-router")) {
            return "router-vendor";
          }
          if (id.includes("node_modules/@radix-ui")) {
            return "ui-vendor";
          }
          if (id.includes("node_modules/recharts")) {
            return "charts-vendor";
          }
          if (id.includes("node_modules/mapbox-gl")) {
            return "maps-vendor";
          }
          if (id.includes("node_modules/@supabase")) {
            return "supabase-vendor";
          }
          if (id.includes("node_modules/react-hook-form")) {
            return "forms-vendor";
          }
          
          // Route-based chunks
          if (id.includes("/pages/admin/")) {
            return "admin-routes";
          }
          if (id.includes("/pages/dashboard/")) {
            return "dashboard-routes";
          }
          if (id.includes("/pages/search")) {
            return "search-route";
          }
          if (id.includes("/components/admin/")) {
            return "admin-components";
          }
          if (id.includes("/components/dashboard/")) {
            return "dashboard-components";
          }
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@supabase/supabase-js",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-tabs",
    ],
  },
}));
