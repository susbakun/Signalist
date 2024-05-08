import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/hooks': resolve('src/hooks'),
      '@/assets': resolve('src/assets'),
      '@/components': resolve('src/components'),
      '@/utils': resolve('src/utils'),
      '@/pages': resolve('src/pages'),
      '@/services': resolve('src/services'),
      '@/app': resolve('src/app'),
      '@/features': resolve('src/features'),
      '@/shared': resolve('src/shared')
    }
  }
})
