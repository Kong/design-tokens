import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@tokens': path.resolve(__dirname, '../dist/tokens/'),
    },
  },
  css: {
    devSourcemap: true,
  },
  build: {
    minify: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        exports: 'named',
      },
    },
  },
  optimizeDeps: {
    include: [
      'vue',
    ],
  },
  // Serve files from the `../dist` directory at the localHost root
  publicDir: path.resolve(__dirname, '../dist'),
  server: {
    fs: {
      // Allow serving files from one level up from the package root - IMPORTANT - to support the sandbox
      strict: false,
    },
    open: true,
  },
})
