/**
 * Shared helpers for the color-alias manifest contract, used by the drift guard in `themes.spec.mjs`.
 * Tolerant of malformed nodes so a mis-authored palette surfaces as a named diff, not a crash.
 *
 * Manifest representation (`themes/_manifest.alias.color.json`, names only):
 *   - a family mapped to `[]` (empty array) is a single direct-value leaf, e.g. `white` → `color.alias.white`
 *   - a family mapped to a non-empty step-name array lists its stepped leaves, e.g. `gray` → `color.alias.gray.05`
 *   (legacy `null` is also accepted as a singleton for backwards-compatibility)
 */

/**
 * Expand the names-only manifest into the Set of required leaf paths.
 * @param {{ color: { alias: Record<string, string[] | null> } }} manifest
 * @returns {Set<string>} e.g. `{ 'white', 'gray.05', 'gray.10', … }`
 */
export function manifestLeaves(manifest) {
  const set = new Set()
  for (const [family, steps] of Object.entries(manifest.color.alias)) {
    if (steps == null || steps.length === 0) set.add(family)
    else for (const step of steps) set.add(`${family}.${step}`)
  }
  return set
}

/**
 * Collect the leaf paths present in a palette. Tolerant of a malformed family node
 * (null / non-object / direct-value): such a node is treated as a single leaf so a mis-authored
 * palette surfaces as a NAMED missing/extra diff instead of throwing.
 * @param {{ color: { alias: Record<string, unknown> } }} palette
 * @returns {Set<string>}
 */
export function paletteLeaves(palette) {
  const set = new Set()
  for (const [family, node] of Object.entries(palette.color.alias)) {
    if (node == null || typeof node !== 'object' || node.$value !== undefined) set.add(family)
    else for (const step of Object.keys(node)) set.add(`${family}.${step}`)
  }
  return set
}
