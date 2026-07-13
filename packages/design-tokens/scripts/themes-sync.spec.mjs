import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { readFile, writeFile, mkdir, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { reconcileTheme, syncTheme, syncAllThemes } from './themes-sync.mjs'

describe('reconcileTheme (pure)', () => {
  const semanticDefaults = new Map([
    ['kui-color-background', { value: '{color.alias.white}', description: 'BG.' }],
    ['kui-color-background-primary', { value: '{color.alias.blue.60}', description: 'Primary BG.' }],
  ])
  const componentSlots = new Map([
    ['kui-button-color-background-primary', { value: '', description: 'Button primary BG.' }],
  ])

  it('adds a missing semantic token with its source default', () => {
    const existing = { 'kui-color-background': { $value: '{color.alias.white}', $description: 'BG.' } }
    const { theme, added } = reconcileTheme(existing, semanticDefaults, componentSlots)
    // Asserted WITHOUT re-sorting the test's own copy first: `reconcileTheme` sorts `added` itself
    // (map iteration order here is color-background-primary, then button-*, i.e. NOT already
    // alphabetical) — pre-sorting in the assertion would mask a regression that dropped that sort.
    expect(added).toEqual(['kui-button-color-background-primary', 'kui-color-background-primary'])
    expect(theme['kui-color-background-primary']).toEqual({ $value: '{color.alias.blue.60}', $description: 'Primary BG.' })
    expect(theme['kui-button-color-background-primary']).toEqual({ $value: '', $description: 'Button primary BG.' })
  })

  it('never overwrites an existing token — a deliberate theme-specific override survives sync', () => {
    // electric-lime-day sets kui-color-background-primary to gray.70, deliberately overriding the blue.60
    // source default. Sync must never regenerate a value that's already present.
    const existing = {
      'kui-color-background': { $value: '{color.alias.white}', $description: 'BG.' },
      'kui-color-background-primary': { $value: '{color.alias.gray.70}', $description: 'Overridden.' },
    }
    const { theme, added } = reconcileTheme(existing, semanticDefaults, componentSlots)
    expect(theme['kui-color-background-primary']).toEqual({ $value: '{color.alias.gray.70}', $description: 'Overridden.' })
    expect(added).toEqual(['kui-button-color-background-primary'])
  })

  it('is a no-op when the theme is already fully in sync', () => {
    const existing = {
      'kui-color-background': { $value: '{color.alias.white}', $description: 'BG.' },
      'kui-color-background-primary': { $value: '{color.alias.blue.60}', $description: 'Primary BG.' },
      'kui-button-color-background-primary': { $value: '', $description: 'Button primary BG.' },
    }
    const { theme, added, extra } = reconcileTheme(existing, semanticDefaults, componentSlots)
    expect(added).toEqual([])
    expect(extra).toEqual([])
    expect(theme).toEqual(existing)
  })

  it('reports (but does not remove) a token no longer in the canonical source/component set', () => {
    const existing = {
      'kui-color-background': { $value: '{color.alias.white}', $description: 'BG.' },
      'kui-color-retired-token': { $value: '{color.alias.gray.10}', $description: 'No longer canonical.' },
    }
    const { theme, extra } = reconcileTheme(existing, semanticDefaults, componentSlots)
    expect(extra).toEqual(['kui-color-retired-token'])
    expect(theme['kui-color-retired-token']).toBeDefined() // never silently deleted
  })

  it('never adds a breakpoint token (build-injected, excluded from semanticDefaults)', () => {
    const { theme, added } = reconcileTheme({}, semanticDefaults, componentSlots)
    expect(Object.keys(theme).some(k => k.startsWith('kui-breakpoint-'))).toBe(false)
    expect(added.some(k => k.startsWith('kui-breakpoint-'))).toBe(false)
  })

  it('a semantic-only theme (e.g. classic-day) only gets semantic tokens added — never component tokens', () => {
    const { theme, added } = reconcileTheme({}, semanticDefaults, componentSlots, { isSemanticOnly: true })
    expect(added).toEqual(['kui-color-background', 'kui-color-background-primary'])
    expect(theme['kui-button-color-background-primary']).toBeUndefined()
  })

  it('flags an existing component token on a semantic-only theme as extra (never removed, but surfaced)', () => {
    const existing = { 'kui-button-color-background-primary': { $value: '' } }
    const { extra } = reconcileTheme(existing, semanticDefaults, componentSlots, { isSemanticOnly: true })
    expect(extra).toEqual(['kui-button-color-background-primary'])
  })
})

describe('syncTheme / syncAllThemes (file I/O, isolated temp dir)', () => {
  let themesRoot

  beforeAll(async () => {
    themesRoot = await mkdtemp(join(tmpdir(), 'themes-sync-test-'))
    await mkdir(join(themesRoot, 'partial-theme'), { recursive: true })
    await writeFile(
      join(themesRoot, 'partial-theme', 'partial-theme.theme.json'),
      JSON.stringify({ 'kui-color-background': { $value: '{color.alias.white}', $description: 'BG.' } }, null, 2) + '\n',
      'utf-8',
    )
    await mkdir(join(themesRoot, 'complete-theme'), { recursive: true })
    await writeFile(join(themesRoot, 'complete-theme', 'complete-theme.theme.json'), '{}\n', 'utf-8')
  })

  afterAll(async () => {
    await rm(themesRoot, { recursive: true, force: true })
  })

  it('syncTheme adds missing tokens and rewrites the file when changes are made', async () => {
    const result = await syncTheme('partial-theme', { themesRoot })
    expect(result.changed).toBe(true)
    expect(result.added.length).toBeGreaterThan(0)

    const onDisk = JSON.parse(await readFile(join(themesRoot, 'partial-theme', 'partial-theme.theme.json'), 'utf-8'))
    expect(Object.keys(onDisk).length).toBeGreaterThan(1)
    expect(onDisk['kui-color-background']).toEqual({ $value: '{color.alias.white}', $description: 'BG.' })
  })

  it('syncTheme is a no-op (does not rewrite the file) on a second run', async () => {
    const before = await readFile(join(themesRoot, 'partial-theme', 'partial-theme.theme.json'), 'utf-8')
    const result = await syncTheme('partial-theme', { themesRoot })
    expect(result.changed).toBe(false)
    expect(result.added).toEqual([])
    const after = await readFile(join(themesRoot, 'partial-theme', 'partial-theme.theme.json'), 'utf-8')
    expect(after).toBe(before)
  })

  it('syncAllThemes discovers and syncs every non-internal theme directory', async () => {
    const results = await syncAllThemes({ themesRoot })
    expect(results.map(r => r.name).sort()).toEqual(['complete-theme', 'partial-theme'])
  })

  it('syncAllThemes hard-errors (via discoverThemes) on a theme directory with no <name>.theme.json, rather than silently skipping it', async () => {
    // Silently skipping would mean `pnpm themes:sync` reports "all good" while the real build
    // (which uses the same discoverThemes()) hard-fails on the exact same malformed directory —
    // the maintenance tool must surface the problem, not hide it.
    await mkdir(join(themesRoot, 'empty-dir-no-theme-file'), { recursive: true })
    await expect(syncAllThemes({ themesRoot })).rejects.toThrow(/empty-dir-no-theme-file/)
  })

  it('syncTheme rejects (fails loudly, does not silently create) when the theme file does not exist', async () => {
    await expect(syncTheme('does-not-exist', { themesRoot })).rejects.toThrow()
  })

  it('regression: syncing a real SEMANTIC_ONLY_THEMES name (classic-day) never adds component tokens', async () => {
    // The exact bug this guards against: an earlier version of syncTheme added all 581 component
    // tokens to the real classic-day.theme.json, which must stay semantic-only (zero component
    // tokens) per the drift guard in themes.spec.mjs.
    await mkdir(join(themesRoot, 'classic-day'), { recursive: true })
    await writeFile(join(themesRoot, 'classic-day', 'classic-day.theme.json'), '{}\n', 'utf-8')

    const result = await syncTheme('classic-day', { themesRoot })
    const onDisk = JSON.parse(await readFile(join(themesRoot, 'classic-day', 'classic-day.theme.json'), 'utf-8'))

    expect(result.added.some(name => name.startsWith('kui-button-'))).toBe(false)
    expect(Object.keys(onDisk).some(name => name.startsWith('kui-button-'))).toBe(false)
    expect(result.added.some(name => name.startsWith('kui-color-background'))).toBe(true)
  })
})
