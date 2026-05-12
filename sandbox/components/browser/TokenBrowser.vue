<template>
  <div class="token-browser">
    <!-- Header: two-row on mobile (brand / controls), single row on desktop -->
    <header
      ref="headerEl"
      class="browser-header"
    >
      <div class="browser-brand">
        <!-- Clicking the logo resets search and active tab, returning to the default view -->
        <button
          class="brand-btn"
          type="button"
          @click="handleLogoClick"
        >
          <span class="brand-title">Kong Design Tokens</span>
        </button>
        <span class="brand-version">v{{ appVersion }}</span>
      </div>
      <div class="browser-controls">
        <div class="search-wrap">
          <svg
            aria-hidden="true"
            class="search-icon"
            fill="none"
            height="14"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
            width="14"
          >
            <circle
              cx="11"
              cy="11"
              r="8"
            /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref="searchInputEl"
            v-model="localSearch"
            aria-label="Search tokens"
            class="search-input"
            placeholder="Search all tokens or values…"
            type="search"
          >
          <button
            v-if="localSearch"
            aria-label="Clear search"
            class="search-clear"
            type="button"
            @click="localSearch = ''"
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
        <div class="controls-row">
          <div
            aria-label="Copy format"
            class="format-toggle"
            role="group"
          >
            <button
              :aria-pressed="copyFormat === 'css'"
              :class="['format-btn', { 'format-btn--active': copyFormat === 'css' }]"
              title="CSS custom property: var(--kui-…)"
              @click="copyFormat = 'css'"
            >
              CSS
            </button>
            <button
              :aria-pressed="copyFormat === 'sass'"
              :class="['format-btn', { 'format-btn--active': copyFormat === 'sass' }]"
              title="Sass variable: $kui-…"
              @click="copyFormat = 'sass'"
            >
              Sass
            </button>
            <button
              :aria-pressed="copyFormat === 'js'"
              :class="['format-btn', { 'format-btn--active': copyFormat === 'js' }]"
              title="JS constant: KUI_…"
              @click="copyFormat = 'js'"
            >
              JS
            </button>
          </div>
          <router-link
            v-if="isDevMode"
            class="nav-link"
            to="/customize"
          >
            Customize →
          </router-link>
          <button
            v-else
            class="nav-link nav-link--btn"
            type="button"
            @click="showBookmarkletModal = true"
          >
            Customize →
          </button>
        </div>
      </div>
    </header>

    <!-- Global search results: shown instead of tabs when query is active -->
    <template v-if="search && globalSearchResults !== null">
      <div class="search-results">
        <template v-if="globalSearchResults.length === 0">
          <div class="empty-state">
            No tokens match <em>"{{ localSearch }}"</em>
          </div>
        </template>
        <template v-else>
          <section
            v-for="group in globalSearchResults"
            :key="group.category"
            class="search-section"
          >
            <div class="search-section-header">
              <span>{{ categoryLabel(group.category) }}</span>
              <span class="search-section-count">{{ group.entries.length }}</span>
            </div>
            <div :class="['token-grid', `token-grid--${group.category}`]">
              <TokenCard
                v-for="token in group.entries"
                :key="token.key"
                :copy-format="copyFormat"
                :is-copied="copiedKey === token.key"
                :token="token"
                @copy="handleCopy"
              />
            </div>
          </section>
        </template>
      </div>
    </template>

    <!-- Normal tab-browse mode -->
    <template v-else>
      <!-- Gradient-masked nav signals horizontal scroll on mobile without a visible scrollbar.
           Uses ::after pseudo-element instead of mask-image so the background stays opaque
           and scrolling content can't bleed through the fade zone on narrow screens. -->
      <div class="category-tabs-wrap">
        <nav
          aria-label="Token categories"
          class="category-tabs"
        >
          <button
            v-for="cat in categories"
            :key="cat"
            :aria-current="activeCategory === cat ? 'true' : undefined"
            :class="['tab-btn', { 'tab-btn--active': activeCategory === cat }]"
            @click="selectCategory(cat)"
          >
            {{ categoryLabel(cat) }}
            <span class="tab-count">{{ countByCategory[cat] }}</span>
          </button>
        </nav>
      </div>

      <!-- Components tab: all groups visible at once, each with a section header -->
      <template v-if="activeCategory === 'components'">
        <div
          v-for="subcat in componentSubcategories"
          :key="subcat"
          class="token-section"
        >
          <div class="token-section-header">
            <span class="token-section-name">{{ subcat }}</span>
            <span class="token-section-count">{{ componentsBySubcat[subcat]?.length ?? 0 }}</span>
          </div>
          <div class="token-grid token-grid--components">
            <TokenCard
              v-for="token in componentsBySubcat[subcat]"
              :key="token.key"
              :copy-format="copyFormat"
              :is-copied="copiedKey === token.key"
              :token="token"
              @copy="handleCopy"
            />
          </div>
        </div>
      </template>

      <!-- Sectionable categories (color, font, border, shadow): grouped by sub-type -->
      <template v-else-if="categorySections.get(activeCategory)">
        <div
          v-for="section in categorySections.get(activeCategory)!"
          :key="section.section"
          class="token-section"
        >
          <!-- Flat tokens (no sub-category) render without a header or collapse control -->
          <template v-if="section.section !== '__flat__'">
            <div
              class="token-section-header token-section-header--collapsible"
              @click="toggleSection(`${activeCategory}:${section.section}`)"
            >
              <button
                :aria-expanded="!collapsedSections.has(`${activeCategory}:${section.section}`)"
                class="section-collapse-btn"
                type="button"
              >
                <svg
                  fill="none"
                  height="12"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  :style="{ transform: collapsedSections.has(`${activeCategory}:${section.section}`) ? 'rotate(-90deg)' : 'rotate(0deg)' }"
                  viewBox="0 0 24 24"
                  width="12"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              <span class="token-section-name">{{ section.section }}</span>
              <span class="token-section-count">{{ section.entries.length }}</span>
            </div>
          </template>
          <div
            v-show="section.section === '__flat__' || !collapsedSections.has(`${activeCategory}:${section.section}`)"
            :class="['token-grid', `token-grid--${activeCategory}`]"
          >
            <TokenCard
              v-for="token in section.entries"
              :key="token.key"
              :copy-format="copyFormat"
              :is-copied="copiedKey === token.key"
              :token="token"
              @copy="handleCopy"
            />
          </div>
        </div>
      </template>

      <!-- All other categories: flat grid -->
      <template v-else>
        <main
          :aria-label="`${categoryLabel(activeCategory)} tokens`"
          :class="['token-grid', `token-grid--${activeCategory}`]"
        >
          <TokenCard
            v-for="token in filteredTokens"
            :key="token.key"
            :copy-format="copyFormat"
            :is-copied="copiedKey === token.key"
            :token="token"
            @copy="handleCopy"
          />
          <div
            v-if="filteredTokens.length === 0"
            class="empty-state"
          >
            No tokens in this category.
          </div>
        </main>
      </template>
    </template>
    <BookmarkletModal
      v-model="showBookmarkletModal"
      :bookmarklet-href="bookmarkletHref"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTokens, categoryLabel, type TokenCategory } from '@/composables/useTokens'
