import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') }
    ]
  },
  server: {
    host: '0.0.0.0',
    port: 4000,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '5173-iwuxtfp0mbk1piq87cab1-d85a23cd.manusvm.computer',
      '.manusvm.computer'
    ]
  }
})
