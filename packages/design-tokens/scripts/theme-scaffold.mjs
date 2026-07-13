#!/usr/bin/env node
/**
 * Scaffold a new, exhaustive theme directly from the canonical token tree.
 *
 * A new theme always contains every themeable token (semantic + component), matching
 * `KUI_THEMEABLE_TOKENS` by construction:
 *   - semantic tokens (`tokens/source/**`) are seeded with their real default `{color.alias.*}`
 *     mapping — safe, sensible defaults;
 *   - component tokens (`tokens/components/**`) are seeded as empty slots (`$value: ''`) for the
 *     author to fill deliberately — a component token's value is a genuine design decision
 *     and cannot be safely defaulted.
 *
 * The palette is seeded from `classic-day`'s alias palette (real neutral values), so a freshly
 * scaffolded theme builds, renders, and can publish to the preview npm channel immediately —
 * `pnpm themes:unfilled <name>` reports which palette families and component slots still need
 * deliberate values.
 *
 * Usage: node scripts/theme-scaffold.mjs <theme-name>
 */
import { readFile, writeFile, mkdir, readdir, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { flattenTokenTree } from '../utilities/token-tree.mjs'
import { THEME_BREAKPOINTS } from '../platforms/themes.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PACKAGE_ROOT = join(__dirname, '..')
const DEFAULT_THEMES_ROOT = join(PACKAGE_ROOT, 'themes')
const DEFAULT_SEED_PALETTE_FILE = join(DEFAULT_THEMES_ROOT, 'classic-day', 'classic-day.alias.color.json')
const DEFAULT_DIST_THEMES_DIR = join(PACKAGE_ROOT, 'dist', 'themes')

// Every hyphen-separated segment must start with a letter (no leading digit or hyphen) — not just
// the first one. `toExportName` (platforms/themes.mjs) camelCases a name by uppercasing the letter
// right after each hyphen (`-([a-z])`); a digit there (e.g. "brand-2") survives untouched, producing
// an invalid JS identifier ("brand-2") in the generated `dist/themes/index.mjs`/`.cjs` exports.
// Requiring a letter after every hyphen guarantees `toExportName` can always convert this name.
const KEBAB_CASE = /^[a-z][a-z0-9]*(-[a-z][a-z0-9]*)*$/

/** Recursively collect every `.json` file under `dir`. */
async function collectJsonFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true })
  return entries
    .filter(e => e.isFile() && e.name.endsWith('.json'))
    // `parentPath` replaced the now-deprecated `path` property in newer Node — the fallback keeps
    // this working across the Node versions this repo's `engines` range actually allows.
    .map(e => join(e.parentPath ?? e.path, e.name))
}

// Matches a $value that is ENTIRELY one reference, e.g. "{font.family.text}" — not
// "1px solid {color.alias.gray.20}", which has other text around the reference and must be left
// alone (that composite/embedded case is deliberately unhandled; see `resolveNonAliasReference`).
const BARE_REFERENCE = /^\{([^}]+)\}$/

/**
 * Build a raw dot-path (the literal JSON key path, e.g. `font.family.text`) → leaf-value lookup
 * across a set of parsed token trees, keyed by `flattenTokenTree`'s raw `path` (not its derived
 * `kui-*` name — a `{a.b.c}` reference is written against the raw JSON path, verbatim segments
 * like `_`/`line_height` included).
 * @param {unknown[]} trees - Parsed JSON token trees.
 * @returns {Map<string, { $value: unknown }>}
 */
function buildReferenceLookup(trees) {
  const lookup = new Map()
  for (const tree of trees) {
    for (const { path, value } of flattenTokenTree(tree)) {
      lookup.set(path.join('.'), { $value: value })
    }
  }
  return lookup
}

