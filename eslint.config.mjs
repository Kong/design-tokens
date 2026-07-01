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
  // Apply the JSON config to theme files so they get the correct parser/processor
  ...eslintKongUiConfigJson.map(config => ({
    ...config,
    files: ['packages/design-tokens/themes/*.json'],
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
  })),
  // Exclude the generated JS snapshot from stylistic rules since it is auto-generated and not meant to be human-edited
  {
    files: ['packages/design-tokens/__snapshots__/tokens/js/index.mjs'],
    rules: {
      '@stylistic/quotes': 'off',
      '@stylistic/semi': 'off',
    },
  },
]
