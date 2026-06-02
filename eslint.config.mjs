import eslintKongUiConfig from '@kong/eslint-config-kong-ui'
import eslintKongUiConfigJson from '@kong/eslint-config-kong-ui/json'

export default [
  ...eslintKongUiConfig,
  // Only apply the shared JSON config to files that match the given pattern
  ...eslintKongUiConfigJson.map(config => ({
    ...config,
    files: ['packages/*/tokens/**/*.json'],
  })),
  {
    files: [
      '**/*.{js,cjs,jsx}',
    ],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
  // Ignore the sort order for the breakpoint tokens so they can be ordered from smallest to largest
  {
    files: ['packages/*/tokens/source/breakpoint/**/*.json'],
    rules: {
      'jsonc/sort-keys': 'off',
    },
  },
]
