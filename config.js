const StyleDictionary = require('style-dictionary')

// Create Style Dictionary config object
const config = {
  include: [
    'tokens/**/*.json',
  ],
}

// Define a custom file header for all formats
const customFileHeader = (defaultMessage) => {
  return [
    ...defaultMessage,
    'Source: https://github.com/Kong/style-dictionary',
  ]
}

/**
 * Create a custom format to utilize CSS variables inside a SCSS mixin, which allows you to
 * scope the CSS variables inside of a custom selector.
 *
 * Example:
 * ```css
 * .custom-container {
 *   @include kong-css-variables;
 * }
 * ```
 */
const {fileHeader, formattedVariables} = StyleDictionary.formatHelpers
StyleDictionary.registerFormat({
  name: 'cssVariablesMixin',
  formatter: function({dictionary, file, options}) {
    const {outputReferences} = options

    return fileHeader({file}) +
      '@mixin kong-css-variables {\n' +
      formattedVariables({format: 'css', dictionary, outputReferences}) +
      '\n}\n'
  },
})

module.exports = {
  ...config,
  platforms: {},
}
