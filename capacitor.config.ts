import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.polyhunt.app',
  appName: 'PolyHunt',
  webDir: 'out',
  server: {
    // Point to your live Vercel deployment so API routes work on mobile
    url: 'https://polyhunt.xyz',
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
    backgroundColor: '#ffffff',
  },
};

export default config;
