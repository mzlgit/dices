import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  minify: false,
  base: "./",
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: "@import './src/style/mixins'; @import './src/style/var';"
      }
    }
  }
})
