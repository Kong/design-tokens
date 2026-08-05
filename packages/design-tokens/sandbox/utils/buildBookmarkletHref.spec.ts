// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { buildBookmarkletHref } from './buildBookmarkletHref'

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
