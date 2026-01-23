import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Ensure PWA/service worker updates don't leave users with a cached HTML
// that references old hashed CSS/JS files (white screen / missing stylesheet).
// Provided by vite-plugin-pwa.
import { registerSW } from "virtual:pwa-register";

registerSW({
  immediate: true,
  onNeedRefresh() {
    // Force update and reload to the newest assets.
    window.location.reload();
  },
});

createRoot(document.getElementById("root")!).render(<App />);
