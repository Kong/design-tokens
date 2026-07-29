export default {
  extends: [
    'stylelint-config-html',
    'stylelint-config-recommended-scss',
    'stylelint-config-recommended-vue/scss',
  ],
  plugins: [
    'stylelint-order',
    '@stylistic/stylelint-plugin',
  ],
  rules: {
    'order/properties-alphabetical-order': true,
    '@stylistic/indentation': [
      2,
      {
        baseIndentLevel: 0,
      },
    ],
    'rule-empty-line-before': ['always', { ignore: ['after-comment', 'first-nested'] }],
    '@stylistic/block-opening-brace-space-before': 'always',
    '@stylistic/declaration-colon-space-after': 'always',
    '@stylistic/media-feature-colon-space-after': 'always',
    // Disable the following rules
    'custom-property-no-missing-var-function': null,
    'no-descending-specificity': null,
  },
}
