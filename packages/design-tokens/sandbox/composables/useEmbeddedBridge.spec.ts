// @vitest-environment jsdom
import { defineComponent, h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useEmbeddedBridge } from './useEmbeddedBridge'

/**
 * `useEmbeddedBridge` calls `onMounted`, so it must run inside a real component's setup —
 * a bare composable-under-test wrapper mounted via Vue Test Utils.
 */
function mountBridge(options) {
  const css = ref(options.initialCss ?? '')
  let bridge
  const wrapper = mount(defineComponent({
    setup() {
      bridge = useEmbeddedBridge({ isEmbedded: options.isEmbedded, css, buildSrc: options.buildSrc })
      return () => h('div')
    },
  }))
  return { wrapper, css, get bridge() {
    return bridge
  } }
}

describe('useEmbeddedBridge', () => {
  let postMessageSpy

  beforeEach(() => {
    postMessageSpy = vi.spyOn(window.parent, 'postMessage').mockImplementation(() => {})
  })

  afterEach(() => {
    postMessageSpy.mockRestore()
  })

  it('does nothing on mount when not embedded', async () => {
    mountBridge({ isEmbedded: false, initialCss: '--x: 1px;' })
    await nextTick()
    expect(postMessageSpy).not.toHaveBeenCalled()
  })

  it('posts the current CSS on mount when embedded', async () => {
    mountBridge({ isEmbedded: true, initialCss: '--x: 1px;' })
    await nextTick()
    expect(postMessageSpy).toHaveBeenCalledWith(
      { type: 'kui-token-override', css: '--x: 1px;', src: window.location.href },
      '*',
    )
  })

  it('re-posts whenever the css ref changes', async () => {
    const { css } = mountBridge({ isEmbedded: true, initialCss: '--x: 1px;' })
    await nextTick()
    postMessageSpy.mockClear()

    css.value = '--x: 2px;'
    await nextTick()

    expect(postMessageSpy).toHaveBeenCalledWith(
      { type: 'kui-token-override', css: '--x: 2px;', src: window.location.href },
      '*',
    )
  })

  it('does not re-post when css changes but the bridge is not embedded', async () => {
    const { css } = mountBridge({ isEmbedded: false, initialCss: '--x: 1px;' })
    await nextTick()
    css.value = '--x: 2px;'
    await nextTick()
    expect(postMessageSpy).not.toHaveBeenCalled()
  })

  it('awaits an async buildSrc and uses its resolved value as src', async () => {
    const buildSrc = vi.fn().mockResolvedValue('https://example.com/page')
    mountBridge({ isEmbedded: true, initialCss: '--x: 1px;', buildSrc })
    await nextTick()
    await nextTick()
    expect(postMessageSpy).toHaveBeenCalledWith(
      { type: 'kui-token-override', css: '--x: 1px;', src: 'https://example.com/page' },
      '*',
    )
  })

  it('snapshots css before awaiting an async buildSrc', async () => {
    const buildSrc = vi.fn().mockResolvedValue('src')
    const { css, bridge } = mountBridge({ isEmbedded: true, initialCss: '--x: 1px;', buildSrc })
    await nextTick()
    postMessageSpy.mockClear()

    const pending = bridge.post()
    // Mutate css while buildSrc is still pending — post() already snapshotted the old value
    // before awaiting, so the message it eventually sends must use '--x: 1px;', not this.
    css.value = '--x: 999px;'
    await pending

    expect(postMessageSpy).toHaveBeenCalledWith(
      { type: 'kui-token-override', css: '--x: 1px;', src: 'src' },
      '*',
    )
  })

  it('drops a stale post that resolves after a newer post has already superseded it', async () => {
    let resolveStale
    const buildSrc = vi.fn()
      // The automatic on-mount post resolves immediately — not under test here.
      .mockResolvedValueOnce('mount-src')
      // The first manual post below stays pending until we resolve it ourselves, by which
      // point a second, newer post should have already superseded and posted.
      .mockImplementationOnce(() => new Promise((resolve) => {
        resolveStale = resolve
      }))
      .mockResolvedValueOnce('fresh-src')
    const { bridge } = mountBridge({ isEmbedded: true, initialCss: '--x: 1px;', buildSrc })
    await nextTick()
    postMessageSpy.mockClear()

    const stale = bridge.post()
    await bridge.post() // resolves first, taking the "current generation" lead
    expect(postMessageSpy).toHaveBeenCalledTimes(1)
    expect(postMessageSpy).toHaveBeenCalledWith(
      { type: 'kui-token-override', css: '--x: 1px;', src: 'fresh-src' },
      '*',
    )

    resolveStale('stale-src')
    await stale

    // The stale post must not have sent its now-superseded message.
    expect(postMessageSpy).toHaveBeenCalledTimes(1)
  })

  it('close() posts a kui-close message regardless of embedded state', () => {
    const { bridge } = mountBridge({ isEmbedded: false })
    bridge.close()
    expect(postMessageSpy).toHaveBeenCalledWith({ type: 'kui-close' }, '*')
  })
})
