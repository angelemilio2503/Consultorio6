import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      '@mui/material': '@mui/material/legacy',
      '@': path.resolve(__dirname, 'src'), // Esto resuelve el alias @ hacia src/
    },
  },
  server: {
    watch: { usePolling: true },
    host: true,
    port: 5173,
    proxy: {
      '/auth': 'http://localhost:3000',
    },
  },
  optimizeDeps: {
    include: ['@mui/material', 'framer-motion'],
  },
  build: {
    chunkSizeWarningLimit: 1000,
  },
});
