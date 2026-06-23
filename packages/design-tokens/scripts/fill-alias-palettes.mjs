#!/usr/bin/env node
/**
 * Additively complete color alias palettes to the canonical `_manifest.json` key set.
 *
 * The manifest defines WHICH alias keys must exist in every palette; this script reports (or fills)
 * any a palette is missing. It is the additive complement to the drift guard in `themes.spec.mjs`.
 *
 * Values are NEVER guessed: a missing key is filled only by copying the corresponding entry from a
 * `--from` source palette (default `classic.json`, the figma-day-aligned default). A key absent from
 * the source is reported as NEEDS MANUAL. Filling a konnect palette should use that theme's own
 * figma-derived source (e.g. `--from konnect-day`), not classic, to avoid importing default values.
 *
 * Usage:
 *   node scripts/fill-alias-palettes.mjs                              # dry-run: report missing per palette
 *   node scripts/fill-alias-palettes.mjs --theme classic --write      # fill classic from classic? (no-op; see --from)
 *   node scripts/fill-alias-palettes.mjs --theme konnect-day --from konnect-day --write
 *
 * See ALIAS-COLOR-MAPPING-GUIDE.md.
 */

import { readFile, writeFile, readdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { manifestLeaves, paletteLeaves } from './alias-manifest.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIR = join(ROOT, 'tokens', 'alias', 'color')
const args = process.argv.slice(2)
const WRITE = args.includes('--write')
const argVal = (flag) => {
  const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : undefined
}

const serialize = (obj) => JSON.stringify(obj, null, 2) + '\n'

/** Required leaf paths from the names-only manifest (`white`, `gray.05`, …). */
const manifest = JSON.parse(await readFile(join(DIR, '_manifest.json'), 'utf-8'))
const requiredLeaves = manifestLeaves(manifest)

/** Re-sort a palette: families alphabetical, steps ascending (matches repo convention). */
const sortPalette = (alias) => {
  const out = {}
  for (const k of Object.keys(alias).sort()) {
    const node = alias[k]
    if (node && node.$value === undefined) {
      const steps = {}
      for (const s of Object.keys(node).sort((a, b) => Number(a) - Number(b))) steps[s] = node[s]
      out[k] = steps
    } else out[k] = node
  }
  return out
}

const fromName = argVal('--from') ?? 'classic'
const fromAlias = JSON.parse(await readFile(join(DIR, `${fromName}.json`), 'utf-8')).color.alias
const entryFrom = (leaf) => {
  const [fam, step] = leaf.split('.')
  return step ? fromAlias?.[fam]?.[step] : fromAlias?.[fam]
}

const onlyTheme = argVal('--theme')
const allFiles = (await readdir(DIR)).filter(f => f.endsWith('.json') && !f.startsWith('_'))
const targets = onlyTheme ? [`${onlyTheme}.json`] : allFiles

for (const file of targets) {
  const name = file.slice(0, -5)
  const pal = JSON.parse(await readFile(join(DIR, file), 'utf-8'))
  const have = paletteLeaves(pal)
  const missing = [...requiredLeaves].filter(l => !have.has(l)).sort()
  if (missing.length === 0) {
    console.log(`${name}: complete (0 missing)`); continue
  }

  const manual = []
  for (const leaf of missing) {
    const entry = name === fromName ? undefined : entryFrom(leaf)
    if (!entry) {
      manual.push(leaf); continue
    }
    const [fam, step] = leaf.split('.')
    if (step) (pal.color.alias[fam] ??= {})[step] = entry
    else pal.color.alias[fam] = entry
  }
  console.log(`${name}: ${missing.length} missing, ${missing.length - manual.length} fillable from ${fromName}, ${manual.length} NEEDS MANUAL`)
  for (const m of manual) console.log(`   MANUAL: ${m}`)

  if (WRITE && missing.length > manual.length) {
    await writeFile(join(DIR, file), serialize({ color: { alias: sortPalette(pal.color.alias) } }))
    console.log(`   wrote ${file}`)
  }
}

if (!WRITE) console.log('\n(dry-run — pass --write to apply)')
