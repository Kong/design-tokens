<template>
  <SandboxShell
    :embedded="isEmbedded"
    title="Design Token Customizer"
    @close="handleClose"
  >
    <template #title-extra>
      <span
        v-if="hasOverrides"
        class="override-badge"
      >
        {{ overrideCount }} override{{ overrideCount === 1 ? '' : 's' }}
      </span>
    </template>

    <template #header-actions>
      <a
        aria-label="Kong Design Tokens website"
        class="cust-btn cust-btn--github"
        href="https://kong.github.io/design-tokens/#/"
        rel="noopener noreferrer"
        target="_blank"
        title="Open design tokens site"
      >
        <svg
          fill="none"
          height="16"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
          width="16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
          />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      </a>
      <a
        aria-label="Kong Design Tokens on GitHub"
        class="cust-btn cust-btn--github"
        href="https://github.com/Kong/design-tokens"
        rel="noopener noreferrer"
        target="_blank"
        title="View on GitHub"
      >
        <svg
          fill="currentColor"
          height="16"
          viewBox="0 0 24 24"
          width="16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      </a>
    </template>

    <!-- Embedded mode: tabbed Tokens / Export view -->
    <template
      v-if="isEmbedded"
      #tabs
    >
      <SandboxTabs
        v-model="embeddedTab"
        :tabs="embeddedTabs"
      />
    </template>

    <template v-if="isEmbedded">
      <div class="cust-embedded-body">
        <!-- Tokens tab: embed toolbar + token editor -->
        <div
          v-show="embeddedTab === 'tokens'"
          class="cust-editor-content cust-editor-content--embedded"
        >
          <div class="embed-toolbar">
            <!-- CSS selector -->
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
            <label class="cust-theme-picker">
              <span class="cust-theme-picker-label">Starting theme</span>
              <select
                class="cust-theme-select"
                :value="startingThemeId"
                @change="setStartingTheme(($event.target as HTMLSelectElement).value)"
              >
                <option
                  v-for="theme in THEMES"
                  :key="theme.id"
                  :value="theme.id"
                >
                  {{ theme.label }}
                </option>
              </select>
            </label>
            <button
              v-if="visibleGroups.length > 1 || allCollapsed"
              class="cust-collapse-btn"
              @click="allCollapsed ? expandAll() : collapseAll()"
            >
              <svg
                v-if="allCollapsed"
                fill="none"
                height="14"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                width="14"
              >
                <rect
                  height="18"
                  rx="2"
                  width="18"
                  x="3"
                  y="3"
                />
                <line
                  x1="12"
                  x2="12"
                  y1="8"
                  y2="16"
                />
                <line
                  x1="8"
                  x2="16"
                  y1="12"
                  y2="12"
                />
              </svg>
              <svg
                v-else
                fill="none"
                height="14"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                width="14"
              >
                <rect
                  height="18"
                  rx="2"
                  width="18"
                  x="3"
                  y="3"
                />
                <line
                  x1="8"
                  x2="16"
                  y1="12"
                  y2="12"
                />
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

          <CustCustomPropsGroup
            v-if="customPropsGroup"
            :group="customPropsGroup"
            :is-collapsed="!!collapsed[CUSTOM_GROUP_KEY]"
            @toggle="collapsed[CUSTOM_GROUP_KEY] = !collapsed[CUSTOM_GROUP_KEY]"
          />

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
            v-if="visibleGroups.length === 0 && !customPropsGroup"
            class="cust-empty"
          >
            No tokens match "{{ localFilter }}"
          </div>
        </div>

        <!-- Export tab: share + import + output -->
        <aside
          v-show="embeddedTab === 'export'"
          class="cust-aside"
        >
          <CustImportPanel />
          <CustSharePanel
            :copied="copiedShareLink"
            :copied-code="copiedStateCode"
            :override-count="overrideCount"
            :state-code="stateCode"
            @copy="copyShareLink"
            @copy-code="copyStateCode"
          />
          <CustOutputPanel
            :copied="copiedOverrides"
            :css="displayCss"
            label="All tokens CSS"
            :placeholder="placeholderCss"
            @copy="copyOverrides"
            @download="downloadFull"
          />
        </aside>
      </div>
    </template>

    <!-- Standalone mode: unchanged 3-column editor | preview | aside layout -->
    <div
      v-else
      :class="['cust-layout', 'cust-layout--with-preview', !editorOpen && 'cust-layout--editor-collapsed']"
    >
      <!-- Left: collapsible token editor panel (slideout) -->
      <div :class="['cust-editor', { 'cust-editor--collapsed': !editorOpen }]">
        <!-- Collapse toggle strip -->
        <div class="editor-toggle-strip">
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
            <label class="cust-theme-picker">
              <span class="cust-theme-picker-label">Starting theme</span>
              <select
                class="cust-theme-select"
                :value="startingThemeId"
                @change="setStartingTheme(($event.target as HTMLSelectElement).value)"
              >
                <option
                  v-for="theme in THEMES"
                  :key="theme.id"
                  :value="theme.id"
                >
                  {{ theme.label }}
                </option>
              </select>
            </label>
            <button
              v-if="visibleGroups.length > 1 || allCollapsed"
              class="cust-collapse-btn"
              @click="allCollapsed ? expandAll() : collapseAll()"
            >
              <!-- Plus-box icon: shown when all collapsed (action = expand) -->
              <svg
                v-if="allCollapsed"
                fill="none"
                height="14"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                width="14"
              >
                <rect
                  height="18"
                  rx="2"
                  width="18"
                  x="3"
                  y="3"
                />
                <line
                  x1="12"
                  x2="12"
                  y1="8"
                  y2="16"
                />
                <line
                  x1="8"
                  x2="16"
                  y1="12"
                  y2="12"
                />
              </svg>
              <!-- Minus-box icon: shown when not all collapsed (action = collapse) -->
              <svg
                v-else
                fill="none"
                height="14"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                width="14"
              >
                <rect
                  height="18"
                  rx="2"
                  width="18"
                  x="3"
                  y="3"
                />
                <line
                  x1="8"
                  x2="16"
                  y1="12"
                  y2="12"
                />
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

          <CustCustomPropsGroup
            v-if="customPropsGroup"
            :group="customPropsGroup"
            :is-collapsed="!!collapsed[CUSTOM_GROUP_KEY]"
            @toggle="collapsed[CUSTOM_GROUP_KEY] = !collapsed[CUSTOM_GROUP_KEY]"
          />

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
            v-if="visibleGroups.length === 0 && !customPropsGroup"
            class="cust-empty"
          >
            No tokens match "{{ localFilter }}"
          </div>
        </div>
      </div>

      <!-- Center: live URL preview panel (dev: iframe proxy; hosted: bookmarklet sidebar) -->
      <div class="cust-preview-column">
        <CustPreviewPanel
          v-model:custom-selector="customSelector"
          :all-tokens-css="fullExportCss"
        />
      </div>

      <!-- Right: share link + override CSS output -->
      <aside class="cust-aside">
        <CustSharePanel
          :copied="copiedShareLink"
          :copied-code="copiedStateCode"
          :override-count="overrideCount"
          :state-code="stateCode"
          @copy="copyShareLink"
          @copy-code="copyStateCode"
        />
        <CustImportPanel />
        <CustOutputPanel
          :copied="copiedOverrides"
          :css="displayCss"
          label="All tokens CSS"
          :placeholder="placeholderCss"
          @copy="copyOverrides"
          @download="downloadFull"
        />
      </aside>
    </div>
  </SandboxShell>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useTokenCustomizer, encodeOverrides, CUSTOM_GROUP_KEY } from '@/composables/useTokenCustomizer'
