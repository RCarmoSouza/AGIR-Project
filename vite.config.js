import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: [
      'localhost',
      '.manusvm.computer',
      '5174-ivlw2q1km9zqzi1vvctvo-7f1cc495.manusvm.computer'
    ],
    proxy: {
      '/api': {
        target: 'https://3001-iqypjkcxz0lyiosvwil5a-a395c2b7.manusvm.computer',
        changeOrigin: true,
        secure: true,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        }
      },
      '/health': {
        target: 'https://3001-iqypjkcxz0lyiosvwil5a-a395c2b7.manusvm.computer',
        changeOrigin: true,
        secure: true
      }
    }
  }
})

