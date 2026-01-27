import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Ensure PWA/service worker updates don't leave users with a cached HTML
// that references old hashed CSS/JS files (white screen / missing stylesheet).
// Provided by vite-plugin-pwa.
import { registerSW } from "virtual:pwa-register";

// Suppress Lovable dev environment 404 errors for inspection tokens
// These are benign dev-only errors and don't affect functionality
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const url = args[0]?.toString?.() || '';
    
    // Silently fail if URL contains Lovable token (dev-only)
    if (url.includes('__lovable_token')) {
      return Promise.reject(new Error('Lovable token resource not available (dev-only)'));
    }
    
    return originalFetch.apply(this, args);
  };
}

registerSW({
  immediate: true,
  onNeedRefresh() {
    // Force update and reload to the newest assets.
    window.location.reload();
  },
});

createRoot(document.getElementById("root")!).render(<App />);
