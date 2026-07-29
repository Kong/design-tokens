import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(dirname, './sandbox'),
      '@tokens': path.resolve(dirname, './dist/tokens'),
      '@themes': path.resolve(dirname, './dist/themes'),
    },
  },
  test: {
    include: ['**/*.spec.{ts,mjs}'],
    // Default stays 'node' — several repo specs resolve `new URL(..., import.meta.url)`
    // against the file scheme, which jsdom's location breaks. Component/composable specs
    // under sandbox/ that mount Vue components or touch the DOM opt into jsdom individually
    // via a `// @vitest-environment jsdom` docblock at the top of the file.
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
  },
})
