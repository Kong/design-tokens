import { TOKEN_DIRECTORY } from '../utilities/index.mjs'

/**
 * JSON
 */
export default {
  buildPath: `${TOKEN_DIRECTORY}/js/`,
  transforms: [
    'attribute/cti',
    'name/snake',
    'color/css',
  ],
  files: [
    // JSON flat
    {
      format: 'json/flat',
      destination: 'tokens.json',
      // Exclude alias tokens and asset tokens compiled in a separate file
      filter: (token) => token.isSource === true && token.attributes.category !== 'asset',
    },
  ],
}
