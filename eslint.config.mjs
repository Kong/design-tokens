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
  // Apply the JSON config to theme token maps (co-located under themes/<name>/) so they get the
  // correct parser/processor and kebab-case token names. Scoped to *.theme.json specifically —
  // NOT the co-located *.alias.color.json palettes, whose color-family keys (e.g. `electric_lime`)
  // are an intentional snake_case exception (see ALIAS-COLOR-MAPPING-GUIDE.md).
  ...eslintKongUiConfigJson.map(config => ({
    ...config,
    files: ['packages/design-tokens/themes/**/*.theme.json'],
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
  // Re-apply the same JSON formatting the generic tokens/**/*.json rule above gives every
  // other token file, without the theme-file-only kebab-case rule (family names may be snake_case).
  ...eslintKongUiConfigJson.map(config => ({
    ...config,
    files: [
      'packages/design-tokens/themes/**/*.alias.color.json',
      'packages/design-tokens/themes/_manifest.alias.color.json',
    ],
    rules: {
      ...config.rules,
      'jsonc/object-curly-newline': ['error', 'always'],
      'jsonc/object-property-newline': ['error'],
    },
  })),
  // Exclude every generated JS snapshot from stylistic rules — everything under __snapshots__/ is
  // frozen build output (`toMatchFileSnapshot`), never hand-edited, so its formatting (e.g.
  // JSON.stringify's double-quoted strings) is not expected to match the repo's authoring style.
  {
    files: ['packages/*/__snapshots__/**/*.{js,mjs,cjs}'],
    rules: {
      '@stylistic/quotes': 'off',
      '@stylistic/semi': 'off',
    },
  },
]
