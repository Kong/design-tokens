import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { readFile, writeFile, mkdir, mkdtemp, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  buildSemanticTokenDefaults,
  buildComponentTokenSlots,
  buildThemeDocument,
  groupTokensByComponent,
  resolveNonAliasReference,
  scaffoldTheme,
  teardownTheme,
} from './theme-scaffold.mjs'
import { manifestLeaves, paletteLeaves } from './alias-manifest.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

describe('resolveNonAliasReference (pure)', () => {
  it('returns a literal value unchanged', () => {
    expect(resolveNonAliasReference('16px', new Map())).toBe('16px')
  })

  it('preserves a bare {color.alias.*} reference unresolved', () => {
    expect(resolveNonAliasReference('{color.alias.red.60}', new Map())).toBe('{color.alias.red.60}')
  })

  it('leaves an embedded (non-bare) reference untouched, even a color.alias one inside a larger string', () => {
    const value = '0px 0px 0px 1px {color.alias.gray.20} inset'
    expect(resolveNonAliasReference(value, new Map())).toBe(value)
  })

  it('resolves a bare non-alias reference to its target literal', () => {
    const lookup = new Map([['font.family.text', { $value: "'Inter', sans-serif" }]])
    expect(resolveNonAliasReference('{font.family.text}', lookup)).toBe("'Inter', sans-serif")
  })

  it('follows a chain of references to the final literal', () => {
    const lookup = new Map([
      ['a', { $value: '{b}' }],
      ['b', { $value: 'final' }],
    ])
    expect(resolveNonAliasReference('{a}', lookup)).toBe('final')
  })

  it('throws on a reference that cannot be found', () => {
    expect(() => resolveNonAliasReference('{nowhere.token}', new Map())).toThrow(/could not be resolved/)
  })

  it('throws on a circular reference instead of looping forever', () => {
    const lookup = new Map([
      ['a', { $value: '{b}' }],
      ['b', { $value: '{a}' }],
    ])
    expect(() => resolveNonAliasReference('{a}', lookup)).toThrow(/circular/i)
  })
})

