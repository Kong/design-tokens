<template>
  <div class="preview-panel">
    <!-- URL bar (iframe-proxy / dev only) -->
    <div
      v-if="bridge.mode === 'iframe-proxy'"
      class="preview-url-bar"
    >
      <svg
        aria-hidden="true"
        class="url-icon"
        fill="none"
        height="13"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
        width="13"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
        />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
      <input
        v-model="bridge.previewUrl.value"
        aria-label="Preview URL"
        class="url-input"
        placeholder="https://your-app.com"
        type="url"
        @keydown.enter="handleLoad"
      >
      <button
        :class="['url-btn', { 'url-btn--loading': bridge.status.value === 'loading' }]"
        :disabled="!bridge.previewUrl.value || bridge.status.value === 'loading'"
        @click="handleLoad"
      >
        <template v-if="bridge.status.value === 'loading'">
          <svg
            class="url-btn-spinner"
            fill="none"
            height="12"
            stroke="currentColor"
            stroke-width="2.5"
            viewBox="0 0 24 24"
            width="12"
          >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
          Loading…
        </template>
        <template v-else>
          {{ bridge.mode === 'iframe-proxy' ? 'Load' : 'Open →' }}
        </template>
      </button>
    </div>

    <!-- Viewport controls (iframe-proxy / dev only) -->
    <div
      v-if="bridge.mode === 'iframe-proxy'"
      class="preview-controls"
    >
      <div class="bp-group">
        <button
          v-for="preset in bridge.breakpointPresets.value"
          :key="preset.label"
          :aria-pressed="bridge.viewportWidth.value === preset.width"
          :class="['bp-btn', { 'bp-btn--active': bridge.viewportWidth.value === preset.width }]"
          :title="preset.width === 0 ? 'Full available width' : preset.height ? `${preset.width}×${preset.height}px` : `${preset.width}px`"
          @click="() => { bridge.viewportWidth.value = preset.width; bridge.viewportHeight.value = preset.height }"
        >
          {{ preset.label }}
        </button>
      </div>
    </div>

    <!-- Inject settings -->
    <div class="inject-settings">
      <!-- Custom selector input -->
      <div class="inject-selector-wrap">
        <label
          class="inject-selector-label"
          for="inject-selector"
        >
          Selector
        </label>
        <input
          id="inject-selector"
          v-model="customSelector"
          class="inject-selector-input"
          placeholder=":root"
          spellcheck="false"
          type="text"
        >
        <!-- CSS-only tooltip -->
        <span class="inject-tip-wrap">
          <span
            aria-label="About selector"
            class="inject-tip-icon"
            tabindex="0"
          >?</span>
          <span
            class="inject-tip-body"
            role="tooltip"
          >
            Override which CSS selector receives the token variables. Example: <br><code>:root[data-portal-color-mode="light"]</code>
          </span>
        </span>
      </div>

      <span class="inject-mode-note">All {{ allTokensCount }} tokens injected</span>
    </div>

    <!-- Mode A: iframe preview (dev only) -->
    <template v-if="bridge.mode === 'iframe-proxy'">
      <!-- Persistent container measured by ResizeObserver for "full width" shortcut -->
      <div
        ref="frameOuterEl"
        class="preview-frame-outer"
      >
        <div
          v-if="bridge.loadedUrl.value"
          class="preview-frame-chrome"
          :style="{
            width: (bridge.viewportWidth.value || containerWidth) + 'px',
            ...(bridge.viewportHeight.value ? { height: bridge.viewportHeight.value + 'px' } : {}),
          }"
        >
          <!-- Traffic-light dots only — URL shown in the input bar above -->
          <div class="chrome-bar">
            <span class="chrome-dot chrome-dot--close" />
            <span class="chrome-dot chrome-dot--min" />
            <span class="chrome-dot chrome-dot--max" />
          </div>
          <iframe
            :ref="setIframeRef"
            class="preview-iframe"
            referrerpolicy="no-referrer"
            :src="bridge.proxyUrl(bridge.loadedUrl.value)"
            title="Token preview"
            @load="bridge.onIframeLoad()"
          />
        </div>

        <!-- Empty state before a URL is entered -->
        <div
          v-else
          class="preview-empty"
        >
          <svg
            fill="none"
            height="52"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.25"
            viewBox="0 0 24 24"
            width="52"
          >
            <!-- browser frame -->
            <rect
              height="18"
              rx="2"
              width="22"
              x="1"
              y="3"
            />
            <!-- toolbar divider -->
            <line
              x1="1"
              x2="23"
              y1="8"
              y2="8"
            />
            <!-- url bar placeholder -->
            <rect
              fill="currentColor"
              fill-opacity="0.2"
              height="2.5"
              rx="1.25"
              stroke="none"
              width="10"
              x="7"
              y="4.75"
            />
            <!-- back/forward button dots -->
            <circle
              cx="3.5"
              cy="5.5"
              fill="currentColor"
              r="0.7"
              stroke="none"
            />
            <circle
              cx="5.5"
              cy="5.5"
              fill="currentColor"
              r="0.7"
              stroke="none"
            />
          </svg>
          <p>Enter a URL above to preview your tokens live</p>
          <p class="preview-empty-note">
            Rendered through the dev proxy — pages load unauthenticated
          </p>
        </div>
      </div>

      <!-- Status bar -->
      <div
        v-if="bridge.loadedUrl.value"
        class="preview-status"
      >
        <span :class="['status-dot', `status-dot--${bridge.status.value}`]" />
        <span class="status-label">{{ statusLabel }}</span>
        <span class="status-note">via dev proxy · unauthenticated</span>
      </div>
    </template>

    <!-- Mode B: bookmarklet sidebar (hosted) -->
    <template v-else>
      <div class="bookmarklet-card">
        <p class="bookmarklet-heading">
          One-time setup
        </p>
        <div
          v-if="isLocalhost"
          class="bookmarklet-localhost-warning"
        >
          <strong>Local build detected.</strong> This bookmarklet is baked with
          <code>{{ currentOrigin }}</code> and will only work on this machine.
          Deploy to a public URL to get a sharable bookmarklet.
        </div>
        <!-- Drag-to-bookmark link — @click.prevent stops in-page navigation -->
        <a
          class="bookmarklet-link"
          :href="bookmarkletHref"
          @click.prevent
        >
          🔖 Token Customizer
        </a>
        <a
          class="bookmarklet-link"
          :href="themeBuilderBookmarkletHref"
          @click.prevent
        >
          🎨 Theme Builder
        </a>
        <ol class="bookmarklet-steps">
          <li>Drag the link above to your browser's bookmarks bar</li>
          <li>(You no longer need this page open in your browser)</li>
          <li>Navigate to your target page</li>
          <li>Click the bookmarklet while visiting the target page — a token editor sidebar opens on that page</li>
        </ol>
        <p class="bookmarklet-note">
          The sidebar injects a customizer directly on the target page.
          Token overrides apply live — no app changes needed.
        </p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { usePreviewBridge } from '@/composables/usePreviewBridge'
