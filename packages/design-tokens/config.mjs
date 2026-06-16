import platforms from './platforms/index.mjs'
import { logVerbosityLevels } from 'style-dictionary/enums'

// Create Style Dictionary config object
const config = {
  log: {
    verbosity: logVerbosityLevels.verbose,
  },
  // Include alias tokens so that they are available for the build, but will NOT be exported. Filtered out with token.isSource === true
  include: [
    './tokens/alias/**/*.json',
  ],
  // Any tokens that are defined in the `source` array will be exported. `source` takes precedence over `include`.
  source: [
    './tokens/source/**/*.json',
    // Component tokens are name-only (no CSS value). They live outside tokens/source/ to
    // signal they are not exported to CSS/SCSS/LESS/JS — only to KUI_THEMEABLE_TOKENS.
    './tokens/components/**/*.json',
  ],
}

export default {
  ...config,
  platforms,
}
