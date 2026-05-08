<template>
  <div class="customizer">
    <!-- Sticky header: navigation + override status + export actions -->
    <header
      ref="headerEl"
      class="cust-header"
    >
      <div class="cust-header-left">
        <router-link
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
        <button
          v-if="hasOverrides"
          class="cust-btn cust-btn--ghost"
          @click="resetAll"
        >
          Reset all
        </button>
        <!-- "Copy patch" copies only overrides — paste into existing app CSS -->
        <button
          class="cust-btn"
          :disabled="!hasOverrides"
          @click="copyOverrides"
        >
          {{ copiedOverrides ? '✓ Copied' : 'Copy overrides CSS' }}
        </button>
        <!-- "Share" encodes overrides into URL hash so the link reproduces exact state -->
        <button
          class="cust-btn cust-btn--secondary"
          :disabled="!hasOverrides"
          @click="copyShareLink"
        >
          {{ copiedShareLink ? '✓ Link copied' : '⬡ Share link' }}
        </button>
        <!-- "Download full" includes all tokens — useful as a standalone stylesheet -->
        <button
          class="cust-btn cust-btn--secondary"
          @click="downloadFull"
        >
          ↓ Download full CSS
        </button>
      </div>
    </header>

    <div class="cust-layout">
      <!-- Left: searchable, collapsible token editor -->
      <div class="cust-editor">
        <div class="cust-search-wrap">
          <svg
            aria-hidden="true"
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
            v-model="filterQuery"
            aria-label="Filter tokens"
            class="cust-search"
            placeholder="Filter tokens…"
            type="search"
          >
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
          No tokens match "{{ filterQuery }}"
        </div>
      </div>

      <!-- Right: overrides CSS output + live preview -->
      <aside class="cust-aside">
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

        <CustLivePreview />
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTokenCustomizer } from '@/composables/useTokenCustomizer'
import { useClipboard } from '@/composables/useClipboard'
import { useHeaderHeight } from '@/composables/useHeaderHeight'
import CustTokenGroup from './CustTokenGroup.vue'
import CustLivePreview from './CustLivePreview.vue'

const {
  overrides,
  overrideCount,
  hasOverrides,
  filterQuery,
  collapsed,
  visibleGroups,
  toggleGroup,
  setOverride,
  resetAll,
  overridesCss,
  fullExportCss,
  getShareUrl,
} = useTokenCustomizer()

const headerEl = ref<HTMLElement | null>(null)
useHeaderHeight(headerEl)

const { copyText } = useClipboard()

// Independent "copied" flags for the two buttons so their states don't interfere
const copiedOverrides = ref(false)
const copiedShareLink = ref(false)
let resetOverridesTimer: ReturnType<typeof setTimeout>
let resetShareTimer: ReturnType<typeof setTimeout>

async function copyOverrides() {
  if (!hasOverrides.value) return
  await copyText(overridesCss.value, 'overrides-patch')
  copiedOverrides.value = true
  clearTimeout(resetOverridesTimer)
  resetOverridesTimer = setTimeout(() => {
    copiedOverrides.value = false
  }, 1500)
}

async function copyShareLink() {
  if (!hasOverrides.value) return
  await copyText(getShareUrl(), 'share-link')
  copiedShareLink.value = true
  clearTimeout(resetShareTimer)
  resetShareTimer = setTimeout(() => {
    copiedShareLink.value = false
  }, 1500)
}

function downloadFull() {
  const blob = new Blob([fullExportCss.value], { type: 'text/css' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'kong-design-tokens.css'
  a.click()
  URL.revokeObjectURL(url)
}

const placeholderCss = ':root {\n  /* Edit tokens on the left\n     to see your overrides here */\n}'
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.customizer {
  min-height: 100vh;
  background: $tb-bg;
  color: $tb-text;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

// ─── Header ───────────────────────────────────────────────────────────────────
.cust-header {
  position: sticky;
  top: 0;
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
  &:focus-visible {
    outline: 2px solid $tb-accent;
    outline-offset: 3px;
  }
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
  &:focus-visible {
    outline: 2px solid $tb-accent;
    outline-offset: 2px;
  }

  &--ghost {
    background: transparent;
    color: $tb-text-dim;
    border-color: $tb-border-active;
  }

  &--secondary {
    background: $tb-surface;
    color: $tb-text-dim;
    border-color: $tb-border-active;
  }
}

// ─── Two-column layout ────────────────────────────────────────────────────────
.cust-layout {
  display: grid;
  grid-template-columns: 1fr;

  @media (min-width: 900px) {
    grid-template-columns: 1fr 340px;
    align-items: start;
  }
}

// ─── Editor panel ──────────────────────────────────────────────────────────────
.cust-editor {
  border-right: 1px solid $tb-border;
}

.cust-search-wrap {
  position: sticky;
  // Positioned directly below the sticky header
  top: var(--header-h, 57px);
  z-index: 10;
  background: $tb-surface;
  padding: 12px 16px;
  border-bottom: 1px solid $tb-border;

  svg {
    position: absolute;
    left: 28px;
    top: 50%;
    transform: translateY(-50%);
    color: $tb-text-muted;
    pointer-events: none;
  }
}

.cust-search {
  width: 100%;
  background: $tb-bg;
  border: 1px solid $tb-border;
  border-radius: 5px;
  padding: 6px 10px 6px 28px;
  font-family: inherit;
  font-size: 13px;
  color: $tb-text;
  outline: none;
  box-sizing: border-box;

  &::placeholder { color: $tb-text-muted; }
  &:focus-visible { border-color: $tb-accent; }
}

.cust-empty {
  padding: 40px 20px;
  text-align: center;
  color: $tb-text-muted;
  font-size: 14px;
}

// ─── Aside: output + live preview ─────────────────────────────────────────────
.cust-aside {
  display: flex;
  flex-direction: column;

  @media (min-width: 900px) {
    position: sticky;
    top: var(--header-h, 57px);
    max-height: calc(100vh - var(--header-h, 57px));
    overflow-y: auto;
  }
}

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
  &:focus-visible {
    outline: 2px solid $tb-accent;
    outline-offset: 2px;
  }
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
