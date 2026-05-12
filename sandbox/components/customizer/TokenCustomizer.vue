<template>
  <div class="customizer">
    <!-- Sticky header: navigation + override status + export actions -->
    <header
      ref="headerEl"
      class="cust-header"
    >
      <div class="cust-header-left">
        <router-link
          v-if="!isEmbedded"
          class="back-link"
          to="/"
        >
          ← Browse
        </router-link>
        <h1 class="cust-title">
          Token Customizer
        </h1>
        <span
          v-if="hasOverrides"
          class="override-badge"
        >
          {{ overrideCount }} override{{ overrideCount === 1 ? '' : 's' }}
        </span>
      </div>
      <div class="cust-header-right">
        <!-- "Download full" includes all tokens — useful as a standalone stylesheet -->
        <button
          class="cust-btn cust-btn--secondary"
          @click="downloadFull"
        >
          ↓ Download
        </button>
        <!-- "Copy patch" copies only overrides — paste into existing app CSS -->
        <button
          class="cust-btn"
          :disabled="!hasOverrides"
          @click="copyOverrides"
        >
          {{ copiedOverrides ? '✓ Copied' : 'Copy CSS' }}
        </button>
        <!-- Close button: only shown when running as an embedded sidebar on the target page -->
        <button
          v-if="isEmbedded"
          aria-label="Close sidebar"
          class="cust-btn cust-btn--close"
          title="Close sidebar"
          @click="closeEmbedded"
        >
          ✕
        </button>
      </div>
    </header>

    <div :class="['cust-layout', !isEmbedded && 'cust-layout--with-preview', !editorOpen && 'cust-layout--editor-collapsed']">
      <!-- Left: collapsible token editor panel (slideout) -->
      <div :class="['cust-editor', { 'cust-editor--collapsed': !editorOpen }]">
        <!-- Collapse toggle strip — hidden in embedded sidebar mode -->
        <div
          v-if="!isEmbedded"
          class="editor-toggle-strip"
        >
          <button
            :aria-expanded="editorOpen"
            :aria-label="editorOpen ? 'Collapse token editor' : 'Expand token editor'"
            class="editor-toggle-btn"
            :title="editorOpen ? 'Collapse panel' : 'Expand token editor'"
            @click="editorOpen = !editorOpen"
          >
            <!-- Double chevron: >> when collapsed (expand), << when open (collapse) -->
            <svg
              fill="none"
              height="14"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              :style="{ transform: editorOpen ? 'rotate(180deg)' : 'none' }"
              viewBox="0 0 24 24"
              width="14"
            >
              <polyline points="5 18 11 12 5 6" />
              <polyline points="12 18 18 12 12 6" />
            </svg>
          </button>
          <span
            v-if="!editorOpen"
            aria-hidden="true"
            class="editor-collapsed-label"
          >Tokens</span>
        </div>

        <!-- Editor content — hidden when panel is collapsed -->
        <div
          v-show="editorOpen"
          class="cust-editor-content"
        >
          <!-- Embedded toolbar: share link + inject settings, shown above the token list -->
          <template v-if="isEmbedded">
            <div class="embed-toolbar">
              <!-- Row 1: inject mode toggle + share link button -->
              <div class="embed-toolbar-row">
                <div class="embed-mode-group">
                  <button
                    :class="['embed-mode-btn', { 'embed-mode-btn--active': !embeddedInjectAll }]"
                    title="Inject only your changed values; the site uses its own defaults for everything else"
                    @click="embeddedInjectAll = false"
                  >
                    Overrides only
                  </button>
                  <button
                    :class="['embed-mode-btn', { 'embed-mode-btn--active': embeddedInjectAll }]"
                    title="Inject all token defaults with your overrides applied — use this if the site doesn't define these tokens"
                    @click="embeddedInjectAll = true"
                  >
                    All tokens
                  </button>
                </div>
                <button
                  class="embed-share-btn"
                  :class="{ 'embed-share-btn--copied': copiedShareLink }"
                  @click="copyShareLink"
                >
                  {{ copiedShareLink ? '✓ Link copied!' : 'Copy share link' }}
                </button>
              </div>
              <!-- Row 2: CSS selector -->
              <div class="embed-toolbar-row">
                <label
                  class="embed-selector-label"
                  for="embed-selector"
                >
                  Selector
                </label>
                <input
                  id="embed-selector"
                  v-model="embeddedSelector"
                  class="embed-selector-input"
                  placeholder=":root"
                  spellcheck="false"
                  type="text"
                >
                <span class="embed-tip-wrap">
                  <span
                    aria-label="About selector"
                    class="embed-tip-icon"
                    tabindex="0"
                  >?</span>
                  <span
                    class="embed-tip-body"
                    role="tooltip"
                  >
                    Override which CSS selector receives the token variables. Example:
                    <br><code>:root[data-portal-color-mode="light"]</code>
                  </span>
                </span>
              </div>
            </div>
          </template>

          <div class="cust-search-wrap">
            <svg
              aria-hidden="true"
              class="cust-search-icon"
              fill="none"
              height="13"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
              width="13"
            >
              <circle
                cx="11"
                cy="11"
                r="8"
              /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              ref="filterInputEl"
              v-model="localFilter"
              aria-label="Filter tokens"
              class="cust-search"
              placeholder="Filter tokens…"
              type="search"
            >
            <button
              v-if="localFilter"
              aria-label="Clear search"
              class="cust-search-clear"
              type="button"
              @click="localFilter = ''"
            >
              <svg
                fill="none"
                height="12"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="2.5"
                viewBox="0 0 24 24"
                width="12"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Filter bar: section collapse/expand + show-only-modified toggle -->
          <div class="cust-collapse-bar">
            <button
              v-if="visibleGroups.length > 1 || allCollapsed"
              class="cust-collapse-btn"
              @click="allCollapsed ? expandAll() : collapseAll()"
            >
              <!-- Same chevron SVG + size as section headers -->
              <svg
                :class="['group-chevron', { 'group-chevron--open': !allCollapsed }]"
                fill="none"
                height="14"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                viewBox="0 0 24 24"
                width="14"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
              {{ allCollapsed ? 'Expand all' : 'Collapse all' }}
            </button>
            <button
              :aria-pressed="showOnlyModified"
              :class="['cust-modified-btn', { 'cust-modified-btn--active': showOnlyModified }]"
              :disabled="!hasOverrides && !showOnlyModified"
              :title="showOnlyModified ? 'Show all tokens' : 'Show only modified tokens'"
              @click="showOnlyModified = !showOnlyModified"
            >
              {{ showOnlyModified ? `✕ Modified only (${overrideCount})` : `Show modified (${overrideCount})` }}
            </button>
            <button
              v-if="hasOverrides"
              class="cust-reset-btn"
              title="Clear all overrides"
              @click="handleResetAll"
            >
              Reset all
            </button>
          </div>

          <CustTokenGroup
            v-for="group in visibleGroups"
            :key="group.category"
            :group="group"
            :is-collapsed="!!collapsed[group.category]"
            :overrides="overrides"
            @change="(cssVar, value, defaultValue) => setOverride(cssVar, value, defaultValue)"
            @reset="(cssVar, defaultValue) => setOverride(cssVar, '', defaultValue)"
            @toggle="toggleGroup"
          />

          <div
            v-if="visibleGroups.length === 0"
            class="cust-empty"
          >
            No tokens match "{{ localFilter }}"
          </div>
        </div>
      </div>

      <!-- Center: live URL preview panel (dev: iframe proxy; hosted: bookmarklet sidebar) -->
      <div
        v-if="!isEmbedded"
        class="cust-preview-column"
      >
        <CustPreviewPanel
          :all-tokens-css="fullExportCss"
          :overrides-css="overridesCss"
        />
      </div>

      <!-- Right: share link + override CSS output. Live preview removed in dev mode
           since the center iframe already shows the effect of token changes. -->
      <aside class="cust-aside">
        <!-- Share link: always visible, updates live as overrides change -->
        <div class="cust-share-panel">
          <div class="cust-share-label">
            <svg
              fill="none"
              height="13"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              width="13"
            >
              <circle
                cx="18"
                cy="5"
                r="3"
              />
              <circle
                cx="6"
                cy="12"
                r="3"
              />
              <circle
                cx="18"
                cy="19"
                r="3"
              />
              <line
                x1="8.59"
                x2="15.42"
                y1="13.51"
                y2="17.49"
              />
              <line
                x1="15.41"
                x2="8.59"
                y1="6.51"
                y2="10.49"
              />
            </svg>
            <span>Share customized tokens</span>
            <span
              v-if="hasOverrides"
              class="share-badge"
            >{{ overrideCount }} token{{ overrideCount === 1 ? '' : 's' }}</span>
          </div>
          <button
            class="cust-share-copy-btn"
            :class="{ 'cust-share-copy-btn--copied': copiedShareLink }"
            :title="copiedShareLink ? 'Copied!' : 'Copy share link'"
            @click="copyShareLink"
          >
            <svg
              fill="none"
              height="13"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              viewBox="0 0 24 24"
              width="13"
            >
              <rect
                height="13"
                rx="2"
                width="13"
                x="9"
                y="9"
              />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {{ copiedShareLink ? '✓ Link copied!' : 'Copy share link' }}
          </button>
          <p class="cust-share-hint">
            Your token overrides are encoded directly in the URL. Bookmark or paste the link
            anywhere. Opening it later restores your exact customizations.
          </p>
        </div>

        <!-- CSS output: shows only the override patch, with inline copy -->
        <div class="cust-output-panel">
          <div class="cust-output-header">
            <span class="cust-output-label">{{ hasOverrides ? 'Override patch CSS' : 'No overrides yet' }}</span>
            <button
              v-if="hasOverrides"
              class="cust-copy-icon"
              :title="copiedOverrides ? 'Copied!' : 'Copy CSS'"
              @click="copyOverrides"
            >
              {{ copiedOverrides ? '✓' : '⎘' }}
            </button>
          </div>
          <pre class="cust-output-code"><code>{{ hasOverrides ? overridesCss : placeholderCss }}</code></pre>
          <p
            v-if="hasOverrides"
            class="cust-output-hint"
          >
            Paste this into your app CSS to override the default tokens.
          </p>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useTokenCustomizer } from '@/composables/useTokenCustomizer'
