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
      // Exclude alias tokens, asset tokens, and component tokens with no value (runtime-only CSS customization surface)
      filter: (token) => token.isSource === true && token.attributes.category !== 'asset' && token.original.$value !== '',
    },
  ],
}
