import { describe, it, expect, beforeAll, afterEach } from 'vitest'
import { readFile, mkdir, rm, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { extractDescriptions, cleanDescription, buildDescriptionMap, createTheme, loadSourceTheme } from './create-theme.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const THEMES_DIR = join(ROOT, 'themes')
const TEMP_DIR = join(ROOT, 'tokens', 'themes', '_test-temp')

// ── extractDescriptions ───────────────────────────────────────────────────────

describe('extractDescriptions', () => {
  it('extracts a description from a simple leaf token', () => {
    const result = {}
    extractDescriptions(
      { color: { background: { $value: '#fff', $description: 'Page background.' } } },
      [],
      result,
    )
    expect(result['kui-color-background']).toBe('Page background.')
  })

  it('strips the DTCG `_` key at the leaf level', () => {
    const result = {}
    extractDescriptions(
      { color: { background: { _: { $value: '#fff', $description: 'Root background.' } } } },
      [],
      result,
    )
    expect(result['kui-color-background']).toBe('Root background.')
    expect(result['kui-color-background-_']).toBeUndefined()
  })

  it('strips `_` from the middle of a path', () => {
    // e.g. { color: { _: { background: { $value: '...' } } } } → kui-color-background
    const result = {}
    extractDescriptions(
      { color: { _: { background: { $value: '#000', $description: 'Mid-path strip.' } } } },
      [],
      result,
    )
    expect(result['kui-color-background']).toBe('Mid-path strip.')
    expect(result['kui-color-_-background']).toBeUndefined()
  })

  it('handles multi-level nesting', () => {
    const result = {}
    extractDescriptions(
      { button: { border: { radius: { $value: '', $description: 'Button corner radius.' } } } },
      [],
      result,
    )
    expect(result['kui-button-border-radius']).toBe('Button corner radius.')
  })

  it('skips dollar-sign metadata keys at group level ($type, $description)', () => {
    const result = {}
    extractDescriptions(
      {
        color: {
          $type: 'color',
          $description: 'Color group — should not become a token.',
          background: { $value: '#fff', $description: 'Background.' },
        },
      },
      [],
      result,
    )
    expect(Object.keys(result)).toEqual(['kui-color-background'])
    expect(result['kui-color-$type']).toBeUndefined()
    expect(result['kui-color-$description']).toBeUndefined()
  })

  it('sets empty string when $description is absent from a leaf', () => {
    const result = {}
    extractDescriptions({ foo: { bar: { $value: '1px' } } }, [], result)
    expect(result['kui-foo-bar']).toBe('')
  })

  it('does not emit a key when the entire path consists of `_`', () => {
    const result = {}
    extractDescriptions({ _: { $value: '#000', $description: 'Root.' } }, [], result)
    expect(Object.keys(result)).toHaveLength(0)
  })

  it('handles multiple sibling tokens without path cross-contamination', () => {
    const result = {}
    extractDescriptions(
      {
        border: {
          radius: {
            10: { $value: '2px', $description: 'Small radius.' },
            20: { $value: '4px', $description: 'Medium radius.' },
            30: { $value: '8px', $description: 'Large radius.' },
          },
        },
      },
      [],
      result,
    )
    expect(result['kui-border-radius-10']).toBe('Small radius.')
    expect(result['kui-border-radius-20']).toBe('Medium radius.')
    expect(result['kui-border-radius-30']).toBe('Large radius.')
    // Verify no sibling leaked into another
    expect(result['kui-border-radius-10-20']).toBeUndefined()
    expect(result['kui-border-radius-20-10']).toBeUndefined()
  })

  it('returns early without throwing when obj is null', () => {
    const result = {}
    expect(() => extractDescriptions(null, [], result)).not.toThrow()
    expect(Object.keys(result)).toHaveLength(0)
  })

  it('returns early without throwing when obj is a primitive', () => {
    const result = {}
    expect(() => extractDescriptions('a string', [], result)).not.toThrow()
    expect(() => extractDescriptions(42, [], result)).not.toThrow()
    expect(Object.keys(result)).toHaveLength(0)
  })

  it('normalizes underscore segments to kebab-case (e.g. line_height → line-height)', () => {
    const result = {}
    extractDescriptions(
      { button: { line_height: { medium: { $value: '', $description: 'Medium button line height.' } } } },
      [],
      result,
    )
    expect(result['kui-button-line-height-medium']).toBe('Medium button line height.')
    expect(result['kui-button-line_height-medium']).toBeUndefined()
  })

  it('normalizes compound underscore root keys (e.g. input_switch → input-switch)', () => {
    const result = {}
    extractDescriptions(
      { input_switch: { color: { background: { $value: '', $description: 'Switch track color.' } } } },
      [],
      result,
    )
    expect(result['kui-input-switch-color-background']).toBe('Switch track color.')
    expect(result['kui-input_switch-color-background']).toBeUndefined()
  })
})

// ── cleanDescription ──────────────────────────────────────────────────────────

describe('cleanDescription', () => {
  it('returns empty string for scale tokens (space, numbered border-radius, border-width, icon-size, line-height, letter-spacing)', () => {
    expect(cleanDescription('kui-space-50', 'Something.')).toBe('')
    expect(cleanDescription('kui-border-radius-0', '0px border radius.')).toBe('')
    expect(cleanDescription('kui-border-radius-30', '6px border radius.')).toBe('')
    expect(cleanDescription('kui-border-radius-50', '10px border radius.')).toBe('')
    expect(cleanDescription('kui-border-width-10', '1px border width.')).toBe('')
    expect(cleanDescription('kui-icon-size-30', 'Icon size.')).toBe('')
    expect(cleanDescription('kui-line-height-30', 'Line height.')).toBe('')
    expect(cleanDescription('kui-letter-spacing-0', 'Letter spacing.')).toBe('')
  })

  it('preserves component token descriptions', () => {
    expect(cleanDescription('kui-button-border-radius-medium', 'Medium button border radius.')).toBe('Medium button border radius.')
    expect(cleanDescription('kui-badge-border-radius', 'Badge border radius.')).toBe('Badge border radius.')
    expect(cleanDescription('kui-input-shadow-border-focus', 'Input border shadow when focused.')).toBe('Input border shadow when focused.')
  })

  it('does not treat non-numbered border-radius tokens as scale tokens', () => {
    // "circle" and "round" are semantic shapes, not numbered scale steps
    expect(cleanDescription('kui-border-radius-circle', '50% border radius used to create circles.')).toBe('50% border radius used to create circles.')
    expect(cleanDescription('kui-border-radius-round', '100px border radius used to create pill shapes.')).toBe('100px border radius used to create pill shapes.')
  })

  it('strips trailing parenthetical alias refs and preserves the sentence', () => {
    expect(cleanDescription('kui-color-background', 'Default background color for containers (white).')).toBe('Default background color for containers.')
    expect(cleanDescription('kui-color-background-danger', 'Background color for danger actions or messages (red.60).')).toBe('Background color for danger actions or messages.')
    expect(cleanDescription('kui-color-text', 'Default text color (black).')).toBe('Default text color.')
  })

  it('returns empty for pure CSS value descriptions (no terminal sentence period)', () => {
    expect(cleanDescription('kui-shadow', '0px 4px 20px 0px rgba(0, 0, 0, 0.08)')).toBe('')
    expect(cleanDescription('kui-shadow-border', '0px 0px 0px 1px gray.20 inset')).toBe('')
  })

  it('preserves semantic descriptions that have no parenthetical refs', () => {
    expect(cleanDescription('kui-color-border', 'Default border color.')).toBe('Default border color.')
    expect(cleanDescription('kui-shadow-focus', 'Default drop shadow for focused elements.')).toBe('Default drop shadow for focused elements.')
  })

  it('returns empty string for an empty description', () => {
    expect(cleanDescription('kui-color-background', '')).toBe('')
  })
})

// ── buildDescriptionMap (integration — reads real source files) ───────────────

describe('buildDescriptionMap', () => {
  /** @type {Record<string, string>} */
  let descriptions

  beforeAll(async () => {
    descriptions = await buildDescriptionMap()
  })

  it('returns a non-empty map', () => {
    expect(Object.keys(descriptions).length).toBeGreaterThan(0)
  })

  it('all values are strings', () => {
    for (const [key, value] of Object.entries(descriptions)) {
      expect(typeof value, `key "${key}" has non-string value`).toBe('string')
    }
  })

  it('all keys start with `kui-`', () => {
    for (const key of Object.keys(descriptions)) {
      expect(key, `unexpected key: ${key}`).toMatch(/^kui-/)
    }
  })

  it('cleans semantic token descriptions — strips parenthetical refs, preserves sentence', () => {
    // Parenthetical alias ref stripped, sentence preserved
    expect(descriptions['kui-color-background']).toBe('Default background color for containers.')
  })

  it('returns empty string for scale tokens', () => {
    expect(descriptions['kui-border-radius-30']).toBe('')
    expect(descriptions['kui-border-width-10']).toBe('')
    expect(descriptions['kui-space-50']).toBe('')
  })

  it('contains expected component token descriptions', () => {
    expect(descriptions['kui-button-border-radius-medium']).toBe('Medium button border radius.')
    expect(descriptions['kui-badge-border-radius']).toBe('Badge border radius.')
    expect(descriptions['kui-input-shadow-border-focus']).toBe('Input border shadow when focused.')
  })

  it('normalizes underscore segments — line_height keys produce hyphenated CSS var names', () => {
    expect(descriptions['kui-button-line-height-medium']).toBe('Medium button line height.')
    expect(descriptions['kui-badge-line-height']).toBe('Badge line height.')
    expect(descriptions['kui-card-body-line-height']).toBe('Card body line height.')
    expect(descriptions['kui-input-line-height']).toBe('Input line height.')
    // Underscore form must not exist
    expect(descriptions['kui-button-line_height-medium']).toBeUndefined()
  })

  it('contains expected new component token descriptions', () => {
    expect(descriptions['kui-alert-border-radius']).toBe('Alert border radius.')
    expect(descriptions['kui-alert-color-background-info']).toBe('Info alert background color.')
    expect(descriptions['kui-modal-color-background-backdrop']).toBe('Modal backdrop overlay color.')
    expect(descriptions['kui-modal-title-line-height']).toBe('Modal title line height.')
    expect(descriptions['kui-tabs-color-border-active']).toBe('Active tab indicator color.')
    expect(descriptions['kui-tabs-line-height']).toBe('Tab item line height.')
    expect(descriptions['kui-tooltip-color-background']).toBe('Tooltip background color.')
    expect(descriptions['kui-input-switch-color-background-checked']).toBe('Input switch track background color when checked.')
    expect(descriptions['kui-input-switch-shadow-focus']).toBe('Input switch focus ring shadow.')
    expect(descriptions['kui-button-gap-medium']).toBe('Gap between items in the medium button.')
  })

  it('strips the DTCG `_` key — `kui-color-background` exists, `kui-color-background-_` does not', () => {
    expect(descriptions['kui-color-background']).toBeDefined()
    expect(descriptions['kui-color-background-_']).toBeUndefined()
  })
})

// ── createTheme ───────────────────────────────────────────────────────────────

describe('createTheme', () => {
  const TOKENS = ['--kui-color-background', '--kui-color-text', '--kui-border-radius-10']
  const DESCRIPTIONS = {
    'kui-color-background': 'Background color.',
    'kui-color-text': 'Text color.',
    'kui-border-radius-10': 'Small radius.',
  }

  afterEach(async () => {
    await rm(TEMP_DIR, { recursive: true, force: true })
  })

  async function writeTemp(name, opts = {}) {
    await mkdir(TEMP_DIR, { recursive: true })
    const outPath = join(TEMP_DIR, `${name}.json`)
    await createTheme({ outPath, tokens: TOKENS, descriptions: DESCRIPTIONS, ...opts })
    return JSON.parse(await readFile(outPath, 'utf-8'))
  }

  it('creates a file with one entry per token', async () => {
    const theme = await writeTemp('test-count')
    expect(Object.keys(theme)).toHaveLength(TOKENS.length)
  })

  it('keys are `kui-*` (no leading `--`)', async () => {
    const theme = await writeTemp('test-keys')
    for (const key of Object.keys(theme)) {
      expect(key).toMatch(/^kui-/)
      expect(key).not.toMatch(/^--/)
    }
  })

  it('preserves token order in the output file', async () => {
    const theme = await writeTemp('test-order')
    const outputKeys = Object.keys(theme)
    const expectedKeys = TOKENS.map(t => t.slice(2))
    expect(outputKeys).toEqual(expectedKeys)
  })

  it('each entry has a `$value` field', async () => {
    const theme = await writeTemp('test-value-field')
    for (const entry of Object.values(theme)) {
      expect(entry).toHaveProperty('$value')
    }
  })

  it('$value is empty string when no sourceValues provided', async () => {
    const theme = await writeTemp('test-empty-values')
    for (const entry of Object.values(theme)) {
      expect(entry.$value).toBe('')
    }
  })

  it('adds $description when the description map has a non-empty entry', async () => {
    const theme = await writeTemp('test-desc')
    expect(theme['kui-color-background'].$description).toBe('Background color.')
    expect(theme['kui-color-text'].$description).toBe('Text color.')
    expect(theme['kui-border-radius-10'].$description).toBe('Small radius.')
  })

  it('$description comes before $value (alphabetical property order)', async () => {
    const theme = await writeTemp('test-prop-order')
    for (const entry of Object.values(theme)) {
      const keys = Object.keys(entry)
      if (keys.length === 2) {
        expect(keys[0]).toBe('$description')
        expect(keys[1]).toBe('$value')
      }
    }
  })

  it('omits $description when description is an empty string', async () => {
    const noDescriptions = {
      'kui-color-background': '',
      'kui-color-text': '',
      'kui-border-radius-10': '',
    }
    await mkdir(TEMP_DIR, { recursive: true })
    const outPath = join(TEMP_DIR, 'no-desc.json')
    await createTheme({ outPath, tokens: TOKENS, descriptions: noDescriptions })
    const theme = JSON.parse(await readFile(outPath, 'utf-8'))
    for (const entry of Object.values(theme)) {
      expect(entry.$description).toBeUndefined()
    }
  })

  it('copies $value from sourceValues when --from is used', async () => {
    const sourceValues = {
      'kui-color-background': '#ffffff',
      'kui-color-text': '#000933',
      'kui-border-radius-10': '4px',
    }
    const theme = await writeTemp('test-from', { sourceValues })
    expect(theme['kui-color-background'].$value).toBe('#ffffff')
    expect(theme['kui-color-text'].$value).toBe('#000933')
    expect(theme['kui-border-radius-10'].$value).toBe('4px')
  })

  it('uses empty string for tokens absent from sourceValues', async () => {
    const sourceValues = { 'kui-color-background': '#fff' }
    const theme = await writeTemp('test-partial-from', { sourceValues })
    expect(theme['kui-color-background'].$value).toBe('#fff')
    expect(theme['kui-color-text'].$value).toBe('')
    expect(theme['kui-border-radius-10'].$value).toBe('')
  })

  it('does not emit keys from sourceValues that are not in the tokens list', async () => {
    const sourceValues = {
      'kui-color-background': '#fff',
      'kui-not-a-real-token': 'should-be-excluded',
    }
    const theme = await writeTemp('test-extra-source', { sourceValues })
    expect(theme['kui-not-a-real-token']).toBeUndefined()
    expect(Object.keys(theme)).toHaveLength(TOKENS.length)
  })

  it('output file ends with a newline', async () => {
    await mkdir(TEMP_DIR, { recursive: true })
    const outPath = join(TEMP_DIR, 'newline-check.json')
    await createTheme({ outPath, tokens: TOKENS, descriptions: DESCRIPTIONS })
    const raw = await readFile(outPath, 'utf-8')
    expect(raw.endsWith('\n')).toBe(true)
  })
})

// ── loadSourceTheme (integration — reads real theme files) ────────────────────

describe('loadSourceTheme', () => {
  /** @type {Record<string, string>} */
  let values

  beforeAll(async () => {
    values = await loadSourceTheme(THEMES_DIR, 'konnect-light')
  })

  it('loads $value entries from an existing theme file', () => {
    expect(Object.keys(values).length).toBeGreaterThan(0)
  })

  it('all keys start with `kui-`', () => {
    for (const key of Object.keys(values)) {
      expect(key).toMatch(/^kui-/)
    }
  })

  it('all values are plain strings (not objects)', () => {
    for (const [key, v] of Object.entries(values)) {
      expect(typeof v, `key "${key}" has non-string value`).toBe('string')
    }
  })

  it('returns the resolved $value for known tokens', () => {
    expect(values['kui-color-background']).toBe('#ffffff')
    expect(values['kui-badge-border-radius']).toBe('6px')
  })

  it('does not include $description in the returned map', () => {
    // loadSourceTheme extracts only $value — $description is metadata, not returned
    expect('$description' in values).toBe(false)
    for (const key of Object.keys(values)) {
      expect(key).not.toMatch(/^\$/)
    }
  })

  it('excludes entries that have no $value field', async () => {
    // Test the filter: v?.$value !== undefined
    await mkdir(TEMP_DIR, { recursive: true })
    const fixturePath = join(TEMP_DIR, 'partial.json')
    await writeFile(
      fixturePath,
      JSON.stringify({
        'kui-has-value': { $value: '#abc', $description: 'Has a value.' },
        'kui-no-value': { $description: 'Missing $value — should be excluded.' },
      }),
      'utf-8',
    )
    const result = await loadSourceTheme(TEMP_DIR, 'partial')
    expect(result['kui-has-value']).toBe('#abc')
    expect(result['kui-no-value']).toBeUndefined()
    expect(Object.keys(result)).toHaveLength(1)
    await rm(TEMP_DIR, { recursive: true, force: true })
  })

  it('exits when the source theme does not exist', async () => {
    const { spawnSync } = await import('node:child_process')
    const result = spawnSync(
      process.execPath,
      ['--input-type=module'],
      {
        input: `
          import { loadSourceTheme } from ${JSON.stringify(join(__dirname, 'create-theme.mjs'))};
          await loadSourceTheme(${JSON.stringify(THEMES_DIR)}, 'does-not-exist');
        `,
        encoding: 'utf-8',
      },
    )
    expect(result.status).toBe(1)
  })
})
