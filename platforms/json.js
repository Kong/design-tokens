const { TOKEN_DIRECTORY } = require('../utilities')

/**
 * JSON
 */
const platform = {
  transformGroup: 'json',
  buildPath: `${TOKEN_DIRECTORY}/js/`,
  transforms: [
    'attribute/cti',
    'name/cti/snake',
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

module.exports = platform
