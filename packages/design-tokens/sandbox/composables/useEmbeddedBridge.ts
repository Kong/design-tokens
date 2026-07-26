import { onMounted, watch } from 'vue'
import type { Ref } from 'vue'

/** Options for the embedded (bookmarklet sidebar) postMessage bridge. */
interface EmbeddedBridgeOptions {
  /** True when running inside the bookmarklet iframe. */
  isEmbedded: boolean
  /** Reactive CSS string to post to the host page. */
  css: Ref<string>
  /** Optional builder for the message `src` field (may be async); defaults to `window.location.href`. */
  buildSrc?: () => string | Promise<string>
}

/**
 * Bridges an embedded sandbox mode to the host page via the `kui-token-override`
 * postMessage contract that the bookmarklet listens for. Posts the current CSS on
 * mount and whenever `css` changes; `close()` asks the bookmarklet to remove the
 * sidebar. No-op posting when not embedded.
 */
export function useEmbeddedBridge(opts: EmbeddedBridgeOptions) {
  /** Posts the current CSS (and computed src) to the parent window. */
  async function post() {
    if (!opts.isEmbedded) return
    const css = opts.css.value
    const src = opts.buildSrc ? await opts.buildSrc() : window.location.href
    window.parent.postMessage({ type: 'kui-token-override', css, src }, '*')
  }

  /** Asks the bookmarklet to remove the sidebar iframe. */
  function close() {
    window.parent.postMessage({ type: 'kui-close' }, '*')
  }

  if (opts.isEmbedded) {
    onMounted(post)
    watch(opts.css, post)
  }

  return { post, close }
}