import { useClipboard } from '@/composables/useClipboard'
import { useHeaderHeight } from '@/composables/useHeaderHeight'
import { useSearchShortcut } from '@/composables/useSearchShortcut'
import { BOOKMARKLET_TEMPLATE } from '@/lib/preview-bookmarklet'
import TokenCard from './TokenCard.vue'
import BookmarkletModal from './BookmarkletModal.vue'
import pkg from '../../../package.json'

const isDevMode = import.meta.env.DEV

/** Controls the bookmarklet setup modal (production only). */
const showBookmarkletModal = ref(false)

/** Bookmarklet href computed at runtime so `__CUSTOMIZER_URL__` resolves to the actual origin. */
const bookmarkletHref = (() => {
  if (typeof window === 'undefined') return '#'
  const customizerUrl = `${window.location.origin}${import.meta.env.BASE_URL}#/customize?embedded=1`
  return `javascript:${encodeURIComponent(BOOKMARKLET_TEMPLATE.replace(/__CUSTOMIZER_URL__/g, customizerUrl))}`
})()

const appVersion = pkg.version

const route = useRoute()
const router = useRouter()

const {
  search,
  activeCategory,
  categories,
  componentSubcategories,
  componentsBySubcat,
  categorySections,
  filteredTokens,
  globalSearchResults,
  countByCategory,
} = useTokens()

