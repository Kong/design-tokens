import platforms from './platforms/index.mjs'
import { logVerbosityLevels } from 'style-dictionary/enums'

// Create Style Dictionary config object
const config = {
  log: {
    verbosity: logVerbosityLevels.verbose,
  },
  // Resolve COLOR aliases against the default (classic-day) palette ONLY. classic-day's alias.color.json
  // is the source of truth for the exported semantic output (SCSS/JS/TS/CSS). The other themes'
  // palette files (themes/classic-night/, themes/konnect-*/) and the names-only manifest
  // (themes/_manifest.alias.color.json) must NOT be included here — they would collide on shared
  // step names. Aliases are filtered from output via token.isSource.
  // (A missing alias reference fails the build loudly, so an omission errors rather than mis-resolving.)
  include: [
    './themes/classic-day/classic-day.alias.color.json',
  ],
  // Any tokens that are defined in the `source` array will be exported. `source` takes precedence over `include`.
  source: [
    './tokens/source/**/*.json',
    // Component tokens are name-only (no CSS value). They live outside tokens/source/ to
    // signal they are not exported to CSS/SCSS/JS — only to KUI_THEMEABLE_TOKENS.
    './tokens/components/**/*.json',
  ],
}

export default {
  ...config,
  platforms,
}