import { BOOKMARKLET_TEMPLATE } from '@/utils/preview-bookmarklet'
import { getHashParam, setHashParams } from '@/utils/hashRouteQuery'
import { applySelector } from '@/utils/cssUtils'

const props = defineProps<{
  /** Complete `:root { … }` block with all tokens (overrides applied). */
  allTokensCss: string
  /**
   * CSS selector to scope token injection (e.g. `[data-theme="dark"]`).
   * Empty string means `:root`. Owned by parent; synced to `?selector=` URL param here.
   */
  customSelector: string
}>()

const emit = defineEmits<{
  'update:customSelector': [value: string]
}>()

// Local writable alias so the template v-model binding works without prop mutation.
const customSelector = computed({
  get: () => props.customSelector,
  set: (v) => emit('update:customSelector', v),
})

/** Total token count derived from the full export CSS line count (for the badge). */
const allTokensCount = computed(() => {
  const m = props.allTokensCss.match(/^\s+--/gm)
  return m ? m.length : 0
})

/** The CSS actually injected into the iframe: all tokens, with the selector applied. */
const effectiveCss = computed(() => applySelector(props.allTokensCss, customSelector.value))

const bridge = usePreviewBridge(effectiveCss)
/**
 * Bookmarklet href computed at runtime so `__CUSTOMIZER_URL__` resolves to the actual
 * deployment origin (works for both localhost dev and GitHub Pages).
 */
