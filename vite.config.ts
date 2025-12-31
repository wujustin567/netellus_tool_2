import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 'base' config ensures assets load correctly on GitHub Pages subdirectories
  base: './',
  define: {
    // Injects the process.env.API_KEY into the code at build time
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
  },
});