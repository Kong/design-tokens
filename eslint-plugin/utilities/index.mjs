/**
 * Converts a `KUI_` JS constant name to its CSS custom property equivalent.
 *
 * @example
 * kuiIdentifierToCssVar('KUI_COLOR_TEXT_INVERSE') // → '--kui-color-text-inverse'
 *
 * @param {string} name - A KUI token constant name (e.g. `KUI_COLOR_TEXT_INVERSE`)
 * @returns {string} The corresponding CSS custom property name including the `--` prefix
 */
export function kuiIdentifierToCssVar(name) {
  return '--' + name.toLowerCase().replace(/_/g, '-')
}

/** Matches any valid `@kong/design-tokens` JS export name (e.g. `KUI_COLOR_TEXT_INVERSE`). */
export const KUI_IDENTIFIER_PATTERN = /^KUI_[A-Z0-9_]+$/

/** The npm package name from which KUI tokens are imported. */
export const KUI_IMPORT_SOURCE = '@kong/design-tokens'