/**
 * Resolve a token's raw `$value` to a literal, following non-`color.alias.*` cross-references (e.g.
 * `tokens/source/font/family.json`'s `heading` token is a bare `{font.family.text}` reference).
 *
 * `{color.alias.*}` references are deliberately left UNRESOLVED: a per-theme build only includes that
 * theme's own palette (not the rest of `tokens/source`), so a color-alias reference resolves later,
 * per-theme, against the theme's own colors — that's the whole mechanism a theme uses to swap colors
 * in. Any OTHER cross-reference (e.g. one semantic token pointing at another, like a heading font
 * family aliasing the body font family) has no such per-theme resolution step, so it must be resolved
 * to its final literal value now, or the per-theme build fails with an unresolved-reference error.
 * @param {unknown} value - A token's raw `$value`.
 * @param {Map<string, { $value: unknown }>} lookup - From `buildReferenceLookup`.
 * @param {Set<string>} [seen] - Visited paths, for circular-reference detection (internal recursion state).
 * @returns {unknown}
 */
export function resolveNonAliasReference(value, lookup, seen = new Set()) {
  if (typeof value !== 'string') return value
  const match = value.match(BARE_REFERENCE)
  if (!match) return value // not a bare `{...}` reference (e.g. embedded in a larger string) — leave as-is
  const path = match[1]
  if (path.startsWith('color.alias.')) return value // resolved later, per-theme, against that theme's palette
  if (seen.has(path)) {
    throw new Error(`Circular token reference detected while resolving "{${path}}".`)
  }
  const target = lookup.get(path)
  if (!target) {
    throw new Error(`Token reference "{${path}}" could not be resolved against tokens/source.`)
  }
  return resolveNonAliasReference(target.$value, lookup, new Set(seen).add(path))
}

/**
 * The canonical semantic-token defaults: every `tokens/source/**` leaf, keyed by its `kui-*` name,
 * with its own default `$value`/`$description` — excluding build-injected breakpoint tokens, which
 * must never appear in a source theme file. Non-`color.alias.*` cross-references are resolved to
 * their literal value (see `resolveNonAliasReference`); `color.alias.*` references are preserved.
 * @returns {Promise<Map<string, { value: unknown, description: string | undefined }>>}
 */
export async function buildSemanticTokenDefaults() {
  const breakpointNames = new Set(Object.keys(THEME_BREAKPOINTS))
  const files = await collectJsonFiles(join(PACKAGE_ROOT, 'tokens', 'source'))
  const trees = await Promise.all(files.map(async file => JSON.parse(await readFile(file, 'utf-8'))))
  const lookup = buildReferenceLookup(trees)

  const defaults = new Map()
  for (const tree of trees) {
    for (const { name, value, description } of flattenTokenTree(tree)) {
      if (breakpointNames.has(name)) continue
      defaults.set(name, { value: resolveNonAliasReference(value, lookup), description })
    }
  }
  return defaults
}

/**
 * The canonical component-token slots: every `tokens/components/**` leaf, keyed by its `kui-*` name,
 * forced to an empty `$value` regardless of the source file's own value (component tokens are
 * value-less by design — see `tokens/components/README` convention) for the author to fill deliberately.
 * @returns {Promise<Map<string, { value: '', description: string | undefined }>>}
 */
export async function buildComponentTokenSlots() {
  const files = await collectJsonFiles(join(PACKAGE_ROOT, 'tokens', 'components'))
  const trees = await Promise.all(files.map(async file => JSON.parse(await readFile(file, 'utf-8'))))

  const slots = new Map()
  for (const tree of trees) {
    for (const { name, description } of flattenTokenTree(tree)) {
      slots.set(name, { value: '', description })
    }
  }
  return slots
}

/** Natural, case-sensitive comparator matching the repo's token-name sort convention. */
const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'variant' })

/**
 * Merge semantic defaults and component slots into one flat, naturally-sorted theme document
 * ready to serialize as `<name>.theme.json`.
 * @param {Map<string, { value: unknown, description: string | undefined }>} semanticDefaults
 * @param {Map<string, { value: unknown, description: string | undefined }>} componentSlots
 * @returns {Record<string, { $value: unknown, $description?: string }>}
 */
export function buildThemeDocument(semanticDefaults, componentSlots) {
  const entries = [...semanticDefaults, ...componentSlots]
  entries.sort(([a], [b]) => collator.compare(a, b))
  const doc = {}
  for (const [name, { value, description }] of entries) {
    doc[name] = description !== undefined ? { $value: value, $description: description } : { $value: value }
  }
  return doc
}

