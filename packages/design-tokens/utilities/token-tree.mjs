/**
 * Shared helpers for flattening a DTCG token tree (as parsed from `tokens/source/**` or
 * `tokens/components/**` JSON) into `kui-*` token names — the same convention Style Dictionary's
 * `attribute/cti` + `name/kebab` transforms produce for the built `KUI_THEMEABLE_TOKENS` registry.
 * Shared by the theme drift guards, the theme scaffold, and the theme sync tooling so all three stay
 * in lockstep with a single naming rule instead of three hand-rolled copies.
 */

/**
 * Convert a token tree path (raw JSON key segments) into a `kui-*` token name. Segments equal to
 * `_` are dropped (the DTCG convention for a group's "base" leaf, e.g. `color.background._` →
 * `kui-color-background`); any run of non-alphanumeric characters (including underscores, e.g. the
 * literal `line_height` source key) collapses to a single hyphen.
 * @param {string[]} path - Raw JSON key segments from the tree root to a leaf.
 * @returns {string} e.g. `kui-color-background-danger`
 */
export function pathToTokenName(path) {
  return 'kui-' + path.filter(segment => segment !== '_').map(segment => segment.replace(/[\W_]+/g, '-')).join('-')
}

/**
 * A single flattened token leaf.
 * @typedef {object} FlattenedToken
 * @property {string} name - The `kui-*` token name (no leading `--`).
 * @property {string[]} path - The raw, un-renamed JSON key path (e.g. `['line_height', '10']`) —
 *   what a `{a.b.c}` reference is written against, distinct from the derived `kui-*` name (which
 *   drops `_` segments and collapses separators, and so can't be used to resolve a reference back).
 * @property {unknown} value - The leaf's raw `$value` (unresolved — may be a `{color.alias.*}` reference).
 * @property {string | undefined} description - The leaf's `$description`, if present.
 */

/**
 * Recursively walk a DTCG token tree and yield one record per leaf (`$value !== undefined`).
 * Skips `$`-prefixed metadata keys (`$type`, `$description`, etc.) at every level.
 * @param {unknown} node - A parsed JSON token (sub)tree.
 * @param {string[]} [path] - Accumulated path segments (internal recursion state).
 * @returns {FlattenedToken[]}
 */
export function flattenTokenTree(node, path = []) {
  if (node && typeof node === 'object' && node.$value !== undefined) {
    return [{ name: pathToTokenName(path), path, value: node.$value, description: node.$description }]
  }
  if (node && typeof node === 'object') {
    return Object.entries(node)
      .filter(([key]) => !key.startsWith('$'))
      .flatMap(([key, value]) => flattenTokenTree(value, [...path, key]))
  }
  return []
}
