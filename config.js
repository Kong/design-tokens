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
    'Source: https://github.com/Kong/design-system',
  ]
}

/**
 * Create a custom format to utilize CSS variables inside a SCSS mixin, which allows you to
 * scope the CSS variables inside of a custom selector. Example usage in https://github.com/Kong/kong-auth-elements
 *
 * Example:
 * ```css
 * .custom-container {
 *   @include kong-css-variables;
 * }
 * ```
 */
const { fileHeader, formattedVariables } = StyleDictionary.formatHelpers
StyleDictionary.registerFormat({
  name: 'cssVariablesMixin',
  formatter: function({ dictionary, file, options }) {
    const { outputReferences } = options

    return fileHeader({ file }) +
      '@mixin kong-css-variables {\n' +
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
  transforms: [
    'attribute/cti',
    'name/cti/kebab',
    'color/css',
  ],
  files: [
    {
      destination: 'variables.css',
      format: 'css/variables',
      options: {
        fileHeader: customFileHeader,
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
  transforms: [
    'attribute/cti',
    'name/cti/kebab',
    'color/css',
  ],
  files: [
    // SCSS variables
    {
      destination: '_variables.scss',
      format: 'scss/variables',
      options: {
        fileHeader: customFileHeader,
      },
      // Exclude alias tokens and asset tokens compiled in a separate file
      filter: (token) => token.isSource === true && token.attributes.category !== 'asset',
    },
    // SCSS CSS variables mixin
    {
      destination: '_mixins.scss',
      format: 'cssVariablesMixin',
      options: {
        fileHeader: customFileHeader,
      },
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
  transforms: [
    'attribute/cti',
    'name/cti/constant',
    'color/css',
  ],
  files: [
    // JavaScript constants
    {
      destination: 'index.js',
      format: 'javascript/es6',
      options: {
        fileHeader: customFileHeader,
      },
      // Exclude alias tokens and asset tokens compiled in a separate file
      filter: (token) => token.isSource === true && token.attributes.category !== 'asset',
    },
    // Constants TypeScript types
    {
      destination: 'index.d.ts',
      format: 'typescript/es6-declarations',
      options: {
        fileHeader: customFileHeader,
        outputStringLiterals: true,
      },
      // Exclude alias tokens and asset tokens compiled in a separate file
      filter: (token) => token.isSource === true && token.attributes.category !== 'asset',
    },
  ],
}

/**
 * JavaScript Assets
 *
 * Important: Every exported file in this platform key **must** have a corresponding TypeScript declaration export.
 */
platforms['assets/embed/javascript'] = {
  prefix: KONG_TOKEN_PREFIX, // required
  transforms: [
    'attribute/cti',
    'name/cti/constant',
    'asset/base64',
  ],
  buildPath: `${TOKEN_DIRECTORY}/js/`,
  files: [
    // Icons
    {
      destination: 'icons/index.js',
      format: 'javascript/es6',
      options: {
        fileHeader: customFileHeader,
      },
      filter: {
        attributes: {
          category: 'asset',
          type: 'icon',
        },
      },
    },
    // Icons TypeScript types
    {
      destination: 'icons/index.d.ts',
      format: 'typescript/es6-declarations',
      options: {
        fileHeader: customFileHeader,
        outputStringLiterals: true,
      },
      filter: {
        attributes: {
          category: 'asset',
          type: 'icon',
        },
      },
    },
  ],
}

/**
 * CSS Assets
 */
platforms['assets/embed/css'] = {
  prefix: KONG_TOKEN_PREFIX, // required
  transforms: [
    'attribute/cti',
    'name/cti/kebab',
    'asset/base64',
  ],
  buildPath: `${TOKEN_DIRECTORY}/css/`,
  files: [
    // Fonts
    {
      destination: 'fonts.css',
      format: 'css/variables',
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
    // Icons
    {
      destination: 'icons.css',
      format: 'css/variables',
      options: {
        fileHeader: customFileHeader,
      },
      filter: {
        attributes: {
          category: 'asset',
          type: 'icon',
        },
      },
    },
  ],
}

/**
 * SCSS Assets
 */
platforms['assets/embed/scss'] = {
  prefix: KONG_TOKEN_PREFIX, // required
  transforms: [
    'attribute/cti',
    'name/cti/kebab',
    'asset/base64',
  ],
  buildPath: `${TOKEN_DIRECTORY}/scss/`,
  files: [
    // Fonts
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
    // Icons
    {
      destination: '_icons.scss',
      format: 'scss/variables',
      options: {
        fileHeader: customFileHeader,
      },
      filter: {
        attributes: {
          category: 'asset',
          type: 'icon',
        },
      },
    },
  ],
}

module.exports = {
  ...config,
  platforms,
}
