import { TOKEN_DIRECTORY } from '../utilities/index.mjs'

/**
 * JavaScript Variables
 *
 * Important: Every exported file in this platform key **must** have a corresponding TypeScript declaration export.
 */
export default {
  buildPath: `${TOKEN_DIRECTORY}/js/`,
  transforms: [
    'attribute/cti',
    'name/constant',
    'color/css',
  ],
  files: [
    // JavaScript ES6 constants
    {
      format: 'javascript/es6',
      destination: 'index.mjs',
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
      destination: 'cjs/index.js',
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