import { DEFAULT_THEME_ID, THEMES } from '@/composables/useTokens'
import { useClipboard } from '@/composables/useClipboard'
import { useEmbeddedBridge } from '@/composables/useEmbeddedBridge'
import { useSearchShortcut } from '@/composables/useSearchShortcut'
import { getHashParam, setHashParams } from '@/utils/hashRouteQuery'
import { applySelector } from '@/utils/cssUtils'
import SandboxShell from '@/components/shared/SandboxShell.vue'
import SandboxTabs from '@/components/shared/SandboxTabs.vue'
import CustTokenGroup from './CustTokenGroup.vue'
import CustCustomPropsGroup from './CustCustomPropsGroup.vue'
import CustPreviewPanel from './CustPreviewPanel.vue'
import CustSharePanel from './CustSharePanel.vue'
import CustOutputPanel from './CustOutputPanel.vue'
import CustImportPanel from './CustImportPanel.vue'

/** True when the customizer is loaded as an embedded sidebar by the bookmarklet. */
const isEmbedded = getHashParam('embedded') === '1'

/**
 * CSS selector to use in place of `:root` (e.g. `[data-theme="dark"]`).
 * In embedded mode: scopes the CSS posted to the parent page.
 * In normal mode: scopes what the preview panel injects and what the output panel shows.
 */
