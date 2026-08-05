// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { BOOKMARKLET_TEMPLATE } from './preview-bookmarklet'

/**
 * The bookmarklet script sets a global guard flag to avoid registering its `message`
 * listener twice. Declared here (test-only) since the flag is set dynamically via bracket
 * notation inside the plain-JS bookmarklet template, not by any typed module.
 */
declare global {
  interface Window {
    __kongListener?: boolean
  }
}

const FRAME_SRC = 'https://sandbox.example.com/#/embedded?embedded=1'

/** Gets an element by id, throwing if it isn't present — narrows away `null` for tests. */
function getElement<T extends HTMLElement = HTMLElement>(id: string): T {
  const el = document.getElementById(id)
  if (!el) throw new Error(`Expected to find element with id "${id}"`)
  return el as unknown as T
}

/**
 * Runs the bookmarklet IIFE in the current jsdom `window`/`document`. It is a plain script
 * (no module system), so `new Function` is the only way to execute it as-authored rather than
 * re-implementing its logic in the test.
 */
function runBookmarklet() {
  const script = BOOKMARKLET_TEMPLATE.replace(/__EMBED_URL__/g, FRAME_SRC)
  new Function(script)()
}

function cleanupDom() {
  for (const id of ['kong-sidebar', 'kong-sidebar-overlay', 'kong-sidebar-tab', 'kong-design-token-overrides']) {
    document.getElementById(id)?.remove()
  }
  delete window.__kongListener
}

describe('preview-bookmarklet (executed script)', () => {
  afterEach(() => {
    cleanupDom()
  })

  it('injects the override style tag and the sidebar iframe pointed at the resolved URL', () => {
    runBookmarklet()
    const frame = getElement<HTMLIFrameElement>('kong-sidebar')
    expect(frame).toBeTruthy()
    expect(frame.tagName).toBe('IFRAME')
    expect(frame.src.startsWith(FRAME_SRC)).toBe(true)
    expect(document.getElementById('kong-design-token-overrides')).toBeTruthy()
  })

  it('applies CSS from a kui-token-override message sent by the sidebar iframe itself', () => {
    runBookmarklet()
    const frame = getElement<HTMLIFrameElement>('kong-sidebar')
    const frameOrigin = new URL(frame.src).origin

    window.dispatchEvent(new MessageEvent('message', {
      origin: frameOrigin,
      source: frame.contentWindow,
      data: { type: 'kui-token-override', css: ':root { --x: 1px; }', src: 'https://sandbox.example.com/state' },
    }))

    expect(getElement('kong-design-token-overrides').textContent).toBe(':root { --x: 1px; }')
  })

  it('ignores a kui-token-override message from an origin other than the sidebar iframe', () => {
    runBookmarklet()
    const frame = getElement<HTMLIFrameElement>('kong-sidebar')

    window.dispatchEvent(new MessageEvent('message', {
      origin: 'https://evil.example.com',
      source: frame.contentWindow,
      data: { type: 'kui-token-override', css: ':root { --x: 999px; }' },
    }))

    expect(getElement('kong-design-token-overrides').textContent).toBe('')
  })

  it('ignores a kui-token-override message whose origin matches but whose sender is not the sidebar iframe itself (regression: fixes the cross-talk bug where two same-origin sidebars could process each other\'s messages)', () => {
    runBookmarklet()
    const frame = getElement<HTMLIFrameElement>('kong-sidebar')
    const frameOrigin = new URL(frame.src).origin

    // A second, unrelated iframe on the same page shares the sidebar's origin but is not it.
    const impostor = document.createElement('iframe')
    impostor.src = frame.src
    document.body.appendChild(impostor)

    window.dispatchEvent(new MessageEvent('message', {
      origin: frameOrigin,
      source: impostor.contentWindow,
      data: { type: 'kui-token-override', css: ':root { --x: 999px; }' },
    }))

    expect(getElement('kong-design-token-overrides').textContent).toBe('')
    impostor.remove()
  })

  it('ignores a kui-close message from an untrusted origin (does not remove the sidebar)', () => {
    runBookmarklet()
    const frame = getElement<HTMLIFrameElement>('kong-sidebar')

    window.dispatchEvent(new MessageEvent('message', {
      origin: 'https://evil.example.com',
      source: frame.contentWindow,
      data: { type: 'kui-close' },
    }))

    expect(document.getElementById('kong-sidebar')).toBeTruthy()
  })

  it('removes the sidebar on a kui-close message sent by the sidebar iframe itself', () => {
    runBookmarklet()
    const frame = getElement<HTMLIFrameElement>('kong-sidebar')
    const frameOrigin = new URL(frame.src).origin

    window.dispatchEvent(new MessageEvent('message', {
      origin: frameOrigin,
      source: frame.contentWindow,
      data: { type: 'kui-close' },
    }))

    expect(document.getElementById('kong-sidebar')).toBeNull()
  })

  it('toggles (hides) the existing sidebar on a second click instead of creating a duplicate', () => {
    runBookmarklet()
    runBookmarklet()

    const frames = document.querySelectorAll<HTMLElement>('#kong-sidebar')
    expect(frames).toHaveLength(1)
    expect(frames[0]?.style.display).toBe('none')
  })

  describe('storage unavailable (quota exceeded / disabled)', () => {
    it('still applies the CSS override even when localStorage.setItem throws', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('The quota has been exceeded.', 'QuotaExceededError')
      })
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      runBookmarklet()
      const frame = getElement<HTMLIFrameElement>('kong-sidebar')
      const frameOrigin = new URL(frame.src).origin

      expect(() => window.dispatchEvent(new MessageEvent('message', {
        origin: frameOrigin,
        source: frame.contentWindow,
        data: { type: 'kui-token-override', css: ':root { --x: 1px; }', src: 'https://sandbox.example.com/state' },
      }))).not.toThrow()

      // The actual page effect (applying the CSS) must still happen — a failed restore-key
      // write must not block the live preview from working.
      expect(getElement('kong-design-token-overrides').textContent).toBe(':root { --x: 1px; }')
      expect(warnSpy).toHaveBeenCalled()

      setItemSpy.mockRestore()
      warnSpy.mockRestore()
    })

    it('falls back to the baked-in default URL, without throwing, when localStorage.getItem throws', () => {
      const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('storage disabled')
      })
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      expect(() => runBookmarklet()).not.toThrow()
      const frame = getElement<HTMLIFrameElement>('kong-sidebar')
      expect(frame.src.startsWith(FRAME_SRC)).toBe(true)
      expect(warnSpy).toHaveBeenCalled()

      getItemSpy.mockRestore()
      warnSpy.mockRestore()
    })
  })
})
