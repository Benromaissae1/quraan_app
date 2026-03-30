import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://srv-d75a33n5r7bs73daq86g.onrender.com'
        changeOrigin: true
      }
    }
  }
})