const { copiedKey, copyText } = useClipboard()

const copyFormat = ref<'css' | 'sass' | 'js'>('css')

/** Tracks which section keys (`${category}:${section}`) are currently collapsed. */
const collapsedSections = reactive(new Set<string>())

/** Toggles collapse state for a section by its composite key. */
function toggleSection(key: string) {
  if (collapsedSections.has(key)) {
    collapsedSections.delete(key)
  } else {
    collapsedSections.add(key)
  }
}

const headerEl = ref<HTMLElement | null>(null)
useHeaderHeight(headerEl)

const searchInputEl = ref<HTMLInputElement | null>(null)
useSearchShortcut(searchInputEl)

// Decouple input display from filtering: localSearch updates immediately on keystroke;
// search (which drives filtering and URL) updates after 300ms so the UI stays snappy
// while heavier filter computation is deferred.
const localSearch = ref('')
let searchDebounce: ReturnType<typeof setTimeout>

onMounted(() => {
  const q = route.query.q
  if (typeof q === 'string' && q) {
    localSearch.value = q
    search.value = q
  }
})

watch(localSearch, (val) => {
  clearTimeout(searchDebounce)
  searchDebounce = setTimeout(() => {
    search.value = val
    router.replace({ query: val ? { q: val } : {} })
  }, 300)
})

/** Resets search and active tab, navigating back to the default browse view. */
function handleLogoClick() {
  localSearch.value = ''
  search.value = ''
  activeCategory.value = 'color'
  router.push('/')
}

/** Switches to a category tab; separate function so we can add sub-state resets here if needed. */
function selectCategory(cat: TokenCategory) {
  activeCategory.value = cat
}

/** Forwards a copy event from TokenCard to the clipboard composable. */
function handleCopy(key: string, text: string) {
  copyText(text, key)
}
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

// Root
.token-browser {
  min-height: 100vh;
  background: $tb-bg;
  color: $tb-text;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

// Header
.browser-header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: $tb-surface;
  border-bottom: 1px solid $tb-border;
  padding: 12px 20px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

// On mobile the brand takes the full width, pushing controls to the next row
.browser-brand {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-shrink: 0;

  @media (max-width: 639px) { width: 100%; }
}

.brand-btn {
  display: flex;
  align-items: baseline;
  gap: 8px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  border-radius: 4px;

  &:focus-visible {
    outline: 2px solid $tb-accent;
    outline-offset: 3px;
  }
}

.brand-title {
  font-weight: 600;
  font-size: 17px;
  letter-spacing: -0.01em;
  color: $tb-text;
  line-height: 1;
}

.brand-version {
  font-size: 11px;
  color: $tb-text-muted;
  font-weight: 400;
  letter-spacing: 0;
  font-family: $tb-mono;
}

// Controls always lay out as a row (search + toggle + link side-by-side)
.browser-controls {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.search-wrap {
  position: relative;
  flex: 1;
  min-width: 0;

  .search-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: $tb-text-muted;
    pointer-events: none;
  }
}

.search-input {
  width: 100%;
  background: $tb-surface;
  border: 1px solid $tb-border;
  border-radius: 6px;
  padding: 7px 32px 7px 32px;
  font-family: inherit;
  font-size: 13px;
  color: $tb-text;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-sizing: border-box;

  &::placeholder { color: $tb-text-muted; }
  &:focus-visible {
    border-color: $tb-accent;
    box-shadow: 0 0 0 3px $tb-accent-subtle;
  }
  // Hide the browser-native clear button — we use our own
  &::-webkit-search-cancel-button { display: none; }
}

.search-clear {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: $tb-surface-2;
  border: 1px solid $tb-border;
  border-radius: 4px;
  color: $tb-text-muted;
  cursor: pointer;
  padding: 2px 4px;
  display: flex;
  align-items: center;
  line-height: 1;
  transition: background 0.1s, color 0.1s;

  &:hover { background: $tb-border; color: $tb-text; }
  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 1px; }
}

.controls-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.format-toggle {
  display: flex;
  background: $tb-surface-2;
  border: 1px solid $tb-border;
  border-radius: 6px;
  overflow: hidden;
}

