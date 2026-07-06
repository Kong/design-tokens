#!/usr/bin/env node
/**
 * Report what a theme still needs deliberate authoring: component tokens left as empty slots, and
 * palette families that are still byte-identical to the classic-day seed the scaffold started from.
 *
 * Non-blocking by design — an in-progress theme still builds and can publish to the preview npm
 * channel (empty component values resolve to `initial`; a seeded palette is a valid, real palette).
 * This report is a checklist, not a build gate; completion is enforced by review, not automation.
 *
 * Usage: node scripts/themes-unfilled.mjs <theme-name>
 */
import { readFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { buildComponentTokenSlots } from './theme-scaffold.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DEFAULT_THEMES_ROOT = join(__dirname, '..', 'themes')
const DEFAULT_MANIFEST_FILE = join(DEFAULT_THEMES_ROOT, '_manifest.alias.color.json')
const DEFAULT_SEED_PALETTE_FILE = join(DEFAULT_THEMES_ROOT, 'classic-day', 'classic-day.alias.color.json')

/**
 * The stepped color-alias family names in the manifest — excludes direct-value singletons
 * (black/white/transparent), which have no "unfilled" state to report.
 * @param {{ color: { alias: Record<string, string[] | null> } }} manifest
 * @returns {string[]}
 */
function steppedFamilyNames(manifest) {
  return Object.entries(manifest.color.alias)
    .filter(([, steps]) => steps != null && steps.length > 0)
    .map(([family]) => family)
}

/**
 * Component tokens whose value is still the empty-slot placeholder (`$value === ''`).
 * @param {Record<string, { $value: unknown }>} theme
 * @param {Map<string, unknown>} componentSlots - Canonical component-token names (from `theme-scaffold.mjs`).
 * @returns {string[]}
 */
export function findUnfilledComponentSlots(theme, componentSlots) {
  // Iterate the CANONICAL component names, not the theme's own keys — a name entirely missing from
  // the theme isn't "unfilled" (that's an exhaustiveness bug for `themes.spec.mjs`/`themes:sync` to
  // catch), it's just absent. `?.` guards exactly that missing case so it's silently skipped here.
  return [...componentSlots.keys()].filter(name => theme[name]?.$value === '')
}

/**
 * Stepped color-alias families (per the manifest — excludes direct-value singletons like
 * black/white/transparent, whose values are expected to always match the seed) whose values are
 * byte-identical to the seed palette.
 * @param {{ color: { alias: Record<string, unknown> } }} palette
 * @param {{ color: { alias: Record<string, unknown> } }} seedPalette
 * @param {{ color: { alias: Record<string, string[] | null> } }} manifest
 * @returns {string[]}
 */
export function findUnchangedPaletteFamilies(palette, seedPalette, manifest) {
  return steppedFamilyNames(manifest).filter(family => {
    const current = palette.color.alias[family]
    const seed = seedPalette.color.alias[family]
    // Whole-family deep-equality via serialization — good enough here since both sides are
    // small, plain JSON (no key-order sensitivity because the same manifest generates both).
    return JSON.stringify(current) === JSON.stringify(seed)
  })
}

/** Read and parse a JSON file. */
async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf-8'))
}

/**
 * Build the full unfilled report for one theme: empty component slots and palette families still
 * unchanged from the seed.
 * @param {string} name - Theme name.
 * @param {{ themesRoot?: string }} [options]
 */
export async function reportUnfilled(name, options = {}) {
  const themesRoot = options.themesRoot ?? DEFAULT_THEMES_ROOT

  const [theme, palette, manifest, seedPalette, componentSlots] = await Promise.all([
    readJson(join(themesRoot, name, `${name}.theme.json`)),
    readJson(join(themesRoot, name, `${name}.alias.color.json`)),
    readJson(DEFAULT_MANIFEST_FILE),
    readJson(DEFAULT_SEED_PALETTE_FILE),
    buildComponentTokenSlots(),
  ])

  const unfilledComponentSlots = findUnfilledComponentSlots(theme, componentSlots)
  const unchangedPaletteFamilies = findUnchangedPaletteFamilies(palette, seedPalette, manifest)
  const totalPaletteFamilies = steppedFamilyNames(manifest).length

  return {
    name,
    unfilledComponentSlots,
    totalComponentSlots: componentSlots.size,
    unchangedPaletteFamilies,
    totalPaletteFamilies,
  }
}

// ── CLI entry ────────────────────────────────────────────────────────────────

if (import.meta.url === `file://${process.argv[1]}`) {
  const name = process.argv[2]
  if (!name) {
    console.error('Usage: node scripts/themes-unfilled.mjs <theme-name>')
    process.exit(1)
  }
  try {
    const report = await reportUnfilled(name)
    console.log(`${report.name}: ${report.unfilledComponentSlots.length} of ${report.totalComponentSlots} component tokens still empty`)
    if (report.unfilledComponentSlots.length > 0) {
      console.log(`  ${report.unfilledComponentSlots.join(', ')}`)
    }
    console.log(`${report.name}: ${report.unchangedPaletteFamilies.length} of ${report.totalPaletteFamilies} palette families unchanged from the classic-day seed`)
    if (report.unchangedPaletteFamilies.length > 0) {
      console.log(`  ${report.unchangedPaletteFamilies.join(', ')} — intended, or still using the seed?`)
    }
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
}