import { useClipboard } from '@/composables/useClipboard'
import { useHeaderHeight } from '@/composables/useHeaderHeight'
import { useSearchShortcut } from '@/composables/useSearchShortcut'
import { getHashParam, setHashParams } from '@/lib/hashRouteQuery'
import CustTokenGroup from './CustTokenGroup.vue'
import CustPreviewPanel from './CustPreviewPanel.vue'

/** True when the customizer is loaded as an embedded sidebar by the bookmarklet. */
const isEmbedded = getHashParam('embedded') === '1'

/** Whether to inject all tokens or only overrides. Only active in embedded mode. */
const embeddedInjectAll = ref(getHashParam('inject') === 'all')
/** CSS selector to use in place of `:root`. Only active in embedded mode. */
const embeddedSelector = ref(getHashParam('selector') ?? '')

function applySelector(css: string, sel: string): string {
  const s = sel.trim()
  if (!css || !s || s === ':root') return css
  return css.replace(/^:root\b/m, s)
}

/** Effective CSS posted to the parent page in embedded mode. */
const embeddedEffectiveCss = computed(() => {
  const base = embeddedInjectAll.value ? fullExportCss.value : overridesCss.value
  return applySelector(base, embeddedSelector.value)
})

/** Controls whether the token editor panel is expanded (true) or collapsed to a narrow strip. */
const editorOpen = ref(true)

