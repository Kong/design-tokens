const { KONG_TOKEN_PREFIX, TOKEN_DIRECTORY } = require('../constants')

/**
 * JavaScript Variables
 *
 * Important: Every exported file in this platform key **must** have a corresponding TypeScript declaration export.
 */
const platform = {
  prefix: KONG_TOKEN_PREFIX, // required
  transformGroup: 'js',
  buildPath: `${TOKEN_DIRECTORY}/js/`,
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
      destination: 'cjs/index.d.cts',
      options: {
        outputStringLiterals: true,
      },
      // Exclude alias tokens and asset tokens compiled in a separate file
      filter: (token) => token.isSource === true && token.attributes.category !== 'asset',
    },
  ],
}

module.exports = platform
