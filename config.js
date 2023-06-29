const StyleDictionary = require('style-dictionary')

/** The static token prefix */
const KONG_TOKEN_PREFIX = 'kui'

/** The build directory */
const BUILD_DIRECTORY = 'dist'
/** The tokens directory, inside the build directory to  */
const TOKEN_DIRECTORY = `${BUILD_DIRECTORY}/tokens`

// Create Style Dictionary config object
const config = {
  // Include alias tokens so that they are available for the build, but will NOT be exported. Filtered out with token.isSource === true
  include: [
    'tokens/alias/**/*.json',
  ],
  // Any tokens that are defined in the `source` array will be exported. `source` takes precedence over `include`.
  source: [
    'tokens/source/**/*.json',
  ],
}

// Define a custom file header for all formats
const customFileHeader = (defaultMessage) => {
  return [
    ...defaultMessage,
    '',
    'GitHub: https://github.com/Kong/design-tokens',
    'License: Apache-2.0',
  ]
}

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

// Create an empty platforms object
const platforms = {}

/**
 * CSS Variables
 */
platforms.css = {
  prefix: KONG_TOKEN_PREFIX, // required
  transformGroup: 'css',
  buildPath: `${TOKEN_DIRECTORY}/css/`,
  options: {
    fileHeader: customFileHeader,
  },
  transforms: [
    'attribute/cti',
    'name/cti/kebab',
    'color/css',
  ],
  files: [
    {
      format: 'css/variables',
      destination: 'variables.css',
      options: {
        selector: ':root', // You can override the default selector; may be necessary for consumers (e.g. Kongponents)
      },
      // Exclude alias tokens and asset tokens compiled in a separate file
      filter: (token) => token.isSource === true && token.attributes.category !== 'asset',
    },
  ],
}

/**
 * SCSS Variables
 */
platforms.scss = {
  prefix: KONG_TOKEN_PREFIX, // required
  transformGroup: 'scss',
  buildPath: `${TOKEN_DIRECTORY}/scss/`,
  options: {
    fileHeader: customFileHeader,
  },
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

/**
 * JavaScript Variables
 *
 * Important: Every exported file in this platform key **must** have a corresponding TypeScript declaration export.
 */
platforms.javascript = {
  prefix: KONG_TOKEN_PREFIX, // required
  transformGroup: 'js',
  buildPath: `${TOKEN_DIRECTORY}/js/`,
  options: {
    fileHeader: customFileHeader,
  },
  transforms: [
    'attribute/cti',
    'name/cti/constant',
    'color/css',
  ],
  files: [
    // JavaScript ES constants
    {
      format: 'javascript/es6',
      destination: 'index.js',
      // Exclude alias tokens and asset tokens compiled in a separate file
      filter: (token) => token.isSource === true && token.attributes.category !== 'asset',
    },
    // Constants TypeScript types
    {
      format: 'typescript/es6-declarations',
      destination: 'index.d.ts',
      options: {
        outputStringLiterals: true,
      },
      // Exclude alias tokens and asset tokens compiled in a separate file
      filter: (token) => token.isSource === true && token.attributes.category !== 'asset',
    },
    // JavaScript CommonJS
    {
      format: 'javascript/module-flat',
      destination: 'cjs/index.cjs',
      // Exclude alias tokens and asset tokens compiled in a separate file
      filter: (token) => token.isSource === true && token.attributes.category !== 'asset',
    },
    // CommonJS types
    {
      format: 'typescript/module-declarations',
      destination: 'cjs/index.d.ts',
      options: {
        outputStringLiterals: true,
      },
      // Exclude alias tokens and asset tokens compiled in a separate file
      filter: (token) => token.isSource === true && token.attributes.category !== 'asset',
    },
  ],
}

module.exports = {
  ...config,
  platforms,
}