.format-btn {
  background: none;
  border: none;
  padding: 5px 10px;
  font-family: $tb-mono;
  font-size: 11px;
  font-weight: 500;
  color: $tb-text-muted;
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
  white-space: nowrap;

  &:hover:not(.format-btn--active) { color: $tb-text-dim; background: rgba(0, 0, 0, 0.04); }
  &--active { background: $tb-accent; color: #fff; }
  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: -2px; }
}

.nav-link {
  font-size: 13px;
  font-weight: 500;
  color: $tb-accent;
  text-decoration: none;
  white-space: nowrap;
  padding: 5px 2px;
  border-radius: 3px;

  &:hover { text-decoration: underline; }
  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 3px; }

  &--btn {
    background: none;
    border: none;
    cursor: pointer;
    font-family: inherit;
  }
}

// Category tabs─
.category-tabs-wrap {
  position: sticky;
  top: var(--header-h, 57px);
  z-index: 10;
  background: $tb-surface;
  border-bottom: 1px solid $tb-border;
  // Overflow must be visible so the ::after pseudo-element can overlay content outside the border
  overflow: visible;

  // Overlay gradient using ::after instead of mask-image so the background stays fully opaque.
  // mask-image makes the background itself transparent, letting scroll content bleed through
  // the fade zone on narrow screens.
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 48px;
    background: linear-gradient(to right, transparent, $tb-surface);
    pointer-events: none;
    z-index: 1;
  }
}

.category-tabs {
  display: flex;
  padding: 0 20px;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar { display: none; }
}

.tab-btn {
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 10px 12px 8px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  color: $tb-text-muted;
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: color 0.12s, border-color 0.12s;
  margin-bottom: -1px;

  &:hover { color: $tb-text-dim; }
  &--active {
    color: $tb-text;
    border-bottom-color: $tb-accent;
  }
  &:focus-visible {
    outline: 2px solid $tb-accent;
    outline-offset: -2px;
    border-radius: 3px;
  }
}

.tab-count {
  font-size: 11px;
  color: $tb-text-muted;
  background: $tb-surface-2;
  border-radius: 10px;
  padding: 1px 6px;

  .tab-btn--active & {
    color: $tb-accent;
    background: $tb-accent-subtle;
  }
}

// Token sections─
.token-section {
  padding: 16px 20px;
  border-bottom: 1px solid $tb-border;

  &:last-child { border-bottom: none; }
}

.token-section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  // Escape the parent section's padding to span the full width, then add padding back
  margin: -16px -20px 16px;
  padding: 9px 20px;
  background: $tb-surface-2;
  border-bottom: 1px solid $tb-border;

  &--collapsible {
    cursor: pointer;
    user-select: none;
    &:hover { background: $tb-border; }
  }
}

.section-collapse-btn {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  padding: 0;
  color: $tb-text-muted;
  cursor: pointer;
  flex-shrink: 0;

  svg { transition: transform 0.15s; }
  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 2px; border-radius: 3px; }
}

.token-section-name {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: $tb-text-dim;
}

.token-section-count {
  font-size: 11px;
  font-weight: 500;
  color: $tb-text-muted;
  background: $tb-surface;
  border: 1px solid $tb-border;
  border-radius: 10px;
  padding: 1px 7px;
  letter-spacing: 0;
  text-transform: none;
}

// Token grid─
.token-grid {
  padding: 20px;
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  // Two-row bands per card: preview row (1fr) + info row (auto).
  // With CSS subgrid on each card, all cards in the same row band share
  // equal preview height AND equal info height regardless of content length.
  grid-auto-rows: 1fr auto;

  &--color { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }

  &--shadow,
  &--border { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }

  // Sectioned and component grids inherit padding from the section wrapper
  .token-section & { padding: 0; }
}

// Global search results─
.search-results {
  padding: 20px;
}

.search-section {
  margin-bottom: 32px;

  &:last-child { margin-bottom: 0; }
}

.search-section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: $tb-text-muted;
  padding: 0 0 10px;
  border-bottom: 1px solid $tb-border;
  margin-bottom: 12px;
}

.search-section-count {
  background: $tb-surface-2;
  color: $tb-text-muted;
  border-radius: 10px;
  padding: 1px 7px;
  font-size: 11px;
  font-weight: 500;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 64px 24px;
  color: $tb-text-muted;
  font-size: 14px;

  em { font-style: normal; color: $tb-text-dim; }
}

</style>
