import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['eslint-plugin/rules/**/__tests__/**/*.test.mjs'],
    environment: 'node',
  },
})
