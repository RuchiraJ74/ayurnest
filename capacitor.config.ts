
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.00dfb0696b6e42e99bc0a14f9c5b59ec',
  appName: 'ayurnest-wellness-compass',
  webDir: 'dist',
  server: {
    url: 'https://00dfb069-6b6e-42e9-9bc0-a14f9c5b59ec.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'always'
  },
  android: {
    buildOptions: {
      keystorePath: null,
      keystoreAlias: null
    }
  }
};

export default config;
