#!/usr/bin/env node
/**
 * One-time migration importer for the per-theme color alias refactor.
 *
 * Transforms the figma alias exports (`_temp_source/aliases-konnect-{day,night}.json`)
 * into the standardized design-tokens alias system:
 *   1. `tokens/alias/color/_manifest.json`        — names-only canonical key set.
 *   2. `tokens/alias/color/konnect-day.json`      — full standardized palette, figma-day values.
 *   3. `tokens/alias/color/konnect-night.json`    — full standardized palette, figma-night values.
 *   4. `tokens/alias/color/classic-day.json`      — existing entries preserved, net-new carrier
 *                                                   keys appended at figma-day values.
 *   5. `themes/konnect-day.json`                  — every `{color.alias.*}` ref re-pointed to the
 *                                                   standardized step holding the same value (lossless).
 *   6. `themes/konnect-night.json`                — same; refs whose value is off the standardized
 *                                                   night palette are SNAPPED to the nearest COLOR in
 *                                                   the same family (the token adopts that step's value).
 *
 * Every aliased color resolves to a real step in the theme's own alias file — no raw color literals
 * remain. Re-pointing reads only `_temp_source/` + the recovered `/tmp/old-index.json` (no dist needed).
 *
 * SAFETY: this is a ONE-TIME migration tool. It re-points FROM the original index-based theme refs,
 * so it must run against PRISTINE (HEAD) `themes/konnect-*.json` — re-running it on already-migrated
 * themes produces garbage (it is not idempotent). `git checkout` the theme files first if re-running.
 *
 * Usage: node scripts/import-figma-aliases.mjs            (dry-run: report only, write nothing)
 *        node scripts/import-figma-aliases.mjs --write    (apply)
 *
 * See ALIAS-COLOR-MAPPING-GUIDE.md.
 */

