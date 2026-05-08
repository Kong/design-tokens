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
          <span class="brand-logo">KONG</span>
          <span class="brand-title">Design Tokens</span>
        </button>
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
            v-model="search"
            aria-label="Search tokens"
            class="search-input"
            placeholder="Search all tokens or values…"
            type="search"
          >
        </div>
        <div class="controls-row">
          <div
            aria-label="Copy format"
            class="format-toggle"
            role="group"
          >
            <button
              :class="['format-btn', { 'format-btn--active': copyFormat === 'css' }]"
              title="CSS custom property: var(--kui-…)"
              @click="copyFormat = 'css'"
            >
              CSS
            </button>
            <button
              :class="['format-btn', { 'format-btn--active': copyFormat === 'sass' }]"
              title="Sass variable: $kui-…"
              @click="copyFormat = 'sass'"
            >
              Sass
            </button>
            <button
              :class="['format-btn', { 'format-btn--active': copyFormat === 'js' }]"
              title="JS constant: KUI_…"
              @click="copyFormat = 'js'"
            >
              JS
            </button>
          </div>
          <router-link
            class="nav-link"
            to="/customize"
          >
            Customize →
          </router-link>
        </div>
      </div>
    </header>

    <!-- Global search results: shown instead of tabs when query is active -->
    <template v-if="search && globalSearchResults !== null">
      <div class="search-results">
        <template v-if="globalSearchResults.length === 0">
          <div class="empty-state">
            No tokens match <em>"{{ search }}"</em>
          </div>
        </template>
        <template v-else>
          <section
            v-for="group in globalSearchResults"
            :key="group.category"
            class="search-section"
          >
            <div class="search-section-header">
              <span>{{ CATEGORY_LABELS[group.category] ?? group.category }}</span>
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
      <!-- Gradient-masked nav signals horizontal scroll on mobile without a visible scrollbar -->
      <div class="category-tabs-wrap">
        <nav
          aria-label="Token categories"
          class="category-tabs"
        >
          <button
            v-for="cat in categories"
            :key="cat"
            :class="['tab-btn', { 'tab-btn--active': activeCategory === cat }]"
            @click="selectCategory(cat)"
          >
            {{ CATEGORY_LABELS[cat] ?? cat }}
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
            {{ subcat }}
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
          <div class="token-section-header">
            {{ section.section }}
          </div>
          <div :class="['token-grid', `token-grid--${activeCategory}`]">
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
          :aria-label="`${CATEGORY_LABELS[activeCategory] ?? activeCategory} tokens`"
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
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTokens, CATEGORY_LABELS, type TokenCategory } from '@/composables/useTokens'
import { useClipboard } from '@/composables/useClipboard'
import { useHeaderHeight } from '@/composables/useHeaderHeight'
import TokenCard from './TokenCard.vue'

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

const headerEl = ref<HTMLElement | null>(null)
useHeaderHeight(headerEl)

/** Initialize search from URL on first load so refresh and shared links preserve query. */
onMounted(() => {
  const q = route.query.q
  if (typeof q === 'string' && q) search.value = q
})

/** Debounced sync of the search input to the URL query string. */
let searchDebounceTimer: ReturnType<typeof setTimeout>
watch(search, (val) => {
  clearTimeout(searchDebounceTimer)
  searchDebounceTimer = setTimeout(() => {
    router.replace({ query: val ? { q: val } : {} })
  }, 300)
})

/** Resets search and active tab, navigating back to the default browse view. */
function handleLogoClick() {
  search.value = ''
  activeCategory.value = 'color'
  router.push('/')
}

/** Switches to a category tab; separate function so we can add sub-state resets here if needed. */
function selectCategory(cat: TokenCategory) {
  activeCategory.value = cat
}

function handleCopy(key: string, text: string) {
  copyText(text, key)
}
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

// ─── Root ────────────────────────────────────────────────────────────────────
.token-browser {
  min-height: 100vh;
  background: $tb-bg;
  color: $tb-text;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

// ─── Header ──────────────────────────────────────────────────────────────────
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

.brand-logo {
  font-weight: 700;
  font-size: 17px;
  letter-spacing: 0.15em;
  color: $tb-accent;
  text-transform: uppercase;
}

.brand-title {
  font-weight: 600;
  font-size: 17px;
  letter-spacing: -0.01em;
  color: $tb-text;
  margin: 0;
  line-height: 1;
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
  padding: 7px 12px 7px 32px;
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
  &::-webkit-search-cancel-button { cursor: pointer; }
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
  &:focus-visible {
    outline: 2px solid $tb-accent;
    outline-offset: 3px;
  }
}

// ─── Category tabs ────────────────────────────────────────────────────────────
// Wrapper provides the right-side fade that signals overflow on mobile
.category-tabs-wrap {
  position: sticky;
  // Positioned below the sticky header; height is tracked by useHeaderHeight
  top: var(--header-h, 57px);
  z-index: 10;
  background: $tb-surface;
  border-bottom: 1px solid $tb-border;
  // Fade masks the tab overflow to hint horizontal scrollability
  mask-image: linear-gradient(to right, black calc(100% - 40px), transparent 100%);
  -webkit-mask-image: linear-gradient(to right, black calc(100% - 40px), transparent 100%);
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

// ─── Token sections ───────────────────────────────────────────────────────────
.token-section {
  padding: 16px 20px;
  border-bottom: 1px solid $tb-border;

  &:last-child { border-bottom: none; }
}

.token-section-header {
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
  letter-spacing: 0.04em;
  color: $tb-text-muted;
  padding-bottom: 10px;
}

// ─── Token grid ───────────────────────────────────────────────────────────────
.token-grid {
  padding: 20px;
  display: grid;
  gap: 12px;
  // Default stretch so all cards in the same row share the same height
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));

  &--color { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }

  &--shadow,
  &--border { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }

  // Components and sectioned grids use padding from the section wrapper, not the grid
  .token-section & { padding: 0; }
}

// ─── Global search results ────────────────────────────────────────────────────
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