const bookmarkletHref = (() => {
  const customizerUrl = `${window.location.origin}${import.meta.env.BASE_URL}#/customize?embedded=1`
  return `javascript:${encodeURIComponent(BOOKMARKLET_TEMPLATE.replace(/__CUSTOMIZER_URL__/g, customizerUrl).replace(/__STORAGE_NS__/g, 'customizer'))}`
})()

/** Theme Builder bookmarklet href — same template, embedded theme-builder route. */
const themeBuilderBookmarkletHref = (() => {
  const themeBuilderUrl = `${window.location.origin}${import.meta.env.BASE_URL}#/theme-builder?embedded=1`
  return `javascript:${encodeURIComponent(BOOKMARKLET_TEMPLATE.replace(/__CUSTOMIZER_URL__/g, themeBuilderUrl).replace(/__STORAGE_NS__/g, 'theme-builder'))}`
})()

/** True when serving from localhost — bookmarklet baked with a local URL won't work on external sites. */
const isLocalhost = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname)
const currentOrigin = window.location.origin

/** Writes `selector` and `url` params to the address bar, removing them at defaults. */
function syncUrlParams() {
  const sel = customSelector.value.trim()
  setHashParams({
    selector: (sel && sel !== ':root') ? sel : null,
    url: bridge.loadedUrl.value || null,
  })
}

watch(customSelector, syncUrlParams)
watch(bridge.loadedUrl, syncUrlParams)

/** Ref to the outer scrollable frame container — used to measure available width. */
const frameOuterEl = ref<HTMLDivElement | null>(null)
/** Measured usable width of the frame container (updated by ResizeObserver). */
const containerWidth = ref(1280)

let containerObserver: ResizeObserver | undefined

onMounted(() => {
  // Restore preview URL from the ?url= param and auto-load it in dev (iframe proxy) mode.
  // In hosted (bookmarklet) mode we only pre-fill the input — the popup requires a user gesture.
  const savedUrl = getHashParam('url')
  if (savedUrl) {
    bridge.previewUrl.value = savedUrl
    if (bridge.mode === 'iframe-proxy') bridge.loadProxyUrl()
  }

  if (!frameOuterEl.value) return
  containerObserver = new ResizeObserver((entries) => {
    const w = entries[0]?.contentRect?.width ?? 0
    if (w > 0) {
      containerWidth.value = Math.floor(w - 24) // subtract 24px horizontal padding (12px each side)
    }
  })
  containerObserver.observe(frameOuterEl.value)
})

onUnmounted(() => containerObserver?.disconnect())

/** Function ref: wires the iframe DOM element directly into the bridge. */
function setIframeRef(el: Element | ComponentPublicInstance | null) {
  bridge.iframeEl.value = el as HTMLIFrameElement | null
}


/** Human-readable status string shown in the preview toolbar. */
const statusLabel = computed(() => {
  switch (bridge.status.value) {
    case 'loading': return 'Loading…'
    case 'connected': return 'Loaded'
    case 'error': return 'Failed — page may require auth or block framing'
    default: return ''
  }
})