const customSelector = ref(getHashParam('selector') ?? '')

// Alias used only in embedded mode for clarity.
const embeddedSelector = customSelector

/** Effective CSS to display/post: all tokens (overrides applied) with the selector applied. */
const embeddedEffectiveCss = computed(() => applySelector(fullExportCss.value, customSelector.value))

/** CSS shown in the output panel and used by the copy/download actions. */
const displayCss = computed(() => embeddedEffectiveCss.value)

/** Controls whether the token editor panel is expanded (true) or collapsed to a narrow strip. */
const editorOpen = ref(true)

const {
  overrides,
  customProps,
  startingThemeId,
  setStartingTheme,
  overrideCount,
  hasOverrides,
  filterQuery,
  showOnlyModified,
  collapsed,
  allCollapsed,
  visibleGroups,
  customPropsGroup,
  toggleGroup,
  collapseAll,
  expandAll,
  setOverride,
  resetAll,
  fullExportCss,
  shareUrl,
} = useTokenCustomizer()

// Encode overrides and write all URL params atomically so `src` in the postMessage
// always reflects the current state (avoids the race where the overrides watcher's
// async `encodeOverrides` hasn't settled before we read `window.location.href`).
const { post: postEmbedded, close: closeEmbedded } = useEmbeddedBridge({
  isEmbedded,
  css: embeddedEffectiveCss,
  buildSrc: async () => {
    await nextTick()
    const encoded = await encodeOverrides({ ...overrides, ...customProps })
    const sel = customSelector.value.trim()
    return setHashParams({
      o: encoded || null,
      selector: (sel && sel !== ':root') ? sel : null,
      theme: startingThemeId.value !== DEFAULT_THEME_ID ? startingThemeId.value : null,
    })
  },
})

/** Flushes latest state to the parent, then asks the bookmarklet to close. */
async function handleClose() {
  await postEmbedded()
  closeEmbedded()
}

/** Which embedded tab (Tokens / Export) is active — only relevant when `isEmbedded`. */
type EmbeddedTab = 'tokens' | 'export'
const embeddedTabs: Array<{ id: EmbeddedTab, label: string }> = [
  { id: 'tokens', label: 'Tokens' },
  { id: 'export', label: 'Export' },
]
const embeddedTab = ref<EmbeddedTab>('tokens')

const filterInputEl = ref<HTMLInputElement | null>(null)
useSearchShortcut(filterInputEl)

const { copyText } = useClipboard()

// Debounce avoids recomputing visibleGroups on every keystroke
const localFilter = ref('')
let filterDebounce: ReturnType<typeof setTimeout>
watch(localFilter, (val) => {
  clearTimeout(filterDebounce)
  filterDebounce = setTimeout(() => {
    filterQuery.value = val
  }, 300)
})

/** The bare encoded state code — the `o=` value from the current share URL. */
const stateCode = computed(() => {
  const url = shareUrl.value
  const hashIdx = url.indexOf('#')
  if (hashIdx < 0) return ''
  const hash = url.slice(hashIdx)
  const qi = hash.indexOf('?')
  if (qi < 0) return ''
  return new URLSearchParams(hash.slice(qi + 1)).get('o') ?? ''
})

const copiedOverrides = ref(false)
const copiedShareLink = ref(false)
const copiedStateCode = ref(false)
let resetOverridesTimer: ReturnType<typeof setTimeout>
let resetShareTimer: ReturnType<typeof setTimeout>
let resetStateCodeTimer: ReturnType<typeof setTimeout>

/** Copies the displayed CSS to the clipboard and shows a 1.5s confirmation state. */
async function copyOverrides() {
  if (!displayCss.value) return
  await copyText(displayCss.value, 'overrides-patch')
  copiedOverrides.value = true
  clearTimeout(resetOverridesTimer)
  resetOverridesTimer = setTimeout(() => {
    copiedOverrides.value = false
  }, 1500)
}

