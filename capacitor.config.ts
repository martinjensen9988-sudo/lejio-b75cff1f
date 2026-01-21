import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dk.lejio.app',
  appName: 'lejio',
  webDir: 'dist',
  server: {
    url: 'https://51f97d3c-03e7-45f9-8a81-a2f78238f523.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config;