describe('buildSemanticTokenDefaults', () => {
  it('reads the real default alias mapping from tokens/source', async () => {
    const defaults = await buildSemanticTokenDefaults()
    expect(defaults.get('kui-color-background')).toEqual(
      expect.objectContaining({ value: '{color.alias.white}' }),
    )
  })

  it('excludes build-injected breakpoint tokens', async () => {
    const defaults = await buildSemanticTokenDefaults()
    const breakpointNames = [...defaults.keys()].filter(name => name.startsWith('kui-breakpoint-'))
    expect(breakpointNames).toEqual([])
  })

  it('preserves {color.alias.*} references unresolved (the per-theme build resolves those against its own palette)', async () => {
    const defaults = await buildSemanticTokenDefaults()
    expect(defaults.get('kui-color-background-primary').value).toMatch(/^\{color\.alias\./)
  })

  it('resolves a non-color-alias cross-reference to its literal value — per-theme builds only include the palette, not the rest of tokens/source, so a bare {font.family.text}-style reference would otherwise fail to resolve', async () => {
    const defaults = await buildSemanticTokenDefaults()
    // Source: tokens/source/font/family.json defines `heading: { $value: "{font.family.text}" }`.
    expect(defaults.get('kui-font-family-heading').value).toBe("'Inter', Roboto, Helvetica, sans-serif")
    // Source: tokens/source/letter-spacing/index.json defines `0: { $value: "{letter_spacing.normal}" }`.
    expect(defaults.get('kui-letter-spacing-0').value).toBe('normal')
  })
})

describe('buildComponentTokenSlots', () => {
  it('reads component token names as empty slots, regardless of source value', async () => {
    const slots = await buildComponentTokenSlots()
    expect(slots.get('kui-button-color-background-primary')).toEqual(
      expect.objectContaining({ value: '' }),
    )
  })

  it('never contains a theme-specific or placeholder color value', async () => {
    const slots = await buildComponentTokenSlots()
    for (const { value } of slots.values()) {
      expect(value).toBe('')
    }
  })

  it('shares no name with a semantic token — a collision would silently drop the semantic default, since buildThemeDocument/reconcileTheme both merge component entries in after semantic ones', async () => {
    const [semanticDefaults, componentSlots] = await Promise.all([
      buildSemanticTokenDefaults(),
      buildComponentTokenSlots(),
    ])
    const collisions = [...componentSlots.keys()].filter(name => semanticDefaults.has(name))
    expect(collisions).toEqual([])
  })
})

describe('buildThemeDocument', () => {
  it('merges semantic defaults and component slots into one flat token map', () => {
    const semantic = new Map([['kui-color-background', { value: '{color.alias.white}', description: 'BG.' }]])
    const components = new Map([['kui-button-color-background-primary', { value: '', description: 'Button BG.' }]])
    const doc = buildThemeDocument(semantic, components)
    expect(doc).toEqual({
      'kui-color-background': { $value: '{color.alias.white}', $description: 'BG.' },
      'kui-button-color-background-primary': { $value: '', $description: 'Button BG.' },
    })
  })

  it('never emits the #FF00FF placeholder or any literal color', () => {
    const semantic = new Map([['kui-color-background', { value: '{color.alias.white}' }]])
    const doc = buildThemeDocument(semantic, new Map())
    expect(JSON.stringify(doc)).not.toMatch(/FF00FF/i)
  })

  it('sorts keys numerically-aware ("-2" before "-10"), not lexicographically ("-10" before "-2")', () => {
    // Plain string sort would put "kui-space-10" before "kui-space-2" (comparing "1" < "2"
    // character-by-character); the repo's actual token files rely on natural sort instead.
    const semantic = new Map([
      ['kui-space-10', { value: '10px' }],
      ['kui-space-2', { value: '2px' }],
      ['kui-space-1', { value: '1px' }],
    ])
    expect(Object.keys(buildThemeDocument(semantic, new Map()))).toEqual([
      'kui-space-1', 'kui-space-2', 'kui-space-10',
    ])
  })
})

describe('groupTokensByComponent', () => {
  it('groups tokens by the component/concept prefix, largest group first', () => {
    const theme = {
      'kui-button-color-background-primary': { $value: '' },
      'kui-button-border-radius-medium': { $value: '' },
      'kui-alert-color-background-danger': { $value: '{color.alias.red.10}' },
    }
    const groups = groupTokensByComponent(theme)
    expect(groups[0]).toEqual({
      group: 'button',
      tokens: [
        { name: 'kui-button-border-radius-medium', value: '' },
        { name: 'kui-button-color-background-primary', value: '' },
      ],
    })
    expect(groups[1].group).toBe('alert')
  })

  it('groups a base semantic token (whose first segment is itself a property word) under that word', () => {
    const theme = { 'kui-color-background': { $value: '{color.alias.white}' } }
    expect(groupTokensByComponent(theme)).toEqual([
      { group: 'color', tokens: [{ name: 'kui-color-background', value: '{color.alias.white}' }] },
    ])
  })

  it('groups a token with NO property word anywhere in its name under its own full name', () => {
    // Neither "animation" nor "duration" is a property word, so this never hits the `cut !== -1`
    // branch — regression coverage for the `cut === -1 ? parts.length : ...` fallback specifically.
    const theme = { 'kui-animation-duration-20': { $value: '0.2s' } }
    expect(groupTokensByComponent(theme)).toEqual([
      { group: 'animation-duration-20', tokens: [{ name: 'kui-animation-duration-20', value: '0.2s' }] },
    ])
  })
})

describe('scaffoldTheme (writes to an isolated temp dir — never the real themes/ tree)', () => {
  let tmpThemesRoot

  beforeAll(async () => {
    tmpThemesRoot = await mkdtemp(join(tmpdir(), 'theme-scaffold-test-'))
  })

  afterAll(async () => {
    await rm(tmpThemesRoot, { recursive: true, force: true })
  })

  it('creates a theme directory with a co-located theme.json and alias.color.json', async () => {
    await scaffoldTheme('demo-brand', { themesRoot: tmpThemesRoot })
    expect(existsSync(join(tmpThemesRoot, 'demo-brand', 'demo-brand.theme.json'))).toBe(true)
    expect(existsSync(join(tmpThemesRoot, 'demo-brand', 'demo-brand.alias.color.json'))).toBe(true)
  })

  it('produces a theme that is exhaustive by construction (matches KUI_THEMEABLE_TOKENS minus breakpoints)', async () => {
    const dist = await import(join(ROOT, 'dist', 'tokens', 'themeable-tokens', 'index.mjs'))
    const expected = new Set(
      dist.KUI_THEMEABLE_TOKENS.map(t => t.name.slice(2)).filter(n => !n.startsWith('kui-breakpoint-')),
    )
    const theme = JSON.parse(await readFile(join(tmpThemesRoot, 'demo-brand', 'demo-brand.theme.json'), 'utf-8'))
    const actual = new Set(Object.keys(theme))
    expect([...expected].filter(k => !actual.has(k)).sort()).toEqual([])
    expect([...actual].filter(k => !expected.has(k)).sort()).toEqual([])
  })

  it('seeds the palette from classic-day (no #FF00FF, satisfies the manifest + $description guards)', async () => {
    const manifest = JSON.parse(await readFile(join(ROOT, 'themes', '_manifest.alias.color.json'), 'utf-8'))
    const palette = JSON.parse(await readFile(join(tmpThemesRoot, 'demo-brand', 'demo-brand.alias.color.json'), 'utf-8'))
    const expected = manifestLeaves(manifest)
    const actual = paletteLeaves(palette)
    expect([...expected].filter(k => !actual.has(k))).toEqual([])
    expect([...actual].filter(k => !expected.has(k))).toEqual([])
    expect(JSON.stringify(palette)).not.toMatch(/FF00FF/i)

    const stale = []
    const walk = (node) => {
      if (node && typeof node === 'object' && node.$value !== undefined) {
        if (node.$description !== `Alias for ${node.$value}.`) stale.push(node)
        return
      }
      if (node && typeof node === 'object') for (const child of Object.values(node)) walk(child)
    }
    walk(palette.color.alias)
    expect(stale).toEqual([])
  })

  it('copies the seed palette byte-for-byte — not just the right key order, the exact same file', async () => {
    // JSON.parse + JSON.stringify silently reorders integer-like keys ("10".."100") ahead of "05"
    // (which has a leading zero, so JS doesn't treat it as an integer index) — a real regression
    // caught here: scaffoldTheme must copy the seed file's raw text, never round-trip it through a
    // parsed JS object, or every scaffolded palette emits steps out of natural order. Asserting full
    // byte-identity (not just one family's key order) also catches a partial-fidelity regression —
    // re-indentation, a normalized line ending, a dropped trailing newline — that a substring-position
    // check alone would miss.
    const seedPaletteFile = join(ROOT, 'themes', 'classic-day', 'classic-day.alias.color.json')
    const [seed, written] = await Promise.all([
      readFile(seedPaletteFile, 'utf-8'),
      readFile(join(tmpThemesRoot, 'demo-brand', 'demo-brand.alias.color.json'), 'utf-8'),
    ])
    expect(written).toBe(seed)
  })

  it('refuses to overwrite an existing theme directory', async () => {
    await expect(scaffoldTheme('demo-brand', { themesRoot: tmpThemesRoot })).rejects.toThrow(/already exists/i)
  })

  it('rejects a non-kebab-case theme name', async () => {
    await expect(scaffoldTheme('DemoBrand', { themesRoot: tmpThemesRoot })).rejects.toThrow(/kebab-case/i)
  })

  it('rejects a name with a digit right after a hyphen (e.g. "brand-2") — toExportName cannot camelCase it, so it would generate invalid JS in dist/themes/index.mjs', async () => {
    // toExportName (platforms/themes.mjs) only uppercases a hyphen followed by a LETTER
    // (`-([a-z])`); "brand-2" survives untouched as an export name, which is a JS syntax
    // error in `export const brand-2 = {...}`. The validator must reject what the export-name
    // deriver can't safely convert, not just anything that superficially "looks" kebab-case.
    await expect(scaffoldTheme('brand-2', { themesRoot: tmpThemesRoot })).rejects.toThrow(/kebab-case/i)
  })
})

describe('teardownTheme (standalone workflow — leaves the repo exactly as it started)', () => {
  let themesRoot
  let distThemesDir

  beforeAll(async () => {
    themesRoot = await mkdtemp(join(tmpdir(), 'theme-teardown-test-'))
    distThemesDir = await mkdtemp(join(tmpdir(), 'theme-teardown-dist-'))
  })

  afterAll(async () => {
    await rm(themesRoot, { recursive: true, force: true })
    await rm(distThemesDir, { recursive: true, force: true })
  })

  it('removes the theme directory and every dist/themes/<name>.* build artifact, and nothing else', async () => {
    await scaffoldTheme('throwaway', { themesRoot })
    await mkdir(distThemesDir, { recursive: true })
    for (const file of ['throwaway.css', 'throwaway.mjs', 'throwaway.d.ts']) {
      await writeFile(join(distThemesDir, file), '/* built */', 'utf-8')
    }
    await writeFile(join(distThemesDir, 'index.mjs'), '/* shared barrel — must survive */', 'utf-8')
    await writeFile(join(distThemesDir, 'unrelated-theme.css'), '/* must survive */', 'utf-8')

    const { removed } = await teardownTheme('throwaway', { themesRoot, distThemesDir })

    expect(existsSync(join(themesRoot, 'throwaway'))).toBe(false)
    expect(existsSync(join(distThemesDir, 'throwaway.css'))).toBe(false)
    expect(existsSync(join(distThemesDir, 'throwaway.mjs'))).toBe(false)
    expect(existsSync(join(distThemesDir, 'throwaway.d.ts'))).toBe(false)
    expect(existsSync(join(distThemesDir, 'index.mjs'))).toBe(true)
    expect(existsSync(join(distThemesDir, 'unrelated-theme.css'))).toBe(true)
    expect(removed.length).toBe(4) // theme dir + 3 dist files
  })

  it('is a safe no-op when the theme was never scaffolded', async () => {
    const { removed } = await teardownTheme('never-existed', { themesRoot, distThemesDir })
    expect(removed).toEqual([])
  })

  it('is a safe no-op when dist/themes itself does not exist yet (e.g. before any build)', async () => {
    const neverBuiltDistDir = join(tmpdir(), 'theme-teardown-dist-never-built')
    await scaffoldTheme('another-throwaway', { themesRoot })
    const { removed } = await teardownTheme('another-throwaway', { themesRoot, distThemesDir: neverBuiltDistDir })
    expect(existsSync(join(themesRoot, 'another-throwaway'))).toBe(false)
    expect(removed).toEqual([join(themesRoot, 'another-throwaway')])
  })
})
