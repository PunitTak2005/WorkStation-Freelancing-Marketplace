import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 3256,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:9005',
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: 'http://localhost:9005',
        ws: true,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
