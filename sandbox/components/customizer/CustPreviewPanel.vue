<template>
  <div class="preview-panel">
    <!-- ─── URL bar ─────────────────────────────────────────────────────── -->
    <div class="preview-url-bar">
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
          <svg class="url-btn-spinner" fill="none" height="12" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" width="12">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
          Loading…
        </template>
        <template v-else>{{ isDevMode ? 'Load' : 'Open →' }}</template>
      </button>
    </div>

    <!-- ─── Viewport controls ──────────────────────────────────────────── -->
    <div class="preview-controls">
      <div class="bp-group">
        <button
          v-for="preset in bridge.breakpointPresets.value"
          :key="preset.label"
          :aria-pressed="bridge.viewportWidth.value === preset.width"
          :class="['bp-btn', { 'bp-btn--active': bridge.viewportWidth.value === preset.width }]"
          :title="preset.height ? `${preset.width}×${preset.height}px` : `${preset.width}px`"
          @click="() => { bridge.viewportWidth.value = preset.width; bridge.viewportHeight.value = preset.height }"
        >
          {{ preset.label }}
        </button>
      </div>
      <!-- Custom width: inline with the preset group -->
      <div class="vp-custom">
        <input
          :value="bridge.viewportWidth.value || containerWidth"
          aria-label="Viewport width in pixels"
          class="vp-input"
          max="3840"
          min="320"
          step="1"
          type="number"
          @change="(e) => { bridge.viewportWidth.value = Number((e.target as HTMLInputElement).value); bridge.viewportHeight.value = undefined }"
        >
        <span class="vp-unit">px</span>
      </div>
    </div>

    <!-- ─── Mode A: iframe preview (dev only) ─────────────────────────── -->
    <template v-if="isDevMode">
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
            ...(bridge.viewportHeight.value ? { height: bridge.viewportHeight.value + 'px' } : {})
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
            height="32"
            opacity="0.3"
            stroke="currentColor"
            stroke-width="1"
            viewBox="0 0 24 24"
            width="32"
          >
            <rect
              height="16"
              rx="2"
              width="20"
              x="2"
              y="4"
            />
            <path d="M8 20h8M12 16v4" />
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

    <!-- ─── Mode B: bookmarklet + popup (hosted) ───────────────────────── -->
    <template v-else>
      <!-- Connected badge -->
      <div
        v-if="bridge.status.value === 'connected'"
        class="connected-badge"
      >
        <span class="status-dot status-dot--connected" />
        Connected to <strong>{{ bridge.connectedOrigin.value }}</strong>
        <span class="auth-note">Your session applies — auth'd pages work</span>
      </div>

      <!-- Setup card (shown until connected) -->
      <div
        v-else
        class="bookmarklet-card"
      >
        <p class="bookmarklet-heading">
          One-time setup
        </p>
        <!-- Drag-to-bookmark link — @click.prevent stops in-page navigation -->
        <a
          class="bookmarklet-link"
          :href="BOOKMARKLET_HREF"
          @click.prevent
        >
          🔖 Drag to bookmarks bar
        </a>
        <ol class="bookmarklet-steps">
          <li>Drag the link above to your browser's bookmarks bar</li>
          <li>Click <strong>Open →</strong> to launch your target URL</li>
          <li>In that tab, click the bookmarklet — done!</li>
        </ol>
        <p class="bookmarklet-note">
          Token overrides are sent over
          <code>postMessage</code> — no changes to your app required.
        </p>
      </div>

      <!-- Viewport note for popup mode -->
      <p
        v-if="bridge.status.value === 'connected'"
        class="popup-vp-note"
      >
        Viewport resize is best-effort — some browsers restrict popup resizing.
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { usePreviewBridge } from '@/composables/usePreviewBridge'
import { BOOKMARKLET_HREF } from '@/lib/preview-bookmarklet'

