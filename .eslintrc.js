module.exports = {
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsonc/base',
    'plugin:jsonc/recommended-with-json',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    'ecmaVersion': 2020,
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    indent: [
      'error',
      2,
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    semi: [
      'error',
      'never',
    ],
    'space-before-function-paren': 'off',
    quotes: [ 'error', 'single', {avoidEscape: true} ],
    'no-multi-spaces': 'error',
    'no-trailing-spaces': 'error',
    'comma-dangle': [ 'error', 'always-multiline' ],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'max-len': [ process.env.NODE_ENV === 'production' ? 'warn' : 'off', {
      code: 120,
      ignoreTrailingComments: true,
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true,
    } ],
    '@typescript-eslint/space-before-function-paren': [ 'error', {
      anonymous: 'never',
      named: 'never',
      asyncArrow: 'always',
    } ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/indent': [ 'error', 2 ],
    '@typescript-eslint/func-call-spacing': [ 'error', 'never' ],
    '@typescript-eslint/no-var-requires': 'off',
    /**
     * JSON rules
     */
    'jsonc/indent': ['error', 2, {}],
    'jsonc/key-name-casing': ['error',
      {
        'camelCase': false,
        'PascalCase': false,
        'SCREAMING_SNAKE_CASE': false,
        'kebab-case': false,
        'snake_case': true,
        'ignores': [],
      },
    ],
    'jsonc/sort-keys': ['error',
      'asc',
      {
        'caseSensitive': true,
        'natural': true,
        'minKeys': 2,
      },
    ],
    'jsonc/key-spacing': ['error',
      {
        'beforeColon': false,
        'afterColon': true,
        'mode': 'strict',
      },
    ],
  },
  overrides: [
    {
      files: ['*.json'],
      parser: 'jsonc-eslint-parser',
    },
  ],
}