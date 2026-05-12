import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { ALL_ENTRIES } from './useTokens'
import { getHashParam } from '../lib/hashRouteQuery'

/**
 * One entry in the breakpoint preset list.
 * `height` is set for device-simulation presets (phone, mobile…) and absent for desktop.
 */
export interface BreakpointPreset {
  /** Short label, e.g. "phone", "mobile", "desktop" */
  label: string
  /** Viewport width in px */
  width: number
  /** Simulated viewport height in px; undefined = fill available panel height (desktop) */
  height?: number
}

/**
 * Which injection strategy is in use.
 * Selected at module load time based on `import.meta.env.DEV`.
 */
export type PreviewMode = 'iframe-proxy' | 'bookmarklet-popup'

/** Current state of the preview bridge connection. */
export type ConnectionStatus = 'idle' | 'loading' | 'connected' | 'error'

/** Typical device heights for each breakpoint label, used for device simulation. */
const PRESET_HEIGHTS: Record<string, number | undefined> = {
  phone: 844,
  mobile: 844,
  phablet: 1024,
  tablet: 900,
  laptop: 768,
  // desktop: undefined — fills the available panel height
}

/**
 * Mode-aware composable that bridges the customizer's token overrides to an external page.
 *
 * - **`iframe-proxy`** (dev only): loads the target URL through the Vite `/preview-proxy`
 *   middleware, making it same-origin so `contentDocument` injection works directly.
 *   The proxied page sends a `kui-frame-ready` postMessage on every load, which triggers
 *   a CSS push via `kui-inject-css` — this is the primary injection path and survives
 *   in-frame navigation reliably.
 * - **`bookmarklet-popup`** (hosted): opens the target URL in a popup; the designer clicks
 *   a bookmarklet on that page which sets up a `postMessage` listener and pings us back.
 *
 * @param overridesCss - Reactive string containing the full `:root { … }` override block.
 */
export function usePreviewBridge(overridesCss: Ref<string>) {
  // DEV → iframe proxy; production → bookmarklet popup.
  // ?preview=bookmarklet forces bookmarklet mode on dev for local testing.
  const forceBookmarklet = typeof window !== 'undefined' && getHashParam('preview') === 'bookmarklet'
  const mode: PreviewMode = (!import.meta.env.DEV || forceBookmarklet) ? 'bookmarklet-popup' : 'iframe-proxy'

  const previewUrl = ref('')
  const loadedUrl = ref('')
  const connectedOrigin = ref<string | null>(null)
  const status = ref<ConnectionStatus>('idle')
  /** Current simulated viewport width; 0 = not yet measured (set by CustPreviewPanel). */
  const viewportWidth = ref(0)
  /** Simulated viewport height; undefined = fill panel height (desktop default). */
  const viewportHeight = ref<number | undefined>(undefined)
  const iframeEl = ref<HTMLIFrameElement | null>(null)

  /**
   * Breakpoint presets: "phone" (390 px) prepended before token-derived breakpoints.
   * Heights come from PRESET_HEIGHTS; desktop has no height constraint.
   */
  const breakpointPresets = computed<BreakpointPreset[]>(() => {
    const tokenPresets = ALL_ENTRIES
      .filter((e) => e.category === 'breakpoint')
      .map((e) => {
        const label = e.cssVar.replace('--kui-breakpoint-', '')
        return { label, width: parseInt(e.value, 10), height: PRESET_HEIGHTS[label] }
      })
      .filter((p) => !isNaN(p.width))
      .sort((a, b) => a.width - b.width)

    return [{ label: 'phone', width: 390, height: 844 }, ...tokenPresets]
  })

  // ─── Path A helpers (iframe-proxy) ────────────────────────────────────────

  /** Builds the Vite same-origin proxy URL for a given target. */
  function proxyUrl(target: string): string {
    return `/preview-proxy?url=${encodeURIComponent(target)}`
  }

  /** Initiates loading the target URL in the iframe via the proxy. */
  function loadProxyUrl() {
    if (!previewUrl.value) return
    status.value = 'loading'
    loadedUrl.value = previewUrl.value
  }

  /**
   * Pushes the current override CSS into the proxied iframe via `postMessage`.
   * The proxied page's injected script listens for `kui-inject-css` and writes it to
   * the `<style id="kong-design-token-overrides">` tag. Preferred over direct `contentDocument`
   * access because it works reliably across all navigation events.
   */
  function sendCssToFrame() {
    const win = iframeEl.value?.contentWindow
    if (!win) return
    win.postMessage({ type: 'kui-inject-css', css: overridesCss.value }, '*')
  }

  /**
   * Direct DOM injection fallback — updates the style tag via `contentDocument`.
   * Same-origin access is guaranteed by the proxy middleware.
   * Called alongside `sendCssToFrame` for belt-and-suspenders reliability.
   * Returns false if the frame is cross-origin (proxy failure) so callers can react.
   */
  function injectIntoIframe(): boolean {
    try {
      const doc = iframeEl.value?.contentDocument
      if (!doc) return false
      let s = doc.getElementById('kong-design-token-overrides') as HTMLStyleElement | null
      if (!s) {
        s = doc.createElement('style')
        s.id = 'kong-design-token-overrides'
        ;(doc.head ?? doc.documentElement).appendChild(s)
      }
      s.textContent = overridesCss.value
      return true
    } catch {
      // Cross-origin access denied — proxy failed to make the frame same-origin
      status.value = 'error'
      return false
    }
  }

  /** Called by Vue's `@load` binding — belt-and-suspenders alongside the postMessage path. */
  function onIframeLoad() {
    if (!loadedUrl.value) return
    // A successful injection means the proxy made the frame same-origin
    if (injectIntoIframe()) {
      status.value = 'connected'
    } else {
      // contentDocument inaccessible — proxy didn't serve the frame or returned cross-origin content
      status.value = 'error'
    }
  }

  // ─── Path B helpers (bookmarklet-popup) ────────────────────────────────────

  /**
   * Opens the target URL in a named tab so repeat clicks re-focus rather than
   * open new tabs. Connection is established separately when the user clicks the
   * bookmarklet on that page, which injects bridge.html as a relay iframe.
   */
  function openPopup() {
    if (!previewUrl.value) return
    window.open(previewUrl.value, 'kui-preview-target')
    loadedUrl.value = previewUrl.value
    connectedOrigin.value = null
    status.value = 'idle'
  }

  /**
   * Message handler for the iframe-proxy channel only.
   * `kui-frame-ready` is fired by the proxied page script on every page load.
   * Bookmarklet-popup connection is handled exclusively via BroadcastChannel.
   */
  function onMessage(e: MessageEvent) {
    if (e.data?.type !== 'kui-frame-ready') return
    if (mode !== 'iframe-proxy') return
    status.value = 'connected'
    sendCssToFrame()
    injectIntoIframe()
  }

  onMounted(() => {
    window.addEventListener('message', onMessage)
  })

  onUnmounted(() => {
    window.removeEventListener('message', onMessage)
  })

  // Re-push whenever overrides change and a target is active (iframe-proxy only)
  watch(overridesCss, () => {
    if (mode === 'iframe-proxy' && loadedUrl.value) {
      sendCssToFrame()
      injectIntoIframe()
    }
  })

  return {
    mode,
    previewUrl,
    loadedUrl,
    connectedOrigin,
    status,
    viewportWidth,
    viewportHeight,
    iframeEl,
    breakpointPresets,
    loadProxyUrl,
    openPopup,
    onIframeLoad,
    proxyUrl,
  }
}
