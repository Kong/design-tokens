const StyleDictionary = require('style-dictionary')
const { TOKEN_DIRECTORY } = require('../utilities')

/**
 * Create a custom format to utilize CSS variables inside a SCSS mixin, which allows you to
 * scope the CSS variables inside of a custom selector. Specifically added for https://github.com/Kong/kong-auth-elements
 *
 * Example:
 * ```css
 * .custom-container {
 *   @include kui-css-variables;
 * }
 * ```
 */
const { fileHeader, formattedVariables } = StyleDictionary.formatHelpers
StyleDictionary.registerFormat({
  name: 'css/variables/custom/sass/mixin',
  formatter: function({ dictionary, file, options }) {
    const { outputReferences } = options

    return fileHeader({ file }) +
      '/**\n' +
      ' * {mixin} @kui-css-variables\n' +
      ' * Scope the @kong/design-tokens CSS variables inside of a custom selector.\n' +
      ' * Specifically added for https://github.com/Kong/kong-auth-elements\n' +
      ' *\n' +
      ' * Example:\n' +
      ' * ```css\n' +
      ' * .custom-container {\n' +
      ' *   @include kui-css-variables;\n' +
      ' * }\n' +
      ' * ```\n' +
      '*/\n' +
      '@mixin kui-css-variables {\n' +
      formattedVariables({ format: 'css', dictionary, outputReferences }) +
      '\n}\n'
  },
})

/**
 * SCSS Variables
 */
const platform = {
  transformGroup: 'scss',
  buildPath: `${TOKEN_DIRECTORY}/scss/`,
  transforms: [
    'attribute/cti',
    'name/cti/kebab',
    'color/css',
  ],
  files: [
    // SCSS variables
    {
      format: 'scss/variables',
      destination: '_variables.scss',
      options: {
        themeable: true,
      },
      // Exclude alias tokens and asset tokens compiled in a separate file
      filter: (token) => token.isSource === true && token.attributes.category !== 'asset',
    },
    // SCSS map
    {
      format: 'scss/map-flat',
      mapName: 'tokens-map',
      destination: '_map.scss',
      // Exclude alias tokens and asset tokens compiled in a separate file
      filter: (token) => token.isSource === true && token.attributes.category !== 'asset',
    },
    // SCSS CSS variables mixin
    {
      format: 'css/variables/custom/sass/mixin',
      destination: '_mixins.scss',
      // Exclude alias tokens and asset tokens compiled in a separate file
      filter: (token) => token.isSource === true && token.attributes.category !== 'asset',
    },
  ],
}

module.exports = platform
