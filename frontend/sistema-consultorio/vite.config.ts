import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
    resolve: {
    alias: {
      '@mui/material': '@mui/material/legacy'
    }
  },
  server: {
    watch: {
      usePolling: true
    },
    host: true,
    port: 5173,
    proxy: {
      '/auth': 'http://localhost:3000', // Redirige las solicitudes al backend
    },
  },
  optimizeDeps: {
    include: ["@mui/material", "framer-motion"], // Asegura que se incluyan correctamente
  },
  build: {
    chunkSizeWarningLimit: 1000, // Para evitar los warnings de tamaño
  }
});
