import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'https://software-business-assignment-vibe-c.vercel.app/',
        changeOrigin: true
      },
      '/socket.io': {
        target: 'https://software-business-assignment-vibe-c.vercel.app/',
        changeOrigin: true,
        ws: true
      }
    }
  }
})