const PROPERTY_WORDS = [
  'color', 'border', 'font', 'padding', 'shadow', 'size', 'space', 'gap',
  'line', 'letter', 'width', 'height', 'radius', 'weight',
]

/**
 * Group a theme document's tokens by component/concept prefix — the segment(s) of the name up to
 * the first "property word" (`color`, `border`, `font`, etc.), largest group first. Used to present
 * a theme's token surface as a design-spec backbone (decide each component as a unit) rather than a
 * flat alphabetical list.
 * @param {Record<string, { $value: unknown }>} themeDoc
 * @returns {Array<{ group: string, tokens: Array<{ name: string, value: unknown }> }>}
 */
export function groupTokensByComponent(themeDoc) {
  const groups = new Map()
  for (const [name, { $value }] of Object.entries(themeDoc)) {
    const parts = name.replace(/^kui-/, '').split('-')
    const cut = parts.findIndex(part => PROPERTY_WORDS.includes(part))
    // No property word found anywhere (cut === -1, e.g. "kui-animation-duration-20") → the whole
    // name is its own group; a property word as the very FIRST segment (cut === 0, e.g.
    // "kui-color-background") also keeps at least that one segment, via Math.max(cut, 1) — otherwise
    // `parts.slice(0, 0)` would keep nothing at all. Otherwise, group by the segment(s) before the
    // first property word (e.g. "kui-button-color-*" and "kui-button-border-*" both group under
    // "button").
    const groupLength = cut === -1 ? parts.length : Math.max(cut, 1)
    const group = parts.slice(0, groupLength).join('-')
    if (!groups.has(group)) groups.set(group, [])
    groups.get(group).push({ name, value: $value })
  }
  for (const tokens of groups.values()) tokens.sort((a, b) => collator.compare(a.name, b.name))
  return [...groups.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .map(([group, tokens]) => ({ group, tokens }))
}

/**
 * Validate a new theme name and directory don't already exist.
 * @param {string} name
 * @param {string} themesRoot
 */
function assertValidNewTheme(name, themesRoot) {
  if (!KEBAB_CASE.test(name)) {
    throw new Error(`Theme name "${name}" must be kebab-case (lowercase letters, digits, hyphens), e.g. "my-brand".`)
  }
  if (existsSync(join(themesRoot, name))) {
    throw new Error(`Theme "${name}" already exists at ${join(themesRoot, name)}.`)
  }
}

/**
 * Scaffold a new, exhaustive theme: `themes/<name>/<name>.theme.json` (semantic defaults + empty
 * component slots) and `themes/<name>/<name>.alias.color.json` (seeded from classic-day's palette).
 * @param {string} name - Kebab-case theme name.
 * @param {object} [options]
 * @param {string} [options.themesRoot] - Where to write the new theme directory (override for testing).
 * @returns {Promise<{ themeDir: string, semanticCount: number, componentCount: number }>}
 */
export async function scaffoldTheme(name, options = {}) {
  const themesRoot = options.themesRoot ?? DEFAULT_THEMES_ROOT

  assertValidNewTheme(name, themesRoot)

  // Three independent reads (semantic tree, component tree, seed palette) — safe to run concurrently.
  // The seed palette is read as raw TEXT, deliberately never JSON.parse'd: a family object's keys
  // are "05".."100", and re-serializing a parsed JS object would silently reorder the integer-like
  // keys ("10".."100") ahead of "05" (no leading zero allowed for a real integer index), corrupting
  // the natural step order every consumer and lint rule expects.
  const [semanticDefaults, componentSlots, seedPaletteText] = await Promise.all([
    buildSemanticTokenDefaults(),
    buildComponentTokenSlots(),
    readFile(DEFAULT_SEED_PALETTE_FILE, 'utf-8'),
  ])

  const themeDoc = buildThemeDocument(semanticDefaults, componentSlots)
  const themeDir = join(themesRoot, name)
  await mkdir(themeDir, { recursive: true })
  await writeFile(join(themeDir, `${name}.theme.json`), JSON.stringify(themeDoc, null, 2) + '\n', 'utf-8')
  await writeFile(join(themeDir, `${name}.alias.color.json`), seedPaletteText, 'utf-8')

  return { themeDir, semanticCount: semanticDefaults.size, componentCount: componentSlots.size }
}

/**
 * Remove a theme and every trace of its build output — the standalone-theme workflow's cleanup
 * step (scaffold, iterate, extract `dist/themes/<name>.css`, then leave the repo exactly as it
 * started). Safe to call on a theme that was never scaffolded (a no-op, not an error).
 * @param {string} name - Theme name.
 * @param {object} [options]
 * @param {string} [options.themesRoot] - Where the theme directory lives (override for testing).
 * @param {string} [options.distThemesDir] - Where compiled theme output lives (override for testing).
 * @returns {Promise<{ removed: string[] }>}
 */
export async function teardownTheme(name, options = {}) {
  const themesRoot = options.themesRoot ?? DEFAULT_THEMES_ROOT
  const distThemesDir = options.distThemesDir ?? DEFAULT_DIST_THEMES_DIR
  const removed = []

  const themeDir = join(themesRoot, name)
  if (existsSync(themeDir)) {
    await rm(themeDir, { recursive: true, force: true })
    removed.push(themeDir)
  }

  if (existsSync(distThemesDir)) {
    for (const file of await readdir(distThemesDir)) {
      // The trailing dot means this only matches this theme's own output (`<name>.css`, `<name>.mjs`,
      // …) — never the shared `index.*` barrel, and never another theme whose name happens to share
      // this one as a prefix (e.g. tearing down "button" doesn't touch "button-dark.css").
      if (file.startsWith(`${name}.`)) {
        await rm(join(distThemesDir, file))
        removed.push(join(distThemesDir, file))
      }
    }
  }

  return { removed }
}

/** Print a theme's token inventory grouped by component, largest group first — the backbone for a design spec. */
async function printInventory(name, themesRoot = DEFAULT_THEMES_ROOT) {
  const themeDoc = JSON.parse(await readFile(join(themesRoot, name, `${name}.theme.json`), 'utf-8'))
  const groups = groupTokensByComponent(themeDoc)
  console.log(`\n=== Token inventory: ${Object.keys(themeDoc).length} themeable tokens in ${groups.length} groups ===`)
  console.log('(Use this as the backbone of the design spec — decide each group as a unit.)\n')
  for (const { group, tokens } of groups) {
    console.log(`● ${group} (${tokens.length})`)
    for (const { name: tokenName, value } of tokens) console.log(`    ${tokenName}: ${JSON.stringify(value)}`)
  }
}

// ── CLI entry ────────────────────────────────────────────────────────────────

if (import.meta.url === `file://${process.argv[1]}`) {
  const [name, flag] = process.argv.slice(2)
  if (!name) {
    console.error('Usage: node scripts/theme-scaffold.mjs <theme-name> [--inventory|--teardown]')
    process.exit(1)
  }
  try {
    if (flag === '--teardown') {
      const { removed } = await teardownTheme(name)
      if (removed.length === 0) console.log(`Nothing to remove for "${name}".`)
      else for (const path of removed) console.log(`Removed ${path}`)
      console.log('\nRun `pnpm --filter @kong/design-tokens test` and `git status` to confirm zero residue.')
    } else if (flag === '--inventory') {
      await printInventory(name)
    } else {
      const { themeDir, semanticCount, componentCount } = await scaffoldTheme(name)
      console.log(`Scaffolded "${name}" at ${themeDir}`)
      console.log(`  ${semanticCount} semantic tokens seeded with their default values.`)
      console.log(`  ${componentCount} component tokens left as empty slots — fill these deliberately.`)
      console.log('  Palette seeded from classic-day — replace with the theme\'s real brand colors.')
      await printInventory(name)
      console.log('\nRun `pnpm themes:unfilled <theme-name>` to track what still needs a real value.')
    }
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
}