const {
  overrides,
  overrideCount,
  hasOverrides,
  filterQuery,
  showOnlyModified,
  collapsed,
  allCollapsed,
  visibleGroups,
  toggleGroup,
  collapseAll,
  expandAll,
  setOverride,
  resetAll,
  overridesCss,
  fullExportCss,
  shareUrl,
} = useTokenCustomizer()

// nextTick ensures all pending Vue watchers (including useTokenCustomizer's `overrides`
// watcher that writes the `?o=` param) have flushed before we read window.location.href.
// Without this, the first push after mount sends a src URL that's missing `?o=`.
async function postEmbeddedCss() {
  await nextTick()
  if (isEmbedded) {
    setHashParams({
      selector: (embeddedSelector.value.trim() && embeddedSelector.value.trim() !== ':root')
        ? embeddedSelector.value.trim() : null,
      inject: embeddedInjectAll.value ? 'all' : null,
    })
  }
  window.parent.postMessage({
    type: 'kui-token-override',
    css: embeddedEffectiveCss.value,
    src: window.location.href,
  }, '*')
}

if (isEmbedded) {
  onMounted(postEmbeddedCss)
  watch(embeddedEffectiveCss, postEmbeddedCss)
}

/** Tells the bookmarklet on the target page to remove the sidebar iframe. */
async function closeEmbedded() {
  await postEmbeddedCss() // flush latest state to sessionStorage before iframe is removed
  window.parent.postMessage({ type: 'kui-close' }, '*')
}