import { readFile, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const p = (...a) => join(ROOT, ...a)
const WRITE = process.argv.includes('--write')

// ── helpers ─────────────────────────────────────────────────────────────────

/** Normalize a color for equality: lowercase, expand `#abc`→`#aabbcc`. */
function normColor(v) {
  if (typeof v !== 'string') return v
  const s = v.trim()
  const m = s.match(/^#([0-9a-fA-F]{3})$/)
  if (m) {
    const c = m[1].toLowerCase(); return `#${c[0]}${c[0]}${c[1]}${c[1]}${c[2]}${c[2]}`
  }
  return s.toLowerCase()
}

/** Is this a color value (hex / rgb(a) / transparent)? */
function isColor(v) {
  return typeof v === 'string' && (/^#[0-9a-fA-F]{3,8}$/.test(v.trim()) || /^rgba?\(/i.test(v.trim()) || v.trim() === 'transparent')
}

/** Normalize a figma family/group label to our key form (`Electric lime` → `electric_lime`). */
function normFamily(name) {
  return name.toLowerCase().replace(/electric[\s_-]*lime/i, 'electric_lime').replace(/[\s-]+/g, '_')
}

const pushMap = (m, k, v) => {
  if (!m.has(k)) m.set(k, []); m.get(k).push(v)
}

/** Serialize an object exactly like the repo: top-level keys sorted, 2-space, trailing newline. */
function serializeSorted(obj) {
  return JSON.stringify(obj, null, 2) + '\n'
}

/**
 * Parse a figma export into { families: { fam: { step: HEX } }, singletons: { name: HEX } }.
 * Hex is taken verbatim (figma uppercase 6-digit) from `$value.hex`.
 */
function parseFigma(figma) {
  const root = figma.Aliases ?? figma
  const families = {}
  const singletons = {}
  const walk = (node, path) => {
    if (node && node.$value && typeof node.$value === 'object' && typeof node.$value.hex === 'string') {
      const leaf = path[path.length - 1]
      const m = leaf.match(/^(.*)-(\d+)$/)
      if (m) {
        const fam = normFamily(m[1])
        ;(families[fam] ??= {})[m[2]] = node.$value.hex
      } else {
        singletons[normFamily(leaf)] = node.$value.hex
      }
      return
    }
    if (node && typeof node === 'object') {
      for (const [k, v] of Object.entries(node)) if (!k.startsWith('$')) walk(v, [...path, k])
    }
  }
  walk(root, [])
  return { families, singletons }
}

/** Build a palette file object (classic.json schema) from a parsed figma palette. */
function buildPalette({ families, singletons }) {
  const alias = {}
  for (const [name, hex] of Object.entries(singletons)) {
    alias[name] = { $description: `Alias for ${hex}.`, $type: 'color', $value: hex }
  }
  // transparent is net-new (figma has none) but the themes reference it — matches classic.json shape (no $type).
  alias.transparent = { $description: 'Alias for transparent.', $value: 'transparent' }
  for (const fam of Object.keys(families)) {
    const steps = {}
    for (const step of Object.keys(families[fam]).sort((a, b) => Number(a) - Number(b))) {
      const hex = families[fam][step]
      steps[step] = { $description: `Alias for ${hex}.`, $type: 'color', $value: hex }
    }
    alias[fam] = steps
  }
  const sorted = {}
  for (const k of Object.keys(alias).sort()) sorted[k] = alias[k]
  return { color: { alias: sorted } }
}

/** Build the names-only manifest: singletons → null, scaled families → ascending step-name array. */
function buildManifest(parsedThemes) {
  // Union families/steps across all themes (day & night share the same key set).
  const families = {}
  const singletons = new Set()
  for (const { families: f, singletons: s } of parsedThemes) {
    for (const name of Object.keys(s)) singletons.add(name)
    for (const fam of Object.keys(f)) {
      families[fam] ??= new Set()
      for (const step of Object.keys(f[fam])) families[fam].add(step)
    }
  }
  const alias = {}
  for (const name of singletons) alias[name] = []
  alias.transparent = []
  for (const fam of Object.keys(families)) {
    alias[fam] = [...families[fam]].sort((a, b) => Number(a) - Number(b))
  }
  const sorted = {}
  for (const k of Object.keys(alias).sort()) sorted[k] = alias[k]
  return { $comment: MANIFEST_COMMENT, color: { alias: sorted } }
}

/** In-file usage note emitted at the top of `_manifest.json` (ignored by the drift guard / fill). */
const MANIFEST_COMMENT =
  'NAMES-ONLY canonical color-alias key set. Every palette in tokens/alias/color/ must contain ' +
  'EXACTLY these leaves (enforced by the drift guard in themes.spec.mjs). `[]` = a single ' +
  'direct-value alias (no steps, e.g. white); a non-empty array lists step names. Values live in ' +
  'the per-theme palette files, NEVER here. To add a step or group: add it here AND to every ' +
  'palette with that theme’s value. See ALIAS-COLOR-MAPPING-GUIDE.md.'

/**
 * Additively expand `classic` with any keys present in `dayPalette` but missing from classic.
 * Existing classic entries are preserved by reference (never reassigned). Net-new keys take the
 * figma-day value. Returns { palette, added }.
 */
function expandClassic(classicObj, dayPalette) {
  const alias = structuredClone(classicObj.color.alias)
  const dayAlias = dayPalette.color.alias
  const added = []
  for (const key of Object.keys(dayAlias)) {
    const dayNode = dayAlias[key]
    const isSingleton = dayNode.$value !== undefined
    if (!(key in alias)) {
      alias[key] = dayNode
      if (isSingleton) added.push(key)
      else added.push(...Object.keys(dayNode).map(s => `${key}.${s}`))
      continue
    }
    if (!isSingleton) {
      for (const step of Object.keys(dayNode)) {
        if (!(step in alias[key])) {
          alias[key][step] = dayNode[step]; added.push(`${key}.${step}`)
        }
      }
    }
  }
  // Re-sort families + steps (classic is already fully sorted, so existing lines stay byte-identical
  // and the only diff is the inserted carrier keys in their correct sorted positions).
  const sorted = {}
  for (const k of Object.keys(alias).sort()) {
    const node = alias[k]
    if (node && node.$value === undefined) {
      const steps = {}
      for (const s of Object.keys(node).sort((a, b) => Number(a) - Number(b))) steps[s] = node[s]
      sorted[k] = steps
    } else sorted[k] = node
  }
  return { palette: { color: { alias: sorted } }, added: added.sort() }
}

/** Squared RGB distance between two hex colors (for nearest-color snapping). */
function colorDist(a, b) {
  const rgb = h => {
    const n = normColor(h); return [1, 3, 5].map(i => parseInt(n.slice(i, i + 2), 16))
  }
  const [r1, g1, b1] = rgb(a)
  const [r2, g2, b2] = rgb(b)
  return (r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2
}

/**
 * Build snapping helpers from a palette:
 *   - reverseMap: normalized value → [step labels] (for exact, value-preserving matches);
 *   - nearestStepInFamily(family, value): the step in `family` whose value is closest BY COLOR to
 *     `value` (for off-palette values — snap by nearest color, NOT by step number, so the rendered
 *     result stays as close as the standardized palette allows and fewer distinct shades collapse).
 */
function buildSnapper(palette) {
  const reverseMap = new Map()
  const famVals = {} // family → [[step, normValue]]
  for (const [key, node] of Object.entries(palette.color.alias)) {
    if (node.$value !== undefined) {
      if (isColor(node.$value)) pushMap(reverseMap, normColor(node.$value), key)
    } else {
      for (const step of Object.keys(node)) {
        const nv = normColor(node[step].$value)
        pushMap(reverseMap, nv, `${key}.${step}`)
        ;(famVals[key] ??= []).push([step, nv])
      }
    }
  }
  const nearestStepInFamily = (family, value) => {
    const arr = famVals[family]
    if (!arr || value === undefined) return null
    let best = null
    let bd = Infinity
    for (const [step, val] of arr) {
      const d = colorDist(value, val)
      if (d < bd) {
        bd = d; best = step
      }
    }
    return best
  }
  return { reverseMap, nearestStepInFamily }
}

/**
 * Composite tokens whose color is authored as a literal (not a `{color.alias.*}` ref), so the main
 * re-pointer can't see it. We re-point the embedded color to the nearest alias in the family that
 * classic.json uses for the same token (mirroring classic's composition). `rgba: true` keeps the raw
 * `rgba()` form (like classic) but rewrites its base to the nearest source value.
 */
const COMPOSITE_REPOINTS = {
  'kui-shadow-border-disabled': { family: 'gray' }, // classic: {color.alias.gray.20}
  'kui-navigation-shadow-border-child': { family: 'green' }, // classic: {color.alias.green.30}
  'kui-color-background-overlay': { family: 'gray', rgba: true }, // classic: raw rgba (blue.100 base)
}

/** Re-point a composite token's literal color: box-shadow → alias ref; rgba → source-base rgba. */
function repointComposite(value, comp, nearestStepInFamily, palette) {
  if (comp.rgba) {
    return value.replace(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(\s*,\s*[\d.]+)?\)/i, (full, r, g, b, a) => {
      const hex = '#' + [r, g, b].map(x => Number(x).toString(16).padStart(2, '0')).join('')
      const step = nearestStepInFamily(comp.family, normColor(hex))
      if (!step) return full
      const [nr, ng, nb] = [1, 3, 5].map(i => parseInt(normColor(palette.color.alias[comp.family][step].$value).slice(i, i + 2), 16))
      return `rgba(${nr}, ${ng}, ${nb}${a || ', 1'})`
    })
  }
  return value.replace(/#[0-9a-fA-F]{6}\b/, (hex) => {
    const step = nearestStepInFamily(comp.family, normColor(hex))
    return step ? `{color.alias.${comp.family}.${step}}` : hex
  })
}

/**
 * Re-point EVERY `{color.alias.*}` reference in a theme — whole-value refs AND refs embedded in
 * composite values (e.g. `box-shadow` strings) — to a real step in the theme's OWN alias palette.
 *
 * Each ref is mapped by its PRE-REFACTOR concrete value (`oldValueOf`):
 *   - exact match in this theme's palette → reference it (value-preserving);
 *   - otherwise (an off-palette leftover from the old shared index) → snap to the NEAREST COLOR in
 *     the same family, so the rendered shade stays as close as the standardized palette allows.
 * Composite tokens authored with a literal color (COMPOSITE_REPOINTS) get their embedded color
 * re-pointed too. Non-color values (px/font) are untouched. No raw color literals remain.
 */
function repoint(themeObj, palette, oldValueOf) {
  const { reverseMap, nearestStepInFamily } = buildSnapper(palette)
  const result = {}
  const snapped = []
  let changed = 0
  const REF = /\{color\.alias\.([a-z_]+(?:\.\d+)?)\}/g
  for (const [name, entry] of Object.entries(themeObj)) {
    let v = entry.$value
    if (typeof v === 'string') {
      if (v.includes('{color.alias.')) {
        v = v.replace(REF, (full, ref) => {
          const [family, step] = ref.split('.')
          const val = oldValueOf(ref)
          const candidates = val !== undefined ? reverseMap.get(normColor(val)) : undefined
          if (candidates && candidates.length) {
            return `{color.alias.${candidates.find(c => c.split('.')[0] === family) ?? candidates[0]}}`
          }
          if (step) {
            const ns = nearestStepInFamily(family, normColor(val))
            if (!ns) return full
            snapped.push({ name, from: ref, to: `${family}.${ns}` })
            return `{color.alias.${family}.${ns}}`
          }
          return full
        })
      }
      const comp = COMPOSITE_REPOINTS[name]
      if (comp) v = repointComposite(v, comp, nearestStepInFamily, palette)
    }
    if (v !== entry.$value) changed++
    result[name] = v === entry.$value ? entry : { ...entry, $value: v }
  }
  // Serialize the same way as serializeTheme: top-level keys sorted.
  const sorted = {}
  for (const k of Object.keys(result).sort()) sorted[k] = result[k]
  return { theme: sorted, snapped, changed }
}

// ── main ────────────────────────────────────────────────────────────────────

const figmaDay = parseFigma(JSON.parse(await readFile(p('_temp_source', 'aliases-konnect-day.json'), 'utf-8')))
const figmaNight = parseFigma(JSON.parse(await readFile(p('_temp_source', 'aliases-konnect-night.json'), 'utf-8')))

const dayPalette = buildPalette(figmaDay)
const nightPalette = buildPalette(figmaNight)
const manifest = buildManifest([figmaDay, figmaNight])

const classicObj = JSON.parse(await readFile(p('tokens', 'alias', 'color', 'classic-day.json'), 'utf-8'))
const { palette: classicExpanded, added: classicAdded } = expandClassic(classicObj, dayPalette)

const themeDay = JSON.parse(await readFile(p('themes', 'konnect-day.json'), 'utf-8'))
const themeNight = JSON.parse(await readFile(p('themes', 'konnect-night.json'), 'utf-8'))

// The pre-refactor index.json (recovered via `git show HEAD:…/index.json > /tmp/old-index.json`)
// resolves each original ref — whole or embedded — to its concrete value, which the re-pointer maps
// to the standardized step. Run that git command before this script if /tmp/old-index.json is absent.
const oldIndexAlias = JSON.parse(await readFile('/tmp/old-index.json', 'utf-8')).color.alias
const oldValueOf = (step) => {
  const [fam, s] = step.split('.')
  const node = s ? oldIndexAlias?.[fam]?.[s] : oldIndexAlias?.[fam]
  return node?.$value
}

const dayResult = repoint(themeDay, dayPalette, oldValueOf)
const nightResult = repoint(themeNight, nightPalette, oldValueOf)

// ── report ──────────────────────────────────────────────────────────────────
const manifestKeys = Object.entries(manifest.color.alias)
  .reduce((n, [, v]) => n + (Array.isArray(v) && v.length ? v.length : 1), 0)
console.log(`manifest: ${Object.keys(manifest.color.alias).length} groups, ${manifestKeys} total keys`)
console.log(`classic carriers added (${classicAdded.length}): ${classicAdded.join(', ')}`)
console.log(`konnect-day refs re-pointed: ${dayResult.changed} changed, ${dayResult.snapped.length} snapped (expect 0)`)
console.log(`konnect-night refs re-pointed: ${nightResult.changed} changed, ${nightResult.snapped.length} snapped to nearest standard step:`)
const nightSnaps = {}
for (const s of nightResult.snapped) {
  const k = `${s.from} -> ${s.to}`; nightSnaps[k] = (nightSnaps[k] ?? 0) + 1
}
for (const [k, n] of Object.entries(nightSnaps).sort((a, b) => b[1] - a[1])) console.log(`   ${k}  ×${n}`)

if (!WRITE) {
  console.log('\n(dry-run — no files written; pass --write to apply)')
  process.exit(0)
}

await writeFile(p('tokens', 'alias', 'color', '_manifest.json'), serializeSorted(manifest))
await writeFile(p('tokens', 'alias', 'color', 'konnect-day.json'), serializeSorted(dayPalette))
await writeFile(p('tokens', 'alias', 'color', 'konnect-night.json'), serializeSorted(nightPalette))
await writeFile(p('tokens', 'alias', 'color', 'classic-day.json'), serializeSorted(classicExpanded))
await writeFile(p('themes', 'konnect-day.json'), serializeSorted(dayResult.theme))
await writeFile(p('themes', 'konnect-night.json'), serializeSorted(nightResult.theme))
console.log('\nWrote palette files, manifest, expanded classic, and re-pointed themes.')
