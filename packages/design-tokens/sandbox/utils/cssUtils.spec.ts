import { describe, expect, it } from 'vitest'
import { applySelector, hardenCssPrecedence } from './cssUtils'

describe('applySelector', () => {
  it('returns css unchanged for empty/`:root` selectors', () => {
    const css = ':root {\n  --kui-x: 1px;\n}'
    expect(applySelector(css, '')).toBe(css)
    expect(applySelector(css, '   ')).toBe(css)
    expect(applySelector(css, ':root')).toBe(css)
  })

  it('returns empty css unchanged', () => {
    expect(applySelector('', '[data-theme="dark"]')).toBe('')
  })

  it('replaces the leading `:root` selector with a custom one', () => {
    const css = ':root {\n  --kui-x: 1px;\n}'
    expect(applySelector(css, '[data-theme="dark"]')).toBe('[data-theme="dark"] {\n  --kui-x: 1px;\n}')
  })
})

describe('hardenCssPrecedence', () => {
  it('returns empty string unchanged', () => {
    expect(hardenCssPrecedence('')).toBe('')
  })

  it('bumps `:root` specificity to exactly `:root:root`', () => {
    const out = hardenCssPrecedence(':root {\n  --kui-x: 1px;\n}')
    expect(out).toBe(':root:root {\n  --kui-x: 1px !important;\n}')
  })

  it('bumps every `:root` block (tokens + custom-props)', () => {
    const css = ':root {\n  --kui-x: 1px;\n}\n\n/* Custom properties */\n:root {\n  --my: 2px;\n}'
    const out = hardenCssPrecedence(css)
    expect(out.match(/:root:root \{/g)).toHaveLength(2)
  })

  it('adds `!important` to every declaration', () => {
    const out = hardenCssPrecedence(':root {\n  --kui-a: 1px;\n  --kui-b: #fff;\n}')
    expect(out).toContain('--kui-a: 1px !important;')
    expect(out).toContain('--kui-b: #fff !important;')
  })

  it('preserves values that contain var() fallback chains and spaces', () => {
    const css = ':root {\n  --kui-x: 0px 0px 0px var(--kui-border-width-10) inset;\n}'
    const out = hardenCssPrecedence(css)
    expect(out).toContain('--kui-x: 0px 0px 0px var(--kui-border-width-10) inset !important;')
  })

  it('is idempotent — never doubles `!important`', () => {
    const css = ':root {\n  --kui-x: 1px;\n}'
    const once = hardenCssPrecedence(css)
    const twice = hardenCssPrecedence(once)
    expect(twice).toBe(once)
    expect(twice).not.toContain('!important !important')
  })

  it('leaves a custom selector’s specificity alone but still forces !important', () => {
    const css = '[data-theme="dark"] {\n  --kui-x: 1px;\n}'
    const out = hardenCssPrecedence(css)
    expect(out).toContain('[data-theme="dark"] {')
    expect(out).not.toContain(':root')
    expect(out).toContain('--kui-x: 1px !important;')
  })
})
