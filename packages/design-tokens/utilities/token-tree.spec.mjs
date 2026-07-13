import { describe, it, expect } from 'vitest'
import { pathToTokenName, flattenTokenTree } from './token-tree.mjs'

describe('pathToTokenName', () => {
  it('joins path segments with the kui- prefix', () => {
    expect(pathToTokenName(['color', 'background', 'danger'])).toBe('kui-color-background-danger')
  })

  it('drops `_` segments (the DTCG "base leaf" convention)', () => {
    expect(pathToTokenName(['color', 'background', '_'])).toBe('kui-color-background')
  })

  it('collapses underscores and other non-alphanumeric runs to a single hyphen', () => {
    expect(pathToTokenName(['line_height', '10'])).toBe('kui-line-height-10')
  })
})

describe('flattenTokenTree', () => {
  it('yields one record per leaf with its raw value and description', () => {
    const tree = {
      color: {
        $type: 'color',
        background: {
          _: { $value: '{color.alias.white}', $description: 'Default background.' },
          accent: { $value: '{color.alias.blue.60}' },
        },
      },
    }
    const records = flattenTokenTree(tree)
    expect(records).toEqual(
      expect.arrayContaining([
        { name: 'kui-color-background', path: ['color', 'background', '_'], value: '{color.alias.white}', description: 'Default background.' },
        { name: 'kui-color-background-accent', path: ['color', 'background', 'accent'], value: '{color.alias.blue.60}', description: undefined },
      ]),
    )
    expect(records).toHaveLength(2)
  })

  it('skips $-prefixed metadata keys at every level', () => {
    const tree = { $type: 'component', copy: { $description: 'irrelevant at this level', color: { text: { $value: '' } } } }
    const records = flattenTokenTree(tree)
    expect(records).toEqual([{ name: 'kui-copy-color-text', path: ['copy', 'color', 'text'], value: '', description: undefined }])
  })

  it('returns an empty array for a tree with no leaves', () => {
    expect(flattenTokenTree({ $type: 'color' })).toEqual([])
  })

  it('exposes the raw, un-renamed path segments (including a literal "_" or "line_height") — needed to resolve {a.b.c} references, which are written against the raw JSON path, not the derived kui- name', () => {
    const tree = { line_height: { 10: { $value: '12px' } } }
    expect(flattenTokenTree(tree)).toEqual([
      { name: 'kui-line-height-10', path: ['line_height', '10'], value: '12px', description: undefined },
    ])
  })
})
