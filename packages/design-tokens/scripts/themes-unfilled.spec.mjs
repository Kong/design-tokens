import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { findUnfilledComponentSlots, findUnchangedPaletteFamilies, reportUnfilled } from './themes-unfilled.mjs'

describe('findUnfilledComponentSlots (pure)', () => {
  const componentSlots = new Map([
    ['kui-button-color-background-primary', { value: '', description: 'Button BG.' }],
    ['kui-alert-color-background-danger', { value: '', description: 'Alert BG.' }],
  ])

  it('reports component tokens still empty', () => {
    const theme = {
      'kui-button-color-background-primary': { $value: '' },
      'kui-alert-color-background-danger': { $value: '{color.alias.red.10}' },
      'kui-color-background': { $value: '{color.alias.white}' },
    }
    expect(findUnfilledComponentSlots(theme, componentSlots)).toEqual(['kui-button-color-background-primary'])
  })

  it('reports clean (empty array) when every component slot is filled', () => {
    const theme = {
      'kui-button-color-background-primary': { $value: '{color.alias.gray.100}' },
      'kui-alert-color-background-danger': { $value: '{color.alias.red.10}' },
    }
    expect(findUnfilledComponentSlots(theme, componentSlots)).toEqual([])
  })

  it('does not flag a component token missing from the theme entirely (that is a sync/exhaustiveness concern, not an unfilled one)', () => {
    expect(findUnfilledComponentSlots({}, componentSlots)).toEqual([])
  })
})

describe('findUnchangedPaletteFamilies (pure)', () => {
  const manifest = { color: { alias: { blue: ['05', '10'], red: ['05', '10'], white: [], black: [] } } }
  const seedPalette = {
    color: {
      alias: {
        blue: { '05': { $value: '#EEE' }, '10': { $value: '#DDD' } },
        red: { '05': { $value: '#FEE' }, '10': { $value: '#FDD' } },
        white: { $value: '#FFF' },
        black: { $value: '#000' },
      },
    },
  }

  it('reports a stepped family whose values are byte-identical to the seed', () => {
    const palette = JSON.parse(JSON.stringify(seedPalette)) // unchanged copy
    expect(findUnchangedPaletteFamilies(palette, seedPalette, manifest)).toEqual(['blue', 'red'])
  })

  it('excludes a stepped family once its values diverge from the seed', () => {
    const palette = JSON.parse(JSON.stringify(seedPalette))
    palette.color.alias.blue['05'].$value = '#123456'
    expect(findUnchangedPaletteFamilies(palette, seedPalette, manifest)).toEqual(['red'])
  })

  it('never flags a direct-value singleton (black/white/transparent) as unchanged — matching the seed there is expected, not a sign of unfinished work', () => {
    const palette = JSON.parse(JSON.stringify(seedPalette))
    expect(findUnchangedPaletteFamilies(palette, seedPalette, manifest)).not.toContain('white')
    expect(findUnchangedPaletteFamilies(palette, seedPalette, manifest)).not.toContain('black')
  })
})

describe('reportUnfilled (file I/O, isolated temp dir)', () => {
  let themesRoot

  beforeAll(async () => {
    themesRoot = await mkdtemp(join(tmpdir(), 'themes-unfilled-test-'))
  })

  afterAll(async () => {
    await rm(themesRoot, { recursive: true, force: true })
  })

  it('reports a freshly scaffolded theme as fully unfilled (all component slots empty, all families unchanged from seed)', async () => {
    const { scaffoldTheme } = await import('./theme-scaffold.mjs')
    await scaffoldTheme('fresh-theme', { themesRoot })

    const report = await reportUnfilled('fresh-theme', { themesRoot })
    expect(report.unfilledComponentSlots.length).toBe(report.totalComponentSlots)
    expect(report.totalComponentSlots).toBeGreaterThan(0)
    expect(report.unchangedPaletteFamilies.length).toBe(report.totalPaletteFamilies)
    expect(report.totalPaletteFamilies).toBeGreaterThan(0)
  })

  it('reports clean once component slots are filled and the palette diverges from the seed', async () => {
    const { readFile, writeFile: write } = await import('node:fs/promises')
    const themeFile = join(themesRoot, 'fresh-theme', 'fresh-theme.theme.json')
    const theme = JSON.parse(await readFile(themeFile, 'utf-8'))
    for (const name of Object.keys(theme)) {
      if (theme[name].$value === '') theme[name].$value = '{color.alias.gray.50}'
    }
    await write(themeFile, JSON.stringify(theme, null, 2), 'utf-8')

    const paletteFile = join(themesRoot, 'fresh-theme', 'fresh-theme.alias.color.json')
    const palette = JSON.parse(await readFile(paletteFile, 'utf-8'))
    for (const family of Object.values(palette.color.alias)) {
      if (family && typeof family === 'object' && family.$value === undefined) {
        for (const step of Object.values(family)) step.$value = '#123456'
      }
    }
    await write(paletteFile, JSON.stringify(palette, null, 2), 'utf-8')

    const report = await reportUnfilled('fresh-theme', { themesRoot })
    expect(report.unfilledComponentSlots).toEqual([])
    expect(report.unchangedPaletteFamilies).toEqual([])
  })
})
