import platforms from './platforms/index.mjs'
import { logVerbosityLevels } from 'style-dictionary/enums'

// Create Style Dictionary config object
const config = {
  log: {
    verbosity: logVerbosityLevels.verbose,
  },
  // Resolve COLOR aliases against the default (classic) palette ONLY. classic.json is the source of
  // truth for the exported semantic output (SCSS/JS/TS/CSS/LESS). The per-theme palette files
  // (konnect-*.json) and the names-only _manifest.json share this directory but must NOT be included
  // here — they would collide on shared step names. Aliases are filtered from output via token.isSource.
  // NOTE: if a NON-color alias category is ever added (e.g. tokens/alias/size/), add its glob here too.
  // (A missing alias reference fails the build loudly, so an omission errors rather than mis-resolving.)
  include: [
    './tokens/alias/color/classic.json',
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
