#!/usr/bin/env node
/**
 * Reconcile every theme in `themes/` against the canonical token tree — the maintenance path that
 * replaces hand-editing every theme file when a token is added to `tokens/source/**` or
 * `tokens/components/**`.
 *
 * For each theme:
 *   - a token that's canonical but missing from the theme is ADDED (semantic → its source default,
 *     component → an empty slot to fill deliberately) — UNLESS the theme is one of
 *     `SEMANTIC_ONLY_THEMES` (e.g. `classic-day`/`classic-night`), which only ever gains semantic
 *     tokens, since those themes must contain zero component tokens;
 *   - a token already present is NEVER touched — an existing value (including a deliberate
 *     theme-specific override, e.g. electric-lime-day's `kui-color-background-primary` diverging from its
 *     semantic default) is never regenerated or overwritten;
 *   - a token present in the theme but no longer canonical (including a stray component token on a
 *     semantic-only theme) is REPORTED as `extra`, never silently removed — the existing
 *     exhaustiveness drift guard (`themes.spec.mjs`) already fails loudly on this, so `sync` surfaces
 *     it for a human decision rather than guessing at a fix.
 *
 * Usage: node scripts/themes-sync.mjs
 */
import { readFile, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { buildSemanticTokenDefaults, buildComponentTokenSlots } from './theme-scaffold.mjs'
import { SEMANTIC_ONLY_THEMES, discoverThemes } from '../platforms/themes.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DEFAULT_THEMES_ROOT = join(__dirname, '..', 'themes')

/**
 * Pure reconciliation: given a parsed theme document and the canonical semantic/component maps,
 * return the theme with any missing canonical tokens added, plus which names were `added` and which
 * present names are `extra` (canonical-set membership only — never mutates or removes anything).
 *
 * A semantic-only theme (`SEMANTIC_ONLY_THEMES`, e.g. `classic-day`/`classic-night`) must never gain
 * component tokens — `isSemanticOnly` restricts its canonical set to semantic tokens only, so a stray
 * component token already present is correctly reported as `extra` instead of being treated as
 * expected.
 * @param {Record<string, { $value: unknown, $description?: string }>} existingTheme
 * @param {Map<string, { value: unknown, description: string | undefined }>} semanticDefaults
 * @param {Map<string, { value: unknown, description: string | undefined }>} componentSlots
 * @param {{ isSemanticOnly?: boolean }} [options]
 * @returns {{ theme: Record<string, object>, added: string[], extra: string[] }}
 */
export function reconcileTheme(existingTheme, semanticDefaults, componentSlots, options = {}) {
  // A semantic-only theme's canonical set excludes component tokens entirely — so a component
  // token is never added here, and one already present falls into `extra` below.
  const canonical = options.isSemanticOnly ? new Map(semanticDefaults) : new Map([...semanticDefaults, ...componentSlots])
  const theme = { ...existingTheme } // shallow copy: existing entries are reused as-is, never rewritten
  const added = []

  for (const [name, { value, description }] of canonical) {
    if (name in theme) continue // never touch a token the theme already sets — see module docstring
    theme[name] = description !== undefined ? { $value: value, $description: description } : { $value: value }
    added.push(name)
  }

  // Membership-only diff against `canonical` — a name here is reported, never deleted (module docstring).
  const extra = Object.keys(existingTheme).filter(name => !canonical.has(name)).sort()

  return { theme, added: added.sort(), extra }
}

/**
 * Sync a single theme directory on disk: read `<name>.theme.json`, reconcile, and rewrite the file
 * only if tokens were actually added (a fully-synced theme is left untouched — no timestamp/diff churn).
 * @param {string} name - Theme name (directory under `themesRoot`).
 * @param {object} [options]
 * @param {string} [options.themesRoot]
 * @param {Map<string, object>} [options.semanticDefaults] - Precomputed, to avoid re-deriving the
 *   whole `tokens/source` tree per theme when syncing many themes in one run (see `syncAllThemes`).
 *   Computed fresh if omitted, so calling `syncTheme` standalone still works.
 * @param {Map<string, object>} [options.componentSlots] - Same as `semanticDefaults`, for `tokens/components`.
 * @returns {Promise<{ name: string, added: string[], extra: string[], changed: boolean }>}
 */
export async function syncTheme(name, options = {}) {
  const themesRoot = options.themesRoot ?? DEFAULT_THEMES_ROOT
  const themeFile = join(themesRoot, name, `${name}.theme.json`)

  const [existingThemeText, semanticDefaults, componentSlots] = await Promise.all([
    readFile(themeFile, 'utf-8'),
    options.semanticDefaults ?? buildSemanticTokenDefaults(),
    options.componentSlots ?? buildComponentTokenSlots(),
  ])
  const existingTheme = JSON.parse(existingThemeText)

  const { theme, added, extra } = reconcileTheme(existingTheme, semanticDefaults, componentSlots, {
    isSemanticOnly: SEMANTIC_ONLY_THEMES.includes(name),
  })

  // Only rewrite the file when something actually changed — an already-synced theme is left with
  // an untouched mtime/diff, so running sync repeatedly doesn't create noise.
  if (added.length > 0) {
    await writeFile(themeFile, JSON.stringify(theme, null, 2) + '\n', 'utf-8')
  }

  return { name, added, extra, changed: added.length > 0 }
}

/**
 * Discover and sync every theme directory under `themesRoot`, via the same `discoverThemes` the
 * real build uses — so a malformed entry (a stray file, a directory missing its `<name>.theme.json`)
 * is a loud, immediate error here too, not a silent no-op that only surfaces later at build time.
 * @param {{ themesRoot?: string }} [options]
 * @returns {Promise<Array<{ name: string, added: string[], extra: string[], changed: boolean }>>}
 */
export async function syncAllThemes(options = {}) {
  const themesRoot = options.themesRoot ?? DEFAULT_THEMES_ROOT
  const themes = await discoverThemes(themesRoot)

  // Computed ONCE for the whole run, not once per theme — buildSemanticTokenDefaults/
  // buildComponentTokenSlots each re-read and re-parse every file under tokens/source and
  // tokens/components, so recomputing them per theme was pure O(themes × tokenFiles) waste.
  const [semanticDefaults, componentSlots] = await Promise.all([
    buildSemanticTokenDefaults(),
    buildComponentTokenSlots(),
  ])

  // Now safe to run concurrently: with the shared trees precomputed, each syncTheme call only
  // touches that theme's own file, so there's no redundant work or shared state left to race on.
  return Promise.all(
    themes.map(({ name }) => syncTheme(name, { themesRoot, semanticDefaults, componentSlots })),
  )
}

// ── CLI entry ────────────────────────────────────────────────────────────────

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const results = await syncAllThemes()
    for (const { name, added, extra, changed } of results) {
      if (changed) console.log(`${name}: added ${added.length} missing token(s) — ${added.join(', ')}`)
      else console.log(`${name}: already in sync`)
      if (extra.length > 0) {
        console.warn(`${name}: EXTRA token(s) no longer canonical (not removed — review manually): ${extra.join(', ')}`)
      }
    }
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
}
