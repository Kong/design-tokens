import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['rules/**/__tests__/**/*.test.mjs'],
    environment: 'node',
  },
})