/** Dispatches to the correct load strategy based on the current preview mode. */
function handleLoad() {
  if (bridge.mode === 'iframe-proxy') {
    bridge.loadProxyUrl()
  } else {
    bridge.openPopup()
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.preview-panel {
  background: $tb-bg;
  display: flex;
  flex-direction: column;
  height: 100%;
}

// URL bar────
.preview-url-bar {
  align-items: center;
  background: $tb-surface;
  border-bottom: 1px solid $tb-border;
  display: flex;
  gap: 6px;
  padding: 10px 12px;
  position: sticky;
  top: 0;
  z-index: 5;

  .url-icon {
    color: $tb-text-muted;
    flex-shrink: 0;
  }
}

.url-input {
  background: $tb-bg;
  border: 1px solid $tb-border;
  border-radius: 5px;
  color: $tb-text;
  flex: 1;
  font-family: $tb-mono;
  font-size: 12px;
  min-width: 0;
  outline: none;
  padding: 5px 10px;

  &::placeholder { color: $tb-text-muted; }

  &:focus-visible { border-color: $tb-accent; }
}

.url-btn {
  align-items: center;
  background: $tb-accent;
  border: none;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  gap: 5px;
  padding: 5px 12px;
  transition: opacity 0.12s;
  white-space: nowrap;

  &:disabled { cursor: default; opacity: 0.4; }

  &:hover:not(:disabled) { opacity: 0.85; }

  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 2px; }

  &--loading { cursor: wait; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.url-btn-spinner {
  animation: spin 0.75s linear infinite;
  flex-shrink: 0;
}

// Viewport controls────
.preview-controls {
  align-items: center;
  background: $tb-surface;
  border-bottom: 1px solid $tb-border;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 12px;
}

.bp-group {
  background: $tb-surface-2;
  border: 1px solid $tb-border;
  border-radius: 5px;
  display: flex;
  overflow: hidden;
}

.bp-btn {
  background: none;
  border: none;
  color: $tb-text-muted;
  cursor: pointer;
  font-family: $tb-mono;
  font-size: 11px;
  font-weight: 500;
  padding: 3px 8px;
  transition: background 0.1s, color 0.1s;
  white-space: nowrap;

  &:hover:not(.bp-btn--active) { background: rgba(0, 0, 0, 0.04); color: $tb-text-dim; }

  &--active { background: $tb-accent; color: #fff; }

  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: -2px; }
}

// Inject settings───
.inject-settings {
  align-items: center;
  background: $tb-surface;
  border-bottom: 1px solid $tb-border;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 6px 12px;
}

.inject-selector-wrap {
  align-items: center;
  display: flex;
  flex: 1;
  gap: 4px;
  min-width: 0;
}

.inject-selector-label {
  color: $tb-text-muted;
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
}

.inject-selector-input {
  background: $tb-bg;
  border: 1px solid $tb-border;
  border-radius: 4px;
  color: $tb-text;
  flex: 1;
  font-family: $tb-mono;
  font-size: 11px;
  max-width: 220px;
  min-width: 80px;
  outline: none;
  padding: 3px 7px;

  &::placeholder { color: $tb-text-muted; }

  &:focus-visible { border-color: $tb-accent; }
}

.inject-tip-wrap {
  align-items: center;
  display: inline-flex;
  flex-shrink: 0;
  position: relative;
}

.inject-tip-icon {
  align-items: center;
  background: $tb-surface-2;
  border: 1px solid $tb-border;
  border-radius: 50%;
  color: $tb-text-muted;
  cursor: default;
  display: inline-flex;
  font-size: 10px;
  font-weight: 700;
  height: 16px;
  justify-content: center;
  user-select: none;
  width: 16px;

  &:hover, &:focus-visible { background: $tb-border; color: $tb-text-dim; outline: none; }
}

.inject-tip-body {
  background: $tb-text;
  border-radius: 6px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  color: $tb-bg;
  display: none;
  font-size: 11px;
  line-height: 1.55;
  padding: 10px 12px;
  pointer-events: none;
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  width: 240px;
  z-index: 100;

  // Arrow pointing up toward the icon
  &::after {
    border: 5px solid transparent;
    border-bottom-color: $tb-text;
    bottom: 100%;
    content: '';
    position: absolute;
    right: 4px;
  }

  code {
    color: rgba(255, 255, 255, 0.75);
    display: block;
    font-family: $tb-mono;
    font-size: 10px;
    margin-top: 2px;
  }

  strong { color: #fff; }
}

.inject-tip-wrap:hover .inject-tip-body,
.inject-tip-icon:focus-visible + .inject-tip-body { display: block; }

.inject-mode-note {
  color: $tb-text-muted;
  font-size: 11px;
  margin-left: auto;
  white-space: nowrap;
}

// Iframe frame area────
.preview-frame-outer {
  align-items: flex-start;
  background: $tb-surface-2;
  display: flex;
  flex: 1;
  justify-content: center;
  overflow: auto;
  padding: 12px;
  scrollbar-gutter: stable;
}

.preview-frame-chrome {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15), 0 0 0 1px $tb-border-active;
  display: flex;
  flex-direction: column;
  // Height: fill the outer container minus padding
  height: calc(100vh - var(--header-h, 57px) - 120px);
  min-height: 400px;
  // Width set dynamically via :style
  min-width: 320px;
  overflow: hidden;
}

.chrome-bar {
  align-items: center;
  background: $tb-surface-2;
  border-bottom: 1px solid $tb-border;
  display: flex;
  flex-shrink: 0;
  gap: 6px;
  padding: 8px 12px;
}

.chrome-dot {
  border-radius: 50%;
  flex-shrink: 0;
  height: 10px;
  width: 10px;

  &--close { background: #ff5f57; }

  &--min { background: #ffbd2e; }

  &--max { background: #28c840; }
}

.preview-iframe {
  border: none;
  flex: 1;
  width: 100%;
}

// Empty state────
.preview-empty {
  align-items: center;
  color: $tb-text-muted;
  display: flex;
  flex: 1;
  flex-direction: column;
  font-size: 13px;
  gap: 8px;
  justify-content: center;
  padding: 32px 20px;
  text-align: center;

  svg { margin-bottom: 4px; }
}

.preview-empty-note {
  color: $tb-text-muted;
  font-size: 11px;
  opacity: 0.7;
}

// Status bar────
.preview-status {
  align-items: center;
  background: $tb-surface;
  border-top: 1px solid $tb-border;
  display: flex;
  flex-shrink: 0;
  font-size: 11px;
  gap: 6px;
  padding: 6px 12px;
}

.status-dot {
  border-radius: 50%;
  flex-shrink: 0;
  height: 7px;
  width: 7px;

  &--idle { background: $tb-border-active; }

  &--loading { background: #f59e0b; }

  &--connected { background: $tb-success; }

  &--error { background: #ef4444; }
}

.status-label { color: $tb-text-dim; font-weight: 500; }

.status-note { color: $tb-text-muted; margin-left: auto; }

// Bookmarklet setup card─────
.bookmarklet-card {
  background: $tb-surface;
  border: 1px solid $tb-border;
  border-radius: 8px;
  margin: 16px 12px;
  padding: 16px;
}

.bookmarklet-localhost-warning {
  background: #fffbeb;
  border: 1px solid #f59e0b;
  border-radius: 5px;
  color: #92400e;
  font-size: 11px;
  line-height: 1.5;
  margin-bottom: 12px;
  padding: 8px 10px;

  strong { font-weight: 600; }

  code { background: rgba(0,0,0,0.06); border-radius: 2px; font-family: $tb-mono; padding: 0 3px; }
}

.bookmarklet-heading {
  color: $tb-text-dim;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  margin: 0 0 12px;
  text-transform: uppercase;
}

.bookmarklet-link {
  background: $tb-accent-subtle;
  border: 1px solid rgba(0, 68, 244, 0.2);
  border-radius: 6px;
  color: $tb-accent;
  cursor: grab;
  display: inline-block;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 14px;
  padding: 7px 14px;
  text-decoration: none;
  user-select: none;

  &:active { cursor: grabbing; }

  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 2px; }
}

.bookmarklet-steps {
  color: $tb-text-dim;
  font-size: 12px;
  line-height: 1.8;
  margin: 0 0 12px;
  padding-left: 20px;

  strong { color: $tb-text; }
}

.bookmarklet-note {
  color: $tb-text-muted;
  font-size: 11px;
  line-height: 1.55;
  margin: 0;

  code {
    background: $tb-surface-2;
    border-radius: 3px;
    font-family: $tb-mono;
    font-size: 10px;
    padding: 1px 4px;
  }
}

</style>
