const platforms = require('./platforms')

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

module.exports = {
  ...config,
  platforms,
}
