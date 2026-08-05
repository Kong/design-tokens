// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { buildBookmarkletHref, isJavascriptScheme } from './buildBookmarkletHref'

describe('buildBookmarkletHref', () => {
  it('returns a javascript:-prefixed, URI-encoded string pointed at the embedded route', () => {
    const href = buildBookmarkletHref()
    expect(href.startsWith('javascript:')).toBe(true)

    const decoded = decodeURIComponent(href.slice('javascript:'.length))
    expect(decoded).toContain('#/embedded?embedded=1')
    expect(decoded).toContain(window.location.origin)
  })

  it('leaves no unreplaced template placeholders', () => {
    const href = buildBookmarkletHref()
    const decoded = decodeURIComponent(href.slice('javascript:'.length))
    expect(decoded).not.toContain('__EMBED_URL__')
    expect(decoded).not.toContain('__STORAGE_NS__')
  })
})

describe('isJavascriptScheme', () => {
  it('accepts javascript: hrefs, case-insensitively', () => {
    expect(isJavascriptScheme('javascript:alert(1)')).toBe(true)
    expect(isJavascriptScheme('JAVASCRIPT:alert(1)')).toBe(true)
  })

  it('rejects data: and vbscript: hrefs', () => {
    expect(isJavascriptScheme('data:text/html,<script>alert(1)</script>')).toBe(false)
    expect(isJavascriptScheme('vbscript:msgbox(1)')).toBe(false)
  })

  it('rejects whitespace/control-character scheme-smuggling bypasses', () => {
    expect(isJavascriptScheme('\tjava\nscript:alert(1)')).toBe(true)
    expect(isJavascriptScheme('data:text/html;base64,x\njavascript:alert(1)')).toBe(false)
  })
})
