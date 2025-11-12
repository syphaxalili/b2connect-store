import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  envDir: "..",
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        // Manual chunking pour optimiser le cache et réduire le bundle principal
        manualChunks: {
          'mui-core': ['@mui/material'],
          'mui-icons': ['@mui/icons-material'],
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'redux': ['@reduxjs/toolkit', 'react-redux']
        }
      }
    }
  }
});
