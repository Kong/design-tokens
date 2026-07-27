// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { BOOKMARKLET_TEMPLATE } from './preview-bookmarklet'

const FRAME_SRC = 'https://sandbox.example.com/#/customize?embedded=1'

/**
 * Runs the bookmarklet IIFE in the current jsdom `window`/`document`, namespaced as the
 * customizer bookmarklet. It is a plain script (no module system), so `new Function` is the
 * only way to execute it as-authored rather than re-implementing its logic in the test.
 */
function runBookmarklet() {
  const script = BOOKMARKLET_TEMPLATE
    .replace(/__CUSTOMIZER_URL__/g, FRAME_SRC)
    .replace(/__STORAGE_NS__/g, 'customizer')
  new Function(script)()
}

function cleanupDom() {
  for (const id of ['kong-customizer-sidebar', 'kong-customizer-overlay', 'kong-customizer-tab', 'kong-design-token-overrides']) {
    document.getElementById(id)?.remove()
  }
  delete window.__kongListener_customizer
}

describe('preview-bookmarklet (executed script)', () => {
  afterEach(() => {
    cleanupDom()
  })

  it('injects the override style tag and the sidebar iframe pointed at the resolved URL', () => {
    runBookmarklet()
    const frame = document.getElementById('kong-customizer-sidebar')
    expect(frame).toBeTruthy()
    expect(frame.tagName).toBe('IFRAME')
    expect(frame.src.startsWith(FRAME_SRC)).toBe(true)
    expect(document.getElementById('kong-design-token-overrides')).toBeTruthy()
  })

  it('applies CSS from a kui-token-override message whose origin matches the iframe src', () => {
    runBookmarklet()
    const frameOrigin = new URL(document.getElementById('kong-customizer-sidebar').src).origin

    window.dispatchEvent(new MessageEvent('message', {
      origin: frameOrigin,
      data: { type: 'kui-token-override', css: ':root { --x: 1px; }', src: 'https://sandbox.example.com/state' },
    }))

    expect(document.getElementById('kong-design-token-overrides').textContent).toBe(':root { --x: 1px; }')
  })

  it('ignores a kui-token-override message from an origin other than the sidebar iframe', () => {
    runBookmarklet()

    window.dispatchEvent(new MessageEvent('message', {
      origin: 'https://evil.example.com',
      data: { type: 'kui-token-override', css: ':root { --x: 999px; }' },
    }))

    expect(document.getElementById('kong-design-token-overrides').textContent).toBe('')
  })

  it('ignores a kui-close message from an untrusted origin (does not remove the sidebar)', () => {
    runBookmarklet()

    window.dispatchEvent(new MessageEvent('message', {
      origin: 'https://evil.example.com',
      data: { type: 'kui-close' },
    }))

    expect(document.getElementById('kong-customizer-sidebar')).toBeTruthy()
  })

  it('removes the sidebar on a kui-close message from the trusted iframe origin', () => {
    runBookmarklet()
    const frameOrigin = new URL(document.getElementById('kong-customizer-sidebar').src).origin

    window.dispatchEvent(new MessageEvent('message', {
      origin: frameOrigin,
      data: { type: 'kui-close' },
    }))

    expect(document.getElementById('kong-customizer-sidebar')).toBeNull()
  })

  it('toggles (hides) the existing sidebar on a second click instead of creating a duplicate', () => {
    runBookmarklet()
    runBookmarklet()

    const frames = document.querySelectorAll('#kong-customizer-sidebar')
    expect(frames).toHaveLength(1)
    expect(frames[0].style.display).toBe('none')
  })
})