const headerEl = ref<HTMLElement | null>(null)
useHeaderHeight(headerEl)

const filterInputEl = ref<HTMLInputElement | null>(null)
useSearchShortcut(filterInputEl)

const { copyText } = useClipboard()

// Debounced filter: localFilter drives the input display; filterQuery drives the computed list
const localFilter = ref('')
let filterDebounce: ReturnType<typeof setTimeout>
watch(localFilter, (val) => {
  clearTimeout(filterDebounce)
  filterDebounce = setTimeout(() => {
    filterQuery.value = val
  }, 300)
})

const copiedOverrides = ref(false)
const copiedShareLink = ref(false)
let resetOverridesTimer: ReturnType<typeof setTimeout>
let resetShareTimer: ReturnType<typeof setTimeout>

/** Copies the override-patch CSS to the clipboard and shows a 1.5s confirmation state. */
async function copyOverrides() {
  if (!hasOverrides.value) return
  await copyText(overridesCss.value, 'overrides-patch')
  copiedOverrides.value = true
  clearTimeout(resetOverridesTimer)
  resetOverridesTimer = setTimeout(() => {
    copiedOverrides.value = false
  }, 1500)
}

/** Copies the reactive share URL (with encoded overrides) to the clipboard. */
async function copyShareLink() {
  await copyText(shareUrl.value, 'share-link')
  copiedShareLink.value = true
  clearTimeout(resetShareTimer)
  resetShareTimer = setTimeout(() => {
    copiedShareLink.value = false
  }, 1500)
}

