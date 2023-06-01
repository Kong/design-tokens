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

// Create an empty platforms object
let platforms = {}

// CSS variables
platforms.css = {
  prefix: 'kui',
  transformGroup: 'css',
  buildPath: 'dist/css/',
  transforms: [
    'attribute/cti',
    'name/cti/kebab',
    'color/css',
    'size/px',
  ],
  files: [
    {
      destination: 'variables.css',
      format: 'css/variables',
      options: {
        fileHeader: customFileHeader,
        outputReferences: true,
        selector: ':root', // You can override the default selector; may be necessary for consumers (e.g. Kongponents)
      },
    },
  ],
}

// SCSS variables
platforms.scss = {
  prefix: 'kui',
  transformGroup: 'scss',
  buildPath: 'dist/scss/',
  transforms: [
    'attribute/cti',
    'name/cti/kebab',
    'color/css',
    'size/px',
  ],
  files: [
    // SCSS variables
    {
      destination: '_variables.scss',
      format: 'scss/variables',
      options: {
        fileHeader: customFileHeader,
        outputReferences: true,
      },
    },
    // SCSS CSS variables mixin
    {
      destination: '_mixins.scss',
      format: 'cssVariablesMixin',
      options: {
        fileHeader: customFileHeader,
        outputReferences: true,
      },
    },
  ],
}

// Font families
platforms[ 'assets/embed/scss' ] = {
  transforms: [
    'attribute/cti',
    'name/cti/kebab',
    'asset/base64',
  ],
  buildPath: 'dist/scss/',
  files: [
    {
      destination: '_fonts.scss',
      format: 'scss/variables',
      options: {
        fileHeader: customFileHeader,
      },
      filter: {
        attributes: {
          category: 'asset',
          type: 'font',
        },
      },
    },
  ],
}

module.exports = {
  ...config,
  platforms,
}
