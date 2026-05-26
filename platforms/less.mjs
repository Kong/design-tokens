import { TOKEN_DIRECTORY, emptyToInitialTransform } from '../utilities/index.mjs'

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
    emptyToInitialTransform,
  ],
  files: [
    // LESS variables
    {
      format: 'less/variables',
      destination: 'variables.less',
      // Exclude alias tokens, asset tokens, and component tokens with no value (runtime-only CSS customization surface)
      filter: (token) => token.isSource === true && token.attributes.category !== 'asset' && token.original.$value !== '',
    },
  ],
}
