import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@skillgap/types': path.resolve(__dirname, '../../packages/types/src'),
      '@skillgap/config': path.resolve(__dirname, '../../packages/config/src'),
      '@skillgap/validation': path.resolve(__dirname, '../../packages/validation/src'),
      '@skillgap/analytics': path.resolve(__dirname, '../../packages/analytics/src'),
      '@skillgap/ui': path.resolve(__dirname, '../../packages/ui/src'),
    },
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