const props = defineProps<{
  /** The full :root { … } CSS block of active overrides, passed from the parent customizer. */
  overridesCss: string
}>()

// Convert prop to a computed ref so usePreviewBridge can watch it reactively
const overridesCssRef = computed(() => props.overridesCss)

const bridge = usePreviewBridge(overridesCssRef)
const isDevMode = import.meta.env.DEV

/** Ref to the outer scrollable frame container — used to measure available width. */
const frameOuterEl = ref<HTMLDivElement | null>(null)
/** Measured usable width of the frame container (updated by ResizeObserver). */
const containerWidth = ref(1280)

let containerObserver: ResizeObserver | undefined
let hasSetInitialWidth = false

onMounted(() => {
  if (!frameOuterEl.value) return
  containerObserver = new ResizeObserver((entries) => {
    const w = entries[0]?.contentRect?.width ?? 0
    if (w > 0) {
      containerWidth.value = Math.floor(w - 24) // subtract 24px horizontal padding (12px each side)
      // Default to full desktop width on first measurement
      if (!hasSetInitialWidth) {
        bridge.viewportWidth.value = containerWidth.value
        bridge.viewportHeight.value = undefined
        hasSetInitialWidth = true
      }
    }
  })
  containerObserver.observe(frameOuterEl.value)
})

onUnmounted(() => containerObserver?.disconnect())

/** Function ref: wires the iframe DOM element directly into the bridge. */
function setIframeRef(el: Element | ComponentPublicInstance | null) {
  bridge.iframeEl.value = el as HTMLIFrameElement | null
}

// Resize popup when viewportWidth changes (best-effort — browsers may block this)
watch(bridge.viewportWidth, (w) => {
  if (!isDevMode && bridge.popupWin.value) {
    const h = bridge.viewportHeight.value ?? Math.round(window.screen.height * 0.85)
    bridge.popupWin.value.resizeTo(w, h)
  }
})

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
  if (isDevMode) {
    bridge.loadProxyUrl()
  } else {
    bridge.openPopup()
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.preview-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: $tb-bg;
}

// ─── URL bar ──────────────────────────────────────────────────────────────────
.preview-url-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  background: $tb-surface;
  border-bottom: 1px solid $tb-border;
  position: sticky;
  top: 0;
  z-index: 5;

  .url-icon {
    flex-shrink: 0;
    color: $tb-text-muted;
  }
}

.url-input {
  flex: 1;
  min-width: 0;
  background: $tb-bg;
  border: 1px solid $tb-border;
  border-radius: 5px;
  padding: 5px 10px;
  font-family: $tb-mono;
  font-size: 12px;
  color: $tb-text;
  outline: none;

  &::placeholder { color: $tb-text-muted; }
  &:focus-visible { border-color: $tb-accent; }
}

.url-btn {
  background: $tb-accent;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 5px 12px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.12s;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 5px;

  &:disabled { opacity: 0.4; cursor: default; }
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

// ─── Viewport controls ────────────────────────────────────────────────────────
.preview-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: $tb-surface;
  border-bottom: 1px solid $tb-border;
  flex-wrap: wrap;
}

.bp-group {
  display: flex;
  background: $tb-surface-2;
  border: 1px solid $tb-border;
  border-radius: 5px;
  overflow: hidden;
}

.bp-btn {
  background: none;
  border: none;
  padding: 3px 8px;
  font-family: $tb-mono;
  font-size: 11px;
  font-weight: 500;
  color: $tb-text-muted;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.1s, color 0.1s;

  &:hover:not(.bp-btn--active) { background: rgba(0, 0, 0, 0.04); color: $tb-text-dim; }
  &--active { background: $tb-accent; color: #fff; }
  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: -2px; }
}


.vp-custom {
  display: flex;
  align-items: center;
  gap: 3px;
}

