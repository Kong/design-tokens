import eslintKongUiConfig from '@kong/eslint-config-kong-ui'
import eslintKongUiConfigJson from '@kong/eslint-config-kong-ui/json'

export default [
  ...eslintKongUiConfig,
  // Only apply the shared JSON config to files that match the given pattern
  ...eslintKongUiConfigJson.map(config => ({
    ...config,
    files: ['tokens/**/*.json'],
  })),
  // {
  //   files: ['stylelint-plugin/rules/use-proper-token/token-map.js'],
  //   rules: {
  //     'sort-keys': ['error', 'asc', { natural: true, minKeys: 2, caseSensitive: false }],
  //   },
  // },
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
    files: ['tokens/source/breakpoint/**/*.json'],
    rules: {
      'jsonc/sort-keys': 'off',
    },
  },
]
