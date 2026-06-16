import eslintKongUiConfig from '@kong/eslint-config-kong-ui'
import eslintKongUiConfigJson from '@kong/eslint-config-kong-ui/json'

export default [
  ...eslintKongUiConfig,
  // Only apply the shared JSON config to files that match the given pattern
  ...eslintKongUiConfigJson.map(config => ({
    ...config,
    files: ['packages/*/tokens/**/*.json'],
    rules: {
      ...config.rules,
      'jsonc/object-curly-newline': ['error', 'always'],
      'jsonc/object-property-newline': ['error'],
    },
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
  {
    files: ['packages/*/tokens/themes/**/*.json'],
    rules: {
      // Ensure themes utilize kebab-case
      'jsonc/key-name-casing': ['error',
        {
          camelCase: false,
          PascalCase: false,
          SCREAMING_SNAKE_CASE: false,
          'kebab-case': true,
          snake_case: false,
          ignores: [],
        },
      ],
    },
  },
]
