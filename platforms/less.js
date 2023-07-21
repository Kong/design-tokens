const { TOKEN_DIRECTORY } = require('../utilities')

/**
 * LESS Variables
 */
const platform = {
  transformGroup: 'less',
  buildPath: `${TOKEN_DIRECTORY}/less/`,
  transforms: [
    'attribute/cti',
    'name/cti/kebab',
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

module.exports = platform