/** Triggers a browser download of the full token CSS with all overrides applied. */
function downloadFull() {
  const blob = new Blob([fullExportCss.value], { type: 'text/css' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'kong-design-tokens.css'
  a.click()
  URL.revokeObjectURL(url)
}

/** Confirms with the user before clearing all overrides to prevent accidental resets. */
function handleResetAll() {
  if (!window.confirm('Reset all overrides? This will restore every token to its default value.')) return
  resetAll()
}

const placeholderCss = ':root {\n  /* Edit tokens on the left\n     to see your overrides here */\n}'

// Warn before in-app navigation (Vue Router)
onBeforeRouteLeave(() => {
  if (hasOverrides.value && !window.confirm('You have unsaved token overrides. Leave and lose them?')) {
    return false
  }
})

// Warn before browser refresh / tab close (suppressed in embedded sidebar mode)
function handleBeforeUnload(e: BeforeUnloadEvent) {
  if (!hasOverrides.value) return
  e.preventDefault()
  e.returnValue = ''
}
if (!isEmbedded) {
  onMounted(() => window.addEventListener('beforeunload', handleBeforeUnload))
  onUnmounted(() => window.removeEventListener('beforeunload', handleBeforeUnload))
}
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.customizer {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: $tb-bg;
  color: $tb-text;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

// ─── Header ───────────────────────────────────────────────────────────────────
.cust-header {
  flex-shrink: 0;
  z-index: 20;
  background: $tb-surface;
  border-bottom: 1px solid $tb-border;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.cust-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-link {
  font-size: 13px;
  font-weight: 500;
  color: $tb-accent;
  text-decoration: none;
  border-radius: 3px;

  &:hover { text-decoration: underline; }
  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 3px; }
}

.cust-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: $tb-text;
}

.override-badge {
  font-size: 12px;
  background: $tb-accent-subtle;
  color: $tb-accent;
  border-radius: 10px;
  padding: 2px 8px;
  font-weight: 500;
}

.cust-header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.cust-btn {
  background: $tb-accent;
  color: #fff;
  border: 1px solid $tb-accent;
  border-radius: 5px;
  padding: 5px 12px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.12s;

  &:disabled { opacity: 0.4; cursor: default; }
  &:hover:not(:disabled) { opacity: 0.85; }
  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 2px; }

  &--secondary {
    background: $tb-surface;
    color: $tb-text-dim;
    border-color: $tb-border-active;
  }

  &--close {
    background: $tb-surface;
    color: $tb-text-muted;
    border-color: $tb-border-active;
    padding: 5px 9px;

    &:hover:not(:disabled) { background: rgba(239, 68, 68, 0.08); color: #ef4444; border-color: rgba(239, 68, 68, 0.3); opacity: 1; }
  }
}

// ─── Layout ───────────────────────────────────────────────────────────────────
.cust-layout {
  display: grid;
  grid-template-columns: 1fr;
  flex: 1;
  min-height: 0; // allow flex child to shrink below content height

  @media (min-width: 900px) {
    // Two-column default: editor | aside
    grid-template-columns: 1fr minmax(360px, 360px);
    .cust-preview-column { display: none; }
  }

  // Three-column mode: editor open
  &--with-preview {
    @media (min-width: 1080px) {
      grid-template-columns: minmax(540px, 540px) 1fr minmax(360px, 360px);
      transition: grid-template-columns 0.2s ease;
      .cust-preview-column { display: flex; }
    }
  }

  // Three-column mode: editor collapsed (narrow strip)
  &--with-preview.cust-layout--editor-collapsed {
    @media (min-width: 1080px) {
      grid-template-columns: 40px 1fr minmax(360px, 360px);
    }
  }

  // All direct column children fill the row height and scroll independently
  > * {
    height: 100%;
    min-height: 0;
    overflow-y: auto;
  }
}

// ─── Preview column ───────────────────────────────────────────────────────────
.cust-preview-column {
  display: none;
  flex-direction: column;
  border-right: 1px solid $tb-border;
  overflow: hidden; // preview panel manages its own scroll
}

// ─── Editor panel ─────────────────────────────────────────────────────────────
.cust-editor {
  border-right: 1px solid $tb-border;
  display: flex;
  flex-direction: row;
  min-width: 0;
  overflow: hidden !important; // inner .cust-editor-content handles its own scroll

  &--collapsed {
    // In collapsed state the grid column is 40px; hide all content except the strip
    .cust-editor-content { display: none; }
  }
}

// Narrow strip containing the toggle button (always visible regardless of open/closed)
.editor-toggle-strip {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 0 0;
  flex-shrink: 0;
  width: 40px;
  border-right: 1px solid $tb-border;
  background: $tb-surface;
}

.editor-toggle-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  color: $tb-text-muted;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;

  svg { transition: transform 0.2s ease; }
  &:hover { background: $tb-surface-2; color: $tb-text-dim; }
  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 2px; }
}

.editor-collapsed-label {
  margin-top: 12px;
  font-size: 11px;
  font-weight: 600;
  color: $tb-text-muted;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  user-select: none;
}

