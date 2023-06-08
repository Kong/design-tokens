import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import viteRestart from 'vite-plugin-restart'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    viteRestart({
      restart: [
        // Restart the Vite sandbox when any of the `/dist/*` files are changed
        '../dist/**/*',
      ],
    }),
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
  publicDir: path.resolve(__dirname, '../'),
  server: {
    fs: {
      // Allow serving files from one level up from the package root - IMPORTANT - to support the sandbox
      strict: false,
    },
    open: true,
  },
})