.vp-input {
  width: 60px;
  background: $tb-bg;
  border: 1px solid $tb-border;
  border-radius: 4px;
  padding: 3px 6px;
  font-family: $tb-mono;
  font-size: 11px;
  color: $tb-text;
  text-align: right;
  outline: none;

  &:focus-visible { border-color: $tb-accent; }
  // Remove browser spin buttons for cleaner look
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
  &[type=number] { -moz-appearance: textfield; }
}

.vp-unit {
  font-size: 11px;
  color: $tb-text-muted;
}

// ─── Iframe frame area ────────────────────────────────────────────────────────
.preview-frame-outer {
  flex: 1;
  overflow: auto;
  padding: 12px;
  background: $tb-surface-2;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.preview-frame-chrome {
  // Width set dynamically via :style
  min-width: 320px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15), 0 0 0 1px $tb-border-active;
  background: #fff;
  display: flex;
  flex-direction: column;
  // Height: fill the outer container minus padding
  height: calc(100vh - var(--header-h, 57px) - 120px);
  min-height: 400px;
}

.chrome-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: $tb-surface-2;
  border-bottom: 1px solid $tb-border;
  flex-shrink: 0;
}

.chrome-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;

  &--close { background: #ff5f57; }
  &--min   { background: #ffbd2e; }
  &--max   { background: #28c840; }
}

.preview-iframe {
  flex: 1;
  border: none;
  width: 100%;
}

// ─── Empty state ──────────────────────────────────────────────────────────────
.preview-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px 20px;
  text-align: center;
  color: $tb-text-muted;
  font-size: 13px;

  svg { margin-bottom: 4px; }
}

.preview-empty-note {
  font-size: 11px;
  color: $tb-text-muted;
  opacity: 0.7;
}

// ─── Status bar ───────────────────────────────────────────────────────────────
.preview-status {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: $tb-surface;
  border-top: 1px solid $tb-border;
  font-size: 11px;
  flex-shrink: 0;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;

  &--idle    { background: $tb-border-active; }
  &--loading { background: #f59e0b; }
  &--connected { background: $tb-success; }
  &--error   { background: #ef4444; }
}

.status-label { color: $tb-text-dim; font-weight: 500; }
.status-note  { color: $tb-text-muted; margin-left: auto; }

// ─── Connected badge (hosted mode) ────────────────────────────────────────────
.connected-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  background: rgba(5, 150, 105, 0.07);
  border-bottom: 1px solid rgba(5, 150, 105, 0.2);
  font-size: 12px;
  color: $tb-text-dim;

  strong { color: $tb-text; }
}

.auth-note {
  font-size: 11px;
  color: $tb-text-muted;
  margin-left: auto;
}

// ─── Bookmarklet setup card ────────────────────────────────────────────────────
.bookmarklet-card {
  margin: 16px 12px;
  padding: 16px;
  background: $tb-surface;
  border: 1px solid $tb-border;
  border-radius: 8px;
}

.bookmarklet-heading {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: $tb-text-dim;
  margin: 0 0 12px;
}

.bookmarklet-link {
  display: inline-block;
  background: $tb-accent-subtle;
  color: $tb-accent;
  border: 1px solid rgba(0, 68, 244, 0.2);
  border-radius: 6px;
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  cursor: grab;
  user-select: none;
  margin-bottom: 14px;

  &:active { cursor: grabbing; }
  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 2px; }
}

.bookmarklet-steps {
  margin: 0 0 12px;
  padding-left: 20px;
  font-size: 12px;
  color: $tb-text-dim;
  line-height: 1.8;

  strong { color: $tb-text; }
}

.bookmarklet-note {
  font-size: 11px;
  color: $tb-text-muted;
  margin: 0;
  line-height: 1.55;

  code {
    background: $tb-surface-2;
    border-radius: 3px;
    padding: 1px 4px;
    font-family: $tb-mono;
    font-size: 10px;
  }
}

.popup-vp-note {
  font-size: 11px;
  color: $tb-text-muted;
  padding: 8px 12px;
  margin: 0;
}
</style>
