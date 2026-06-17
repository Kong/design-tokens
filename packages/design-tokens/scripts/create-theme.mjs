#!/usr/bin/env node
/**
 * Scaffold a new theme file from the current KUI_THEMEABLE_TOKENS list.
 *
 * Usage:
 *   pnpm create-theme <name> [--from <existing-theme-name>]
 *
 * Examples:
 *   pnpm create-theme my-brand                       # empty $value for every token
 *   pnpm create-theme my-brand --from konnect-light  # copies values from konnect-light
 *
 * Prerequisites:
 *   Run `pnpm build:tokens` first — the script reads dist/themeable-tokens.mjs
 *   to obtain the canonical, up-to-date token list.
 */

import { readFile, readdir, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { existsSync } from 'node:fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = join(__dirname, '..')

/** Scale token key patterns — pure numbered scales that carry no meaningful description for theme authors. */
const SCALE_TOKEN_PATTERNS = [
  /^kui-space-/,
  /^kui-border-radius-\d+$/,
  /^kui-border-width-/,
  /^kui-icon-size-/,
  /^kui-line-height-/,
  /^kui-letter-spacing-/,
]

// Helpers (exported for testing)

/**
 * Recursively extract token descriptions from a source token JSON object.
 * Handles the DTCG `_` key convention — `_` is stripped from generated names.
 *
 * @param {object} obj - Parsed JSON node
 * @param {string[]} path - Accumulated path segments
 * @param {Record<string, string>} result - Mutated in place
 */
export function extractDescriptions(obj, path, result) {
  if (typeof obj !== 'object' || obj === null) return
  if ('$value' in obj) {
    // Filter standalone `_` default-state markers, then normalize remaining segments to kebab-case
    // so that source keys like `line_height` or `input_switch` produce `line-height` / `input-switch`.
    const cleanPath = path.filter(s => s !== '_').map(s => s.replace(/[\W_]+/g, '-'))
    if (cleanPath.length > 0) {
      result[`kui-${cleanPath.join('-')}`] = obj.$description || ''
    }
    return
  }
  for (const [key, value] of Object.entries(obj)) {
    if (!key.startsWith('$') && typeof value === 'object') {
      extractDescriptions(value, [...path, key], result)
    }
  }
}

/**
 * Clean a raw description from a source token JSON file per authoring rules:
 * - Scale tokens (by key pattern) → `''` — numbered scale tokens carry no useful description
 * - Trailing parenthetical alias/value refs are stripped: "(white)", "(blue.60)", "(rgba(...))"
 * - Pure CSS value descriptions (no terminal sentence period) → `''`
 *
 * @param {string} key - Token key without leading '--' (e.g. 'kui-color-background')
 * @param {string} rawDesc - Raw description string from source JSON
 * @returns {string}
 */
export function cleanDescription(key, rawDesc) {
  if (SCALE_TOKEN_PATTERNS.some(re => re.test(key))) return ''
  if (!rawDesc) return ''

  // Strip trailing parenthetical refs, e.g. " (white).", " (blue.60).", " (rgba(0,0,0,0.08))"
  const stripped = rawDesc.replace(/\s*\([^)]*\)\.?\s*$/, '').trim()

  // Restore the terminal period when it was inside the stripped parenthetical
  const result = stripped && !stripped.endsWith('.') && rawDesc.trimEnd().endsWith('.')
    ? stripped + '.'
    : stripped

  // Pure CSS value descriptions do not form a sentence (no terminal period) — discard them
  return result.endsWith('.') ? result : ''
}

/**
 * Build a `tokenName → description` map by scanning all token source directories.
 * Descriptions are cleaned per authoring rules via `cleanDescription`.
 *
 * @param {string[]} sourceDirs - Absolute paths to scan recursively.
 * @returns {Promise<Record<string, string>>}
 */
export async function buildDescriptionMap(sourceDirs = [join(ROOT, 'tokens', 'source'), join(ROOT, 'tokens', 'components')]) {
  const result = {}
  await Promise.all(
    sourceDirs.map(async dir => {
      const files = await readdir(dir, { recursive: true })
      await Promise.all(
        files
          .filter(f => f.endsWith('.json'))
          .map(async f => {
            const parsed = JSON.parse(await readFile(join(dir, f), 'utf-8'))
            const raw = {}
            extractDescriptions(parsed, [], raw)
            for (const [k, desc] of Object.entries(raw)) {
              result[k] = cleanDescription(k, desc)
            }
          }),
      )
    }),
  )
  return result
}

