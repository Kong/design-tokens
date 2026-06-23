#!/usr/bin/env node
/**
 * Fill exhaustive themes with any missing KUI_THEMEABLE_TOKENS entries.
 *
 * Each "exhaustive" theme (konnect-day, konnect-night) is required to contain EVERY entry in
 * `KUI_THEMEABLE_TOKENS`. This script ADDS the missing ones — it can NEVER change an existing entry.
 * A missing SEMANTIC token is filled from the default build value (colors as `{color.alias.*}` refs
 * against classic.json; non-colors as literals). A missing value-less COMPONENT token has no default
 * value here, so it is added empty and flagged NEEDS MANUAL for a human to set the theme value.
 * Fully self-contained: reads only this repo's built `dist/` + alias source (no Kongponents, no /tmp).
 *
 * Usage:
 *   pnpm fill-themes                 # dry-run: print planned additions, write nothing
 *   pnpm fill-themes --write         # apply additions (backup + atomic + verify)
 *   pnpm fill-themes --prune         # also report keys not in KUI_THEMEABLE_TOKENS
 *   pnpm fill-themes --write --prune # apply additions and remove non-themeable keys
 *
 * Prerequisites:
 *   `pnpm build:tokens` must have been run — this script reads
 *   dist/themeable-tokens.mjs and dist/tokens/js/tokens.json.
 *
 * Safety design (see SAFETY ANALYSIS in the PR / docs):
 *   - Pure core (`fillThemeObject`) is structurally additive-only.
 *   - Dry-run by default; only `--write` touches disk.
 *   - Parse-guard, pre-write assertions, backup + atomic rename,
 *     post-write round-trip verification with automatic restore.
 */

import { readFile, readdir, writeFile, copyFile, rename, unlink } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { getThemeableTokens, buildDescriptionMap } from './create-theme.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = join(__dirname, '..')

/** Themes that MUST contain every themeable token (semantic + component). */
export const EXHAUSTIVE_THEMES = ['konnect-day', 'konnect-night']

/**
 * Themes that MUST contain every SEMANTIC token and ZERO component tokens.
 *
 * `classic` is the default theme: it deliberately sets no component tokens, so
 * every component falls through to its semantic default via the Kongponents
 * `var()` chain — live, not a frozen snapshot. This repo owns the component-token
 * namespace (`tokens/components/`) but NOT the component→semantic fallback map
 * (that lives in Kongponents SCSS), so "contains no component token" is the only
 * fallthrough guarantee this repo can actually verify — hence component-free by
 * omission rather than by snapshotting fallback values.
 */
export const SEMANTIC_ONLY_THEMES = ['classic']

/**
 * Enumerate every component-token name (without the leading `--`) declared in
 * `tokens/components/*.json`. This is the namespace a theme must avoid to be
 * "semantic-only", and the namespace an exhaustive theme is allowed to fill.
 * @returns {Promise<Set<string>>}
 */
export async function getComponentTokenNames() {
  const dir = join(ROOT, 'tokens', 'components')
  const names = new Set()
  const walk = (node, path) => {
    if (node && node.$value !== undefined) {
      names.add('kui-' + path.filter(s => s !== '_').map(s => s.replace(/[\W_]+/g, '-')).join('-'))
      return
    }
    if (node && typeof node === 'object') {
      for (const [key, value] of Object.entries(node)) {
        if (!key.startsWith('$')) walk(value, [...path, key])
      }
    }
  }
  const files = (await readdir(dir)).filter(f => f.endsWith('.json'))
  for (const file of files) {
    walk(JSON.parse(await readFile(join(dir, file), 'utf-8')), [])
  }
  return names
}

/**
 * Family priority for tie-breaking when one concrete color value maps to
 * multiple alias names. Earlier = preferred.
 */
const COLOR_FAMILY_PRIORITY = [
  'white',
  'black',
  'transparent',
  'gray',
  'blue',
  'green',
  'aqua',
  'purple',
  'yellow',
  'orange',
  'red',
  'pink',
  'electric_lime',
]

// Pure helpers