// Scrollable content within the editor strip
.cust-editor-content {
  flex: 1;
  min-width: 0;
  overflow-y: scroll;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

.cust-search-wrap {
  position: sticky;
  top: 0;
  z-index: 10;
  background: $tb-surface;
  padding: 12px 16px;
  border-bottom: 1px solid $tb-border;
}

.cust-search-icon {
  position: absolute;
  left: 28px;
  top: 50%;
  transform: translateY(-50%);
  color: $tb-text-muted;
  pointer-events: none;
}

.cust-search {
  width: 100%;
  background: $tb-bg;
  border: 1px solid $tb-border;
  border-radius: 5px;
  padding: 6px 28px 6px 28px;
  font-family: inherit;
  font-size: 13px;
  color: $tb-text;
  outline: none;
  box-sizing: border-box;

  &::placeholder { color: $tb-text-muted; }
  &:focus-visible { border-color: $tb-accent; }
  // Hide the browser-native clear button — we use our own
  &::-webkit-search-cancel-button { display: none; }
}

.cust-search-clear {
  position: absolute;
  right: 28px;
  top: 50%;
  transform: translateY(-50%);
  background: $tb-surface-2;
  border: 1px solid $tb-border;
  border-radius: 3px;
  color: $tb-text-muted;
  cursor: pointer;
  padding: 2px 3px;
  display: flex;
  align-items: center;
  line-height: 1;

  &:hover { background: $tb-border; color: $tb-text; }
  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 1px; }
}

.cust-empty {
  padding: 40px 20px;
  text-align: center;
  color: $tb-text-muted;
  font-size: 14px;
}

// ─── Embedded toolbar (share + inject settings) ───────────────────────────────
.embed-toolbar {
  background: $tb-surface;
  border-bottom: 2px solid $tb-border;
}

.embed-toolbar-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 12px;
  border-bottom: 1px solid $tb-border;

  &:last-child { border-bottom: none; }
}

.embed-mode-group {
  display: flex;
  background: $tb-surface-2;
  border: 1px solid $tb-border;
  border-radius: 5px;
  overflow: hidden;
  flex-shrink: 0;
}

.embed-mode-btn {
  background: none;
  border: none;
  padding: 3px 8px;
  font-family: inherit;
  font-size: 11px;
  font-weight: 500;
  color: $tb-text-muted;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.1s, color 0.1s;

  &:hover:not(.embed-mode-btn--active) { background: rgba(0, 0, 0, 0.04); color: $tb-text-dim; }
  &--active { background: $tb-accent; color: #fff; }
  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: -2px; }
}

.embed-share-btn {
  margin-left: auto;
  background: $tb-accent;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 4px 10px;
  font-family: inherit;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.12s, background 0.15s;
  flex-shrink: 0;

  &:hover { opacity: 0.85; }
  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 2px; }
  &--copied { background: $tb-success; }
}

.embed-selector-label {
  font-size: 11px;
  font-weight: 500;
  color: $tb-text-muted;
  white-space: nowrap;
  flex-shrink: 0;
}

.embed-selector-input {
  flex: 1;
  min-width: 80px;
  background: $tb-bg;
  border: 1px solid $tb-border;
  border-radius: 4px;
  padding: 3px 7px;
  font-family: $tb-mono;
  font-size: 11px;
  color: $tb-text;
  outline: none;

  &::placeholder { color: $tb-text-muted; }
  &:focus-visible { border-color: $tb-accent; }
}

.embed-tip-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}

.embed-tip-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: $tb-surface-2;
  border: 1px solid $tb-border;
  font-size: 10px;
  font-weight: 700;
  color: $tb-text-muted;
  cursor: default;
  user-select: none;

  &:hover, &:focus-visible { background: $tb-border; color: $tb-text-dim; outline: none; }
}

.embed-tip-body {
  display: none;
  position: absolute;
  bottom: calc(100% + 6px);
  right: 0;
  width: 240px;
  background: $tb-text;
  color: $tb-bg;
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 11px;
  line-height: 1.55;
  z-index: 100;
  pointer-events: none;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    right: 4px;
    border: 5px solid transparent;
    border-top-color: $tb-text;
  }

  code {
    display: block;
    font-family: $tb-mono;
    font-size: 10px;
    color: rgba(255, 255, 255, 0.75);
    margin-top: 2px;
  }
}

.embed-tip-wrap:hover .embed-tip-body,
.embed-tip-icon:focus-visible + .embed-tip-body { display: block; }

// ─── Aside: share + output (+ live preview in hosted mode) ───────────────────
.cust-aside {
  display: flex;
  flex-direction: column;
  scrollbar-gutter: stable;
  // Height and overflow-y: auto come from the .cust-layout > * rule above
}

