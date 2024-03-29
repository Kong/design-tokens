// Import all platforms
const scss = require('./scss')
const less = require('./less')
const css = require('./css')
const javascript = require('./javascript')
const json = require('./json')
const markdown = require('./markdown')
// Import utilities
const { customFileHeader, KONG_TOKEN_PREFIX } = require('../utilities')

// Add platforms to const
// The property key should match platform.transformGroup; e.g. `scss: scss`
const platforms = {
  scss,
  less,
  css,
  javascript,
  json,
  markdown,
}

// Loop through all platforms and apply universal settings
for (const platform in platforms) {
  // Ensure all tokens have the required `KONG_TOKEN_PREFIX` prefix
  platforms[platform].prefix = KONG_TOKEN_PREFIX // required

  // Get the existing platform options
  const platformOptions = { ...platforms[platform].options || {} }

  // Modify the existing platform options for shared options
  platforms[platform].options = {
    ...platformOptions,
    // Add the standard custom file header
    fileHeader: customFileHeader,
  }
}

module.exports = platforms