/**
 * Load the canonical token list from the built dist.
 * @param {string} distDir - Absolute path to the dist directory.
 * @returns {Promise<readonly string[]>}
 */
export async function getThemeableTokens(distDir = join(ROOT, 'dist')) {
  const distPath = join(distDir, 'themeable-tokens.mjs')
  if (!existsSync(distPath)) {
    console.error('Error: dist/themeable-tokens.mjs not found.')
    console.error('Run `pnpm build:tokens` first, then retry.')
    process.exit(1)
  }
  const { KUI_THEMEABLE_TOKENS } = await import(distPath)
  return KUI_THEMEABLE_TOKENS
}

/**
 * Load an existing theme's `$value` entries as a `tokenName → value` map.
 * @param {string} themesDir - Absolute path to the themes directory.
 * @param {string} name - Theme name (kebab-case, no .json extension).
 * @returns {Promise<Record<string, string>>}
 */
export async function loadSourceTheme(themesDir, name) {
  const src = join(themesDir, `${name}.json`)
  if (!existsSync(src)) {
    console.error(`Error: source theme "${name}" not found at themes/${name}.json`)
    process.exit(1)
  }
  const obj = JSON.parse(await readFile(src, 'utf-8'))
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([, v]) => v?.$value !== undefined)
      .map(([k, v]) => [k, v.$value]),
  )
}

/**
 * Write a scaffolded theme file.
 *
 * @param {object} opts
 * @param {string} opts.outPath - Absolute path for the output file.
 * @param {readonly string[]} opts.tokens - Array of `--kui-*` CSS custom property names.
 * @param {Record<string, string>} opts.descriptions - `kui-*` token name → description.
 * @param {Record<string, string>} [opts.sourceValues] - `kui-*` token name → value (for --from).
 * @returns {Promise<void>}
 */
export async function createTheme({ outPath, tokens, descriptions, sourceValues = {} }) {
  const themeObj = {}
  for (const cssVar of tokens) {
    const key = cssVar.slice(2) // '--kui-color-background' → 'kui-color-background'
    const $value = sourceValues[key] ?? ''
    const $description = descriptions[key] ?? ''

    themeObj[key] = $description
      ? { $description, $value }
      : { $value }
  }
  await writeFile(outPath, JSON.stringify(themeObj, null, 2) + '\n', 'utf-8')
}

// CLI entry point

if (process.argv[1] === __filename) {
  const THEMES_DIR = join(ROOT, 'themes')

  const args = process.argv.slice(2)
  const nameArg = args.find(a => !a.startsWith('--'))
  const fromIndex = args.indexOf('--from')
  const fromName = fromIndex !== -1 ? args[fromIndex + 1] ?? null : null

  if (!nameArg) {
    console.error('Error: theme name is required.\n')
    console.error('Usage:   pnpm create-theme <name> [--from <existing-theme>]')
    console.error('Example: pnpm create-theme my-brand --from konnect-light\n')
  }

  const themeName = nameArg.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const outPath = join(THEMES_DIR, `${themeName}.json`)

  if (existsSync(outPath)) {
    console.error(`Error: themes/${themeName}.json already exists.`)
    console.error('Choose a different name, or delete the existing file first.')
    process.exit(1)
  }

  const [tokens, descriptions, sourceValues] = await Promise.all([
    getThemeableTokens(),
    buildDescriptionMap(),
    fromName ? loadSourceTheme(THEMES_DIR, fromName) : Promise.resolve({}),
  ])

  await createTheme({ outPath, tokens, descriptions, sourceValues })

  const fromNote = fromName
    ? ` (values copied from "${fromName}")`
    : ' (all $value fields are empty — fill them in to define your theme)'
  console.log(`✓ Created themes/${themeName}.json${fromNote}`)
  console.log(`  ${tokens.length} tokens scaffolded.`)
}