// ─── Share panel ──────────────────────────────────────────────────────────────
.cust-share-panel {
  background: $tb-surface;
  border-bottom: 1px solid $tb-border;
  padding: 12px 16px;
}

.cust-share-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: $tb-text-muted;
  margin-bottom: 8px;

  svg { flex-shrink: 0; }
}

.share-badge {
  background: $tb-accent-subtle;
  color: $tb-accent;
  border-radius: 8px;
  padding: 1px 6px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0;
}

.cust-share-copy-btn {
  width: 100%;
  background: $tb-accent;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  transition: opacity 0.12s, background 0.15s;
  white-space: nowrap;

  &:hover { opacity: 0.85; }
  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 2px; }
  &--copied { background: $tb-success; }
}

.cust-share-hint {
  font-size: 12px;
  color: $tb-text-muted;
  margin: 8px 0 0;
  line-height: 1.55;
}

// ─── Collapse bar ─────────────────────────────────────────────────────────────
.cust-collapse-bar {
  padding: 5px 16px;
  border-bottom: 1px solid $tb-border;
  background: $tb-surface;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 32px;
}

.cust-collapse-btn {
  background: none;
  border: none;
  font-size: 12px;
  font-weight: 600;
  color: $tb-text-muted;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: inherit;
  display: flex;
  align-items: center;
  gap: 5px;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &:hover { color: $tb-text-dim; background: $tb-surface-2; }
  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 2px; }
}

// Reuse the same chevron animation as CustTokenGroup section headers
.group-chevron {
  flex-shrink: 0;
  transition: transform 0.15s;
  color: $tb-text-muted;

  &--open { transform: rotate(90deg); }
}

.cust-modified-btn {
  background: none;
  border: 1px solid $tb-border;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
  color: $tb-text-muted;
  cursor: pointer;
  padding: 2px 8px;
  font-family: inherit;
  white-space: nowrap;
  margin-left: auto;
  transition: background 0.12s, color 0.12s, border-color 0.12s;

  &:disabled { opacity: 0.35; cursor: default; }
  &:hover:not(:disabled):not(.cust-modified-btn--active) { color: $tb-text-dim; border-color: $tb-border-active; }
  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 2px; }
  &--active {
    background: $tb-accent-subtle;
    color: $tb-accent;
    border-color: rgba(0, 68, 244, 0.25);
  }
}

.cust-reset-btn {
  background: none;
  border: 1px solid $tb-border;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
  color: #ef4444;
  cursor: pointer;
  padding: 2px 8px;
  font-family: inherit;
  white-space: nowrap;
  transition: background 0.12s, border-color 0.12s;

  &:hover { background: rgba(239, 68, 68, 0.07); border-color: rgba(239, 68, 68, 0.35); }
  &:focus-visible { outline: 2px solid #ef4444; outline-offset: 2px; }
}

// ─── Output panel ─────────────────────────────────────────────────────────────
.cust-output-panel {
  background: $tb-surface;
  border-bottom: 1px solid $tb-border;
}

.cust-output-header {
  padding: 10px 16px 8px;
  border-bottom: 1px solid $tb-border;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cust-output-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: $tb-text-muted;
}

.cust-copy-icon {
  background: none;
  border: 1px solid $tb-border;
  border-radius: 3px;
  color: $tb-text-dim;
  cursor: pointer;
  font-size: 12px;
  padding: 1px 6px;
  line-height: 1.5;
  transition: color 0.1s, border-color 0.1s;

  &:hover { color: $tb-accent; border-color: $tb-accent; }
  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 2px; }
}

.cust-output-code {
  font-family: $tb-mono;
  font-size: 11px;
  background: #1e1e2e;
  color: #cdd6f4;
  margin: 0;
  padding: 12px 16px;
  overflow-x: auto;
  max-height: 220px;
  overflow-y: auto;
  scrollbar-gutter: stable;
  white-space: pre;
  line-height: 1.6;
}

.cust-output-hint {
  font-size: 12px;
  color: $tb-text-muted;
  margin: 0;
  padding: 8px 16px;
  line-height: 1.5;
}
</style>
