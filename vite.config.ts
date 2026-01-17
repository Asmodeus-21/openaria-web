import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { canonicalPlugin } from './vite-plugin-canonical';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  // @ts-ignore - process is available in Node.js environment
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), canonicalPlugin()],
    define: {
      // Safely stringify values to avoid replacement errors
      'process.env': JSON.stringify(env)
    }
  };
});

const getEnv = (key: string): string => {
  return (import.meta.env as Record<string, string>)[`VITE_${key}`] || '';
};