/**
 * Normalize a color string so equal colors compare equal:
 * - `#abc` shorthand → `#aabbcc`
 * - lowercased
 * Non-string / non-color inputs are returned unchanged (lowercased if string).
 *
 * @param {unknown} value - Raw color value.
 * @returns {unknown} Normalized value (string) or the original input.
 */
export function normalizeColor(value) {
  if (typeof value !== 'string') return value
  const trimmed = value.trim()
  const short = trimmed.match(/^#([0-9a-fA-F]{3})$/)
  if (short) {
    const c = short[1]
    return `#${c[0]}${c[0]}${c[1]}${c[1]}${c[2]}${c[2]}`.toLowerCase()
  }
  return trimmed.toLowerCase()
}

/**
 * Decide whether a resolved concrete value is a color (hex / rgb(a) / transparent).
 *
 * @param {unknown} value - Concrete value.
 * @returns {boolean}
 */
export function isColorValue(value) {
  return typeof value === 'string' && (/^#[0-9a-fA-F]{3,8}$/.test(value.trim()) || /^rgba?\(/i.test(value.trim()) || value.trim() === 'transparent')
}

/**
 * Build a `normalizedColorValue → "{color.alias.<family>.<scale>}"` reverse map
 * from the alias color index. When several alias names share a concrete value,
 * the one whose family ranks earliest in COLOR_FAMILY_PRIORITY wins.
 *
 * @param {object} aliasIndex - Parsed default color palette (`tokens/alias/color/classic.json`).
 * @returns {Map<string, string>} normalized value → `{color.alias.*}` reference.
 */
export function buildColorReverseMap(aliasIndex) {
  const alias = aliasIndex?.color?.alias ?? {}
  /** @type {Array<{ norm: string, family: string, ref: string }>} */
  const entries = []

  const pushEntry = (rawValue, family, refPath) => {
    if (typeof rawValue !== 'string') return
    entries.push({ norm: normalizeColor(rawValue), family, ref: `{${refPath}}` })
  }

  for (const [family, scales] of Object.entries(alias)) {
    if (typeof scales !== 'object' || scales === null) continue
    if ('$value' in scales) {
      // Family node carries the value directly (white / black / transparent).
      pushEntry(scales.$value, family, `color.alias.${family}`)
      continue
    }
    for (const [scale, node] of Object.entries(scales)) {
      if (node && typeof node === 'object' && '$value' in node) {
        pushEntry(node.$value, family, `color.alias.${family}.${scale}`)
      }
    }
  }

  /** @type {Map<string, string>} */
  const map = new Map()
  const rank = (family) => {
    const i = COLOR_FAMILY_PRIORITY.indexOf(family)
    return i === -1 ? Number.MAX_SAFE_INTEGER : i
  }
  for (const e of entries) {
    const existing = map.get(e.norm)
    if (existing === undefined) {
      map.set(e.norm, e.ref)
    } else {
      // Tie-break: prefer the higher-priority family. Re-derive the family of the
      // currently stored ref by finding the best-ranked entry for this value.
      const candidates = entries.filter(x => x.norm === e.norm)
      candidates.sort((a, b) => rank(a.family) - rank(b.family))
      map.set(e.norm, candidates[0].ref)
    }
  }
  return map
}

/**
 * Compute the `$value` to assign to a missing themeable token, from this repo's own data only.
 *
 * - SEMANTIC token (has a concrete value in `resolvedValues`):
 *     - color → its `{color.alias.*}` reverse-mapped reference (NEEDS MANUAL if no alias match);
 *     - non-color → the literal value.
 * - value-less COMPONENT token (no concrete value) → NEEDS MANUAL: its per-theme value is a design
 *   choice and there is no default here to infer it from.
 *
 * @param {string} name - Token name without leading `--`.
 * @param {object} ctx
 * @param {Record<string, string>} ctx.resolvedValues - `kui_x` → concrete value (dist tokens.json).
 * @param {Map<string, string>} ctx.colorReverseMap - normalized color → `{color.alias.*}`.
 * @returns {{ value: string, manual: boolean, reason?: string }}
 */
export function computeFillValue(name, { resolvedValues, colorReverseMap }) {
  const underscore = name.replace(/-/g, '_')
  if (!Object.prototype.hasOwnProperty.call(resolvedValues, underscore)) {
    return { value: '', manual: true, reason: 'value-less component token — set the theme value manually' }
  }

  const concrete = resolvedValues[underscore]
  if (isColorValue(concrete)) {
    const ref = colorReverseMap.get(normalizeColor(concrete))
    if (ref) return { value: ref, manual: false }
    return { value: '', manual: true, reason: `color "${concrete}" has no {color.alias.*} match` }
  }

  // Non-color: use the resolved concrete literal value.
  return { value: concrete, manual: false }
}

/**
 * PURE CORE. Build a filled theme object by spreading `original` FIRST and only
 * assigning keys that are MISSING. It is structurally impossible for this
 * function to change an existing key's `$value` or `$description`: existing
 * value objects are carried over by reference and never reassigned.
 *
 * @param {Record<string, { $value: unknown, $description?: string }>} original - Parsed theme object.
 * @param {readonly string[]} themeable - `--kui-*` custom property names (KUI_THEMEABLE_TOKENS).
 * @param {Record<string, string>} resolvedValues - `kui_x` (underscore) → concrete value.
 * @param {Record<string, string>} descriptions - `kui-x` → description from buildDescriptionMap.
 * @returns {{ result: Record<string, object>, added: Array<{ name: string, value: string, description: string }>, needsManual: Array<{ name: string, reason: string }> }}
 */
export function fillThemeObject(original, themeable, resolvedValues, descriptions) {
  // Spread original FIRST — every existing entry is preserved verbatim (by reference).
  /** @type {Record<string, object>} */
  const result = { ...original }

  const colorReverseMap = buildColorReverseMap(resolvedValues.__aliasIndex ?? {})

  /** @type {Array<{ name: string, value: string, description: string }>} */
  const added = []
  /** @type {Array<{ name: string, reason: string }>} */
  const needsManual = []

  for (const cssVar of themeable) {
    const name = cssVar.slice(2) // '--kui-x' → 'kui-x'

    // GUARD: only ever assign MISSING keys. Existing keys are never touched.
    if (Object.prototype.hasOwnProperty.call(result, name)) continue

    const { value, manual, reason } = computeFillValue(name, { resolvedValues, colorReverseMap })

    const description = descriptions[name] ?? ''
    const entry = description ? { $description: description, $value: value } : { $value: value }
    result[name] = entry

    added.push({ name, value, description })
    if (manual) needsManual.push({ name, reason: reason ?? 'manual' })
  }

  return { result, added, needsManual }
}

/**
 * Identify keys present in a theme object that are NOT in the themeable set.
 *
 * @param {Record<string, unknown>} themeObj - Parsed theme object.
 * @param {readonly string[]} themeable - `--kui-*` names.
 * @returns {string[]} Sorted list of extra (prunable) key names (without `--`).
 */
export function findExtraKeys(themeObj, themeable) {
  const allowed = new Set(themeable.map(t => t.slice(2)))
  return Object.keys(themeObj).filter(k => !allowed.has(k)).sort()
}

/**
 * Build a pruned copy of a theme object with extra keys removed. Pure; never
 * mutates the input.
 *
 * @param {Record<string, object>} themeObj - Parsed theme object.
 * @param {readonly string[]} themeable - `--kui-*` names.
 * @returns {{ result: Record<string, object>, removed: string[] }}
 */
export function pruneThemeObject(themeObj, themeable) {
  const allowed = new Set(themeable.map(t => t.slice(2)))
  const removed = []
  /** @type {Record<string, object>} */
  const result = {}
  for (const [k, v] of Object.entries(themeObj)) {
    if (allowed.has(k)) result[k] = v
    else removed.push(k)
  }
  return { result, removed: removed.sort() }
}

/**
 * Serialize a theme object IDENTICALLY to how the theme files are stored:
 * top-level keys sorted with the default string comparator, 2-space indent,
 * trailing newline. Existing entry objects are emitted with their original
 * internal key order (JSON.stringify preserves insertion order).
 *
 * @param {Record<string, object>} themeObj - Theme object.
 * @returns {string}
 */
export function serializeTheme(themeObj) {
  /** @type {Record<string, object>} */
  const sorted = {}
  for (const key of Object.keys(themeObj).sort()) sorted[key] = themeObj[key]
  return JSON.stringify(sorted, null, 2) + '\n'
}

// Assertion helpers (throw on violation; callers abort & write nothing)

/**
 * Assert that `result` is an additive-only superset of `original`:
 *   - every original key present with byte-identical $value + $description;
 *   - the ONLY new keys are exactly `expectedAdded`.
 *
 * @param {Record<string, object>} original - Original parsed theme.
 * @param {Record<string, object>} result - Candidate result.
 * @param {string[]} expectedAdded - Names expected to have been added.
 * @throws {Error} on any deviation.
 */
export function assertAdditiveOnly(original, result, expectedAdded) {
  for (const key of Object.keys(original)) {
    if (!Object.prototype.hasOwnProperty.call(result, key)) {
      throw new Error(`Additive-only violation: original key "${key}" missing from result`)
    }
    const a = JSON.stringify(original[key])
    const b = JSON.stringify(result[key])
    if (a !== b) {
      throw new Error(`Additive-only violation: key "${key}" changed.\n  original: ${a}\n  result:   ${b}`)
    }
  }
  const originalKeys = new Set(Object.keys(original))
  const newKeys = Object.keys(result).filter(k => !originalKeys.has(k)).sort()
  const expected = [...expectedAdded].sort()
  if (JSON.stringify(newKeys) !== JSON.stringify(expected)) {
    throw new Error(`Additive-only violation: added set mismatch.\n  added:    ${JSON.stringify(newKeys)}\n  expected: ${JSON.stringify(expected)}`)
  }
}

// IO layer

/**
 * Load all inputs needed for filling: the themeable list, descriptions, resolved
 * values, and the default alias color index (attached as a non-enumerable
 * `__aliasIndex` on `resolvedValues`). Reads dist + alias source ONCE.
 *
 * @returns {Promise<{
 *   themeable: readonly string[],
 *   descriptions: Record<string, string>,
 *   resolvedValues: Record<string, string>,
 * }>}
 */
async function loadInputs() {
  const tokensJsonPath = join(ROOT, 'dist', 'tokens', 'js', 'tokens.json')
  // classic.json is the canonical default palette: missing semantic tokens fill at their default value,
  // expressed as a ref into the default palette (index.json was removed in the per-theme alias refactor).
  const aliasIndexPath = join(ROOT, 'tokens', 'alias', 'color', 'classic.json')

  const [themeable, descriptions, tokensRaw, aliasRaw] = await Promise.all([
    getThemeableTokens(),
    buildDescriptionMap(),
    readFile(tokensJsonPath, 'utf-8'),
    readFile(aliasIndexPath, 'utf-8'),
  ])

  const resolvedValues = JSON.parse(tokensRaw)
  // Attach the alias index so the pure core can build the color reverse map
  // without doing IO. Non-enumerable so it never leaks into a theme object.
  Object.defineProperty(resolvedValues, '__aliasIndex', {
    value: JSON.parse(aliasRaw),
    enumerable: false,
  })

  return {
    themeable,
    descriptions,
    resolvedValues,
  }
}

/**
 * Process a single theme file: dry-run report, or guarded atomic write.
 *
 * @param {string} themeName - Theme name (no extension).
 * @param {object} opts
 * @param {boolean} opts.write - Apply changes to disk.
 * @param {boolean} opts.prune - Remove non-themeable keys.
 * @param {object} inputs - Result of loadInputs().
 * @returns {Promise<{ ok: boolean, added: string[], removed: string[], manual: Array<{ name: string, reason: string }> }>}
 */
async function processTheme(themeName, opts, inputs) {
  const filePath = join(ROOT, 'themes', `${themeName}.json`)
  if (!existsSync(filePath)) {
    console.error(`! ${themeName}: themes/${themeName}.json not found — skipping.`)
    return { ok: false, added: [], removed: [], manual: [] }
  }

  // Parse-guard: never proceed on an unparseable file.
  let original
  try {
    original = JSON.parse(await readFile(filePath, 'utf-8'))
  } catch (err) {
    console.error(`! ${themeName}: failed to parse JSON — aborting this file. ${err.message}`)
    return { ok: false, added: [], removed: [], manual: [] }
  }

  // Build the filled (additive-only) result.
  const { result: filled, added, needsManual } = fillThemeObject(
    original,
    inputs.themeable,
    inputs.resolvedValues,
    inputs.descriptions,
  )

  // Optionally prune extra keys (only after fill, on a copy).
  let finalObj = filled
  let removed = []
  if (opts.prune) {
    const pruned = pruneThemeObject(filled, inputs.themeable)
    finalObj = pruned.result
    removed = pruned.removed
  }

  const addedNames = added.map(a => a.name)

  // Pre-write assertions (run for both dry-run and write so problems surface early).
  assertAdditiveOnly(original, filled, addedNames)
  let serialized
  try {
    serialized = serializeTheme(finalObj)
    JSON.parse(serialized) // re-serializes to valid JSON
  } catch (err) {
    throw new Error(`${themeName}: serialization produced invalid JSON — aborting. ${err.message}`)
  }

  // Report
  console.log(`\n=== ${themeName} ===`)
  if (added.length === 0) console.log('  No missing tokens — already complete.')
  else {
    console.log(`  ${added.length} token(s) to add:`)
    for (const a of added) console.log(`    + ${a.name}  →  ${JSON.stringify(a.value)}`)
  }
  if (needsManual.length) {
    console.log(`  NEEDS MANUAL VALUE (${needsManual.length}) — added with empty $value:`)
    for (const m of needsManual) console.log(`    ? ${m.name}  (${m.reason})`)
  }
  if (opts.prune) {
    if (removed.length) {
      console.log(`  ${removed.length} extra key(s) to PRUNE:`)
      for (const r of removed) console.log(`    - ${r}`)
    } else {
      console.log('  No extra (non-themeable) keys to prune.')
    }
  }

  if (!opts.write) {
    if (added.length || removed.length) console.log('  (dry-run — pass --write to apply)')
    return { ok: true, added: addedNames, removed, manual: needsManual }
  }

  if (added.length === 0 && removed.length === 0) {
    console.log('  Nothing to write.')
    return { ok: true, added: [], removed: [], manual: needsManual }
  }

  // Guarded atomic write: backup → tmp → parse-check tmp → rename → re-read verify.
  const bakPath = `${filePath}.bak`
  const tmpPath = `${filePath}.tmp`
  await copyFile(filePath, bakPath)
  await writeFile(tmpPath, serialized, 'utf-8')

  try {
    // Confirm the tmp file parses before swapping it in.
    JSON.parse(await readFile(tmpPath, 'utf-8'))
    await rename(tmpPath, filePath)

    // Post-write round-trip: re-read the written file and re-assert additive-only
    // vs the ORIGINAL (ignoring prune-removed keys). On any mismatch → restore.
    const written = JSON.parse(await readFile(filePath, 'utf-8'))
    const removedSet = new Set(removed)
    const originalMinusPruned = Object.fromEntries(
      Object.entries(original).filter(([k]) => !removedSet.has(k)),
    )
    assertAdditiveOnly(originalMinusPruned, written, addedNames)

    await unlink(bakPath)
    console.log(`  ✓ Wrote themes/${themeName}.json (${added.length} added${opts.prune ? `, ${removed.length} pruned` : ''}).`)
    return { ok: true, added: addedNames, removed, manual: needsManual }
  } catch (err) {
    // Restore from backup on ANY failure during/after the swap.
    if (existsSync(tmpPath)) await unlink(tmpPath).catch(() => {})
    if (existsSync(bakPath)) await rename(bakPath, filePath)
    throw new Error(`${themeName}: post-write verification failed — restored from backup. ${err.message}`)
  }
}

// CLI entry point

if (process.argv[1] === __filename) {
  const args = process.argv.slice(2)
  const opts = {
    write: args.includes('--write'),
    prune: args.includes('--prune'),
  }

  const inputs = await loadInputs()

  let hadError = false
  for (const themeName of EXHAUSTIVE_THEMES) {
    try {
      const r = await processTheme(themeName, opts, inputs)
      if (!r.ok) hadError = true
    } catch (err) {
      hadError = true
      console.error(`\n! ${themeName}: ${err.message}`)
    }
  }

  if (!opts.write) {
    console.log('\nDry-run complete. No files were modified.')
  }
  process.exit(hadError ? 1 : 0)
}