/** Copies the share URL to the clipboard, always as a non-embedded standalone link. */
async function copyShareLink() {
  let url = shareUrl.value
  if (isEmbedded) {
    // Build a clean standalone URL: preserve o/selector/theme, drop embedded=1
    const params = new URLSearchParams()
    const encoded = getHashParam('o')
    const selector = getHashParam('selector')
    const theme = getHashParam('theme')
    if (encoded) params.set('o', encoded)
    if (selector) params.set('selector', selector)
    if (theme) params.set('theme', theme)
    const qs = params.toString()
    url = window.location.origin + window.location.pathname + '#/customize' + (qs ? '?' + qs : '')
  }
  await copyText(url, 'share-link')
  copiedShareLink.value = true
  clearTimeout(resetShareTimer)
  resetShareTimer = setTimeout(() => {
    copiedShareLink.value = false
  }, 1500)
}

/** Copies just the encoded state code for cross-hostname import via the Import panel. */
async function copyStateCode() {
  const code = stateCode.value
  if (!code) return
  await copyText(code, 'state-code')
  copiedStateCode.value = true
  clearTimeout(resetStateCodeTimer)
  resetStateCodeTimer = setTimeout(() => {
    copiedStateCode.value = false
  }, 1500)
}

/** Downloads the currently displayed CSS (all tokens with overrides applied, respecting the custom selector). */
function downloadFull() {
  const blob = new Blob([displayCss.value], { type: 'text/css' })
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

const placeholderCss = ':root {\n  /* \n   * Edit tokens on the left\n   * to see your overrides here.\n   */\n}'

</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.override-badge {
  font-size: 12px;
  background: $tb-accent-subtle;
  color: $tb-accent;
  border-radius: 10px;
  padding: 2px 8px;
  font-weight: 500;
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

  &--github {
    background: $tb-surface;
    color: $tb-text-muted;
    border-color: $tb-border-active;
    padding: 5px 9px;
    display: inline-flex;
    align-items: center;
    text-decoration: none;

    &:hover { color: $tb-text; opacity: 1; }
  }
}

// Embedded body: single-pane, tab-switched content (fills the shell body)────
.cust-embedded-body {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  > * {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }
}

.cust-editor-content--embedded {
  border-right: none;
}

// Layout────
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

// Preview column────
.cust-preview-column {
  display: none;
  flex-direction: column;
  border-right: 1px solid $tb-border;
  overflow: hidden; // preview panel manages its own scroll
}

// Editor panel────
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

// Embedded toolbar (share + inject settings)────
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
  top: calc(100% + 6px);
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
    bottom: 100%;
    right: 4px;
    border: 5px solid transparent;
    border-bottom-color: $tb-text;
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

// Aside: share + output
.cust-aside {
  border-top: 1px solid $tb-border;
  display: flex;
  flex-direction: column;
  scrollbar-gutter: stable;
  // Height and overflow-y: auto come from the .cust-layout > * rule above
}

// Collapse bar
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

.cust-theme-picker {
  display: flex;
  align-items: center;
  gap: 6px;
  background: $tb-surface-2;
  border: 1px solid $tb-border;
  border-radius: 6px;
  padding: 0 4px 0 10px;
  flex-shrink: 0;

  &:focus-within { border-color: $tb-accent; box-shadow: 0 0 0 3px $tb-accent-subtle; }
}

.cust-theme-picker-label {
  font-size: 11px;
  font-weight: 500;
  color: $tb-text-muted;
  white-space: nowrap;
}

.cust-theme-select {
  appearance: none;
  background: none;
  border: none;
  padding: 6px 20px 6px 2px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  color: $tb-text;
  cursor: pointer;
  outline: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 2px center;
  background-size: 12px;
}

.cust-collapse-btn {
  background: none;
  border: 1px solid $tb-border;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
  color: $tb-text-muted;
  cursor: pointer;
  padding: 2px 8px;
  font-family: inherit;
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
  transition: background 0.12s, color 0.12s, border-color 0.12s;

  &:hover { color: $tb-text-dim; border-color: $tb-border-active; }
  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 2px; }
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

</style>
