import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  server: {
    port: 5173,
    proxy: {
      // Proxy dla wszystkich requestów zaczynających się od /api
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        // Rewrite nie jest potrzebny, bo backend również używa /api
      }
    }
  },
  
  // Konfiguracja builda
  build: {
    outDir: 'dist',
    sourcemap: true,
  }
})
