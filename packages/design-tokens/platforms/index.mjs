// Import all platforms
import scss from './scss.mjs'
import less from './less.mjs'
import css from './css.mjs'
import javascript from './javascript.mjs'
import json from './json.mjs'
import markdown from './markdown.mjs'
// Import utilities
import { customFileHeader, KONG_TOKEN_PREFIX } from '../utilities/index.mjs'

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
    formatting: {
      fileHeaderTimestamp: true,
    },
  }
}

export default platforms
