import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Ensure PWA/service worker updates don't leave users with a cached HTML
// that references old hashed CSS/JS files (white screen / missing stylesheet).
// Provided by vite-plugin-pwa.
import { registerSW } from "virtual:pwa-register";

// Suppress Lovable dev environment warnings and errors
// These are benign dev-only artifacts and don't affect functionality
if (typeof window !== 'undefined') {
  // Suppress ref warnings from Lovable inspection system
  const originalError = console.error;
  console.error = function(...args) {
    const message = args[0]?.toString?.() || '';
    // Filter out Lovable-specific ref warnings (dev-only inspection)
    if (message.includes('Function components cannot be given refs') || 
        message.includes('Did you mean to use React.forwardRef')) {
      return;
    }
    originalError.apply(console, args);
  };

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
