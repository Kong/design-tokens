import { TOKEN_DIRECTORY } from '../utilities/index.mjs'

/**
 * LESS Variables
 */
export default {
  transformGroup: 'less',
  buildPath: `${TOKEN_DIRECTORY}/less/`,
  transforms: [
    'attribute/cti',
    'name/kebab',
    'color/css',
  ],
  files: [
    // LESS variables
    {
      format: 'less/variables',
      destination: 'variables.less',
      // Exclude alias tokens and asset tokens compiled in a separate file
      filter: (token) => token.isSource === true && token.attributes.category !== 'asset',
    },
  ],
}
