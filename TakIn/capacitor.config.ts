import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bankofliberty.takin',
  appName: 'Bank of Liberty',
  webDir: 'dist/TakIn/browser',
  server: {
    url: 'https://penyrphf.icu',
    androidScheme: 'https',
    cleartext: true
  }
};

export default config;