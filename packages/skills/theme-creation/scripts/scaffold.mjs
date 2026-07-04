#!/usr/bin/env node
/**
 * scaffold.mjs — deterministic Half-A mechanics for the theme-creation skill.
 *
 * Creates (or tears down) the two files a new @kong/design-tokens theme needs, and prints a
 * component-grouped inventory of every themeable token to seed the design spec (SKILL.md Step 3.5).
 * No classification edit is required: themes.spec.mjs treats every theme in themes/ as exhaustive
 * by default (only classic-day/classic-night are opted out as semantic-only), so a new theme is
 * covered by the guards automatically and teardown just deletes files.
 *
 * Why this exists: every one of these steps used to be prose the agent could forget — file
 * completeness, palette value-leak from the template, "derive the token list live," reversing it
 * all on teardown. Doing it in code makes those failure modes structurally impossible instead of
 * relying on the agent to remember.
 *
 * Usage (run from anywhere; paths resolve to the design-tokens package automatically):
 *   node scaffold.mjs <theme-name> [--from konnect-day|konnect-night]   # create
 *   node scaffold.mjs <theme-name> --inventory                          # re-print inventory only
 *   node scaffold.mjs <theme-name> --teardown                           # remove all trace
 *
 * The new palette is written with an obvious UNFILLED placeholder (#FF00FF magenta) for every
 * stepped color, never the template's real hex values — so nothing can silently leak in, and an
 * unfinished theme renders screaming magenta in the preview instead of looking "close enough."
 * The universal singletons (black/white/transparent) get their natural values since they're not
 * per-theme design decisions.
 */

import { readFileSync, writeFileSync, copyFileSync, existsSync, rmSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const PLACEHOLDER = '#FF00FF' // "unfilled" — magenta screams in the preview until real colors land

// packages/skills/theme-creation/scripts/scaffold.mjs -> packages/design-tokens
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const PKG = join(SCRIPT_DIR, '..', '..', '..', 'design-tokens')
const THEMES_DIR = join(PKG, 'themes')
const ALIAS_DIR = join(PKG, 'tokens', 'alias', 'color')
const MANIFEST = join(ALIAS_DIR, '_manifest.json')

const args = process.argv.slice(2)
const name = args.find((a) => !a.startsWith('--'))
const flag = (f) => args.includes(f)
const opt = (f, d) => {
  const i = args.indexOf(f)
  return i >= 0 && args[i + 1] ? args[i + 1] : d
}

if (!name) {
  console.error('Usage: node scaffold.mjs <theme-name> [--from konnect-day|konnect-night] [--teardown] [--inventory]')
  process.exit(1)
}

const themeFile = join(THEMES_DIR, `${name}.theme.json`)
const aliasFile = join(ALIAS_DIR, `${name}.alias.json`)

/**
 * Tokens whose $value carries a LITERAL color (not a {color.alias.*} reference) — composite
 * shadow / focus-ring / overlay values with a hex or numeric rgb()/rgba() baked in. These are
 * copied verbatim from the template, so any literal that isn't white/black/transparent points at
 * the *template's* neutral, not the new palette — and the build's off-source-color guard rejects
 * it. Surfacing them here turns a mid-build failure into an upfront decision: re-express each
 * against the new theme's own palette as part of the shadows/elevation spec section.
 */
function findLiteralColorTokens(tokens) {
  const literal = /#[0-9a-fA-F]{3,8}\b|rgba?\(\s*\d/
  const universal = /rgba?\(\s*255\s*,\s*255\s*,\s*255|rgba?\(\s*0\s*,\s*0\s*,\s*0|#fff(fff)?\b|#000(000)?\b/i
  const hits = []
  for (const [key, def] of Object.entries(tokens)) {
    const val = String(def.$value ?? '')
    if (val.includes('{color.alias')) continue
    if (literal.test(val) && !(universal.test(val) && !/#(?!fff|000)[0-9a-fA-F]{3,6}\b/i.test(val))) {
      // flag anything with a non-white/black literal color
      const stripped = val.replace(/rgba?\(\s*255[^)]*\)|rgba?\(\s*0\s*,\s*0\s*,\s*0[^)]*\)|#fff(fff)?\b|#000(000)?\b/gi, '')
      if (/#[0-9a-fA-F]{3,8}\b|rgba?\(\s*\d/.test(stripped)) hits.push({ key, value: val })
    }
  }
  return hits
}

/** Group themeable tokens by their component/concept prefix so the spec can reason per-unit. */
function printInventory(themeJsonPath) {
  const tokens = JSON.parse(readFileSync(themeJsonPath, 'utf8'))
  const groups = new Map()
  for (const [key, def] of Object.entries(tokens)) {
    // kui-<group>-... ; group = the segment(s) up to the first "color|border|font|padding|..." property word
    const rest = key.replace(/^kui-/, '')
    const propWords = ['color', 'border', 'font', 'padding', 'shadow', 'size', 'space', 'gap', 'line', 'letter', 'width', 'height', 'radius', 'weight']
    const parts = rest.split('-')
    let cut = parts.length
    for (let i = 0; i < parts.length; i++) {
      if (propWords.includes(parts[i])) {
        cut = i; break
      }
    }
    const group = parts.slice(0, cut).join('-') || parts[0]
    if (!groups.has(group)) groups.set(group, [])
    groups.get(group).push({ key, value: def.$value })
  }
  const sorted = [...groups.entries()].sort((a, b) => b[1].length - a[1].length)
  console.log(`\n=== Token inventory: ${tokens ? Object.keys(tokens).length : 0} themeable tokens in ${groups.size} groups ===`)
  console.log('(Use this as the backbone of the Step 3.5 design spec — decide each group as a unit.)\n')
  for (const [group, items] of sorted) {
    console.log(`● ${group} (${items.length})`)
    for (const { key, value } of items) console.log(`    ${key}: ${value}`)
  }

  const literals = findLiteralColorTokens(tokens)
  if (literals.length) {
    console.log(`\n⚠ ${literals.length} tokens carry LITERAL colors inherited from the template (not {color.alias} refs).`)
    console.log('  Re-express each against your new palette (part of the shadows/elevation spec section), or')
    console.log('  the off-source-color guard will reject the build. Distinct source colors to replace:')
    const distinct = new Set()
    for (const { value } of literals) {
      for (const m of value.matchAll(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)/g)) distinct.add(m[0])
    }
    for (const d of [...distinct].sort()) console.log(`    ${d}`)
    console.log('  Tokens:')
    for (const { key, value } of literals) console.log(`    ${key}: ${value}`)
  }
}

// ---- teardown ---------------------------------------------------------------
if (flag('--teardown')) {
  for (const f of [themeFile, aliasFile]) if (existsSync(f)) {
    rmSync(f); console.log(`removed ${f}`)
  }
  // stale compiled output (dist/ is gitignored but build:tokens doesn't clean orphans)
  const distThemes = join(PKG, 'dist', 'themes')
  if (existsSync(distThemes)) {
    for (const f of readdirSync(distThemes)) {
      if (f.startsWith(`${name}.`)) {
        rmSync(join(distThemes, f)); console.log(`removed dist/themes/${f}`)
      }
    }
  }
  // No spec edit to revert: removing the two files above drops the theme from the derived
  // exhaustive set automatically (themes.spec.mjs classifies by directory contents).
  console.log('\nTeardown complete. Run `pnpm --filter @kong/design-tokens test` and `git status` to confirm zero residue.')
  process.exit(0)
}

// ---- inventory-only ---------------------------------------------------------
if (flag('--inventory')) {
  if (!existsSync(themeFile)) {
    console.error(`${themeFile} does not exist — scaffold it first.`); process.exit(1)
  }
  printInventory(themeFile)
  process.exit(0)
}

// ---- create -----------------------------------------------------------------
const from = opt('--from', 'konnect-day')
const fromTheme = join(THEMES_DIR, `${from}.theme.json`)
if (!existsSync(fromTheme)) {
  console.error(`Template ${fromTheme} not found. Use --from konnect-day or konnect-night.`); process.exit(1)
}
if (existsSync(themeFile)) {
  console.error(`${themeFile} already exists — pick a different name or --teardown first.`); process.exit(1)
}

// 1. theme.json: copy the exhaustive structural template verbatim (relationships/re-points are
//    reused deliberately; the taste work happens by editing values against the spec).
copyFileSync(fromTheme, themeFile)
console.log(`created themes/${name}.theme.json  (structure from ${from}, values are yours to set)`)

// 2. alias.json: generate fresh from the names-only manifest with UNFILLED placeholders, so no
//    real palette value is ever inherited from the template. Serialize directly from the
//    manifest's ordered arrays rather than via a plain object + JSON.stringify: JS reorders
//    integer-like keys ("10","20"…"100") ahead of the non-integer "05", which would emit steps
//    out of order and fail the repo's `jsonc/sort-keys` lint (natural ascending). The manifest's
//    family keys and step arrays are already in the natural order the linter wants.
const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8')).color.alias
const singletons = { black: '#000000', white: '#FFFFFF', transparent: 'transparent' }
const I = (n) => '  '.repeat(n)
const leaf = (v, depth) =>
  `{\n${I(depth + 1)}"$description": "Alias for ${v}.",\n${I(depth + 1)}"$value": ${JSON.stringify(v)}\n${I(depth)}}`
const families = Object.keys(manifest).map((family) => {
  if (family in singletons) return `${I(3)}${JSON.stringify(family)}: ${leaf(singletons[family], 3)}`
  const steps = manifest[family].map((step) => `${I(4)}${JSON.stringify(step)}: ${leaf(PLACEHOLDER, 4)}`).join(',\n')
  return `${I(3)}${JSON.stringify(family)}: {\n${steps}\n${I(3)}}`
}).join(',\n')
const aliasJson = `{\n${I(1)}"color": {\n${I(2)}"$type": "color",\n${I(2)}"alias": {\n${families}\n${I(2)}}\n${I(1)}}\n}\n`
writeFileSync(aliasFile, aliasJson)
console.log(`created tokens/alias/color/${name}.alias.json  (every step = ${PLACEHOLDER} until you fill it)`)

// No classification step needed: themes.spec.mjs treats every theme in themes/ as exhaustive by
// default (only classic-day/classic-night are opted out as semantic-only), so this new theme is
// covered by the exhaustive drift guard automatically — the skill never edits that file.

// inventory
printInventory(themeFile)

console.log(`\nNext: fill ${name}.alias.json with the real palette from your Step 3.5 spec, adjust`)
console.log('theme.json literals (radius/shadow/font/padding/etc.) per the spec, then build + preview.')
