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
  // If deploying to GitHub pages, enable this line
  base: process.env.BUILD_SANDBOX ? '/design-tokens/' : '/',
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
  server: {
    fs: {
      // Allow serving files from one level up from the package root - IMPORTANT - to support the sandbox
      strict: false,
    },
    open: true,
  },
  // Change the root when utilizing the sandbox via BUILD_SANDBOX=true to use the `/sandbox/*` files
  // During the build process, the `/sandbox/*` files are not used and we should default to the package root.
  root: process.env.BUILD_SANDBOX ? './sandbox' : process.cwd(),
})
