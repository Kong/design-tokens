import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import path from 'path'
import viteRestart from 'vite-plugin-restart'
import { previewProxyPlugin } from './vite-preview-proxy'

export default defineConfig({
  plugins: [
    vue(),
    previewProxyPlugin(),
    viteRestart({
      reload: [
        // Reload the Vite sandbox when any of the `/dist/*` files are changed
        '../dist/**/*',
      ],
    }),
    VueDevTools(),
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
  // Serve the monorepo root as publicDir so built /dist/* assets are accessible at the dev-server root
  publicDir: path.resolve(__dirname, '../'),
  server: {
    fs: {
      // Allow serving files from one level up from the package root - IMPORTANT - to support the sandbox
      strict: false,
    },
    open: true,
  },
})
