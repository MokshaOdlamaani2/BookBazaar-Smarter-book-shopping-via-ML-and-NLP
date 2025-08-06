// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      // Prevent build errors from optional native modules like fsevents
      external: ['fsevents'],
    },
  },
  resolve: {
    alias: {
      // Optional: clean import paths like "@/components/..."
      '@': '/src',
    },
  },
});
