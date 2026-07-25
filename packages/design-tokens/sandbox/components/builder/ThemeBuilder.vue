<template>
  <div class="theme-builder">
    <header class="tb-header">
      <div class="tb-header-left">
        <router-link
          v-if="!isEmbedded"
          class="tb-back"
          to="/"
        >
          ← Browse
        </router-link>
        <h1 class="tb-title">
          Theme Builder
        </h1>
      </div>
      <div class="tb-header-right">
        <button
          v-if="isLoaded"
          class="tb-load-different"
          title="Load a different theme"
          @click="loadDifferent"
        >
          ↻ Load different theme
        </button>
        <button
          v-if="isEmbedded"
          class="tb-close"
          title="Close"
          @click="closeEmbedded"
        >
          ✕
        </button>
      </div>
    </header>

    <FileLoader
      v-if="!isLoaded"
      :error="loadError"
      @load="onLoad"
    />

    <template v-else>
      <nav
        class="tb-tabs"
        role="tablist"
      >
        <button
          v-for="t in tabs"
          :key="t.id"
          :aria-selected="activeTab === t.id"
          :class="['tb-tab', { 'tb-tab--active': activeTab === t.id }]"
          role="tab"
          type="button"
          @click="activeTab = t.id"
        >
          {{ t.label }}
        </button>
      </nav>

      <div class="tb-tabpanel">
        <PalettePanel
          v-show="activeTab === 'aliases'"
          :alias-flat="aliasFlat"
          :alias-overrides="aliasOverrides"
          @change="setAliasOverride"
        />
        <TokenList
          v-show="activeTab === 'tokens'"
          :alias-flat="aliasFlat"
          :tokens="builderTokens"
          @reset="resetTokenOverride"
          @set="setTokenOverride"
        />
        <OutputPanel
          v-show="activeTab === 'export'"
          :alias-file-name="aliasFileName"
          :alias-json-out="aliasJsonOut"
          :css="effectiveCss"
          :theme-file-name="themeFileName"
          :theme-json-out="themeJsonOut"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useThemeBuilder } from '@/composables/useThemeBuilder'
import { getHashParam } from '@/lib/hashRouteQuery'
import FileLoader from './FileLoader.vue'
import PalettePanel from './PalettePanel.vue'
import TokenList from './TokenList.vue'
import OutputPanel from './OutputPanel.vue'

/** True when running as the embedded bookmarklet sidebar. */
const isEmbedded = getHashParam('embedded') === '1'
const loadError = ref('')

/** The three builder tabs. */
type TabId = 'aliases' | 'tokens' | 'export'
const tabs: Array<{ id: TabId, label: string }> = [
  { id: 'aliases', label: 'Color aliases' },
  { id: 'tokens', label: 'Tokens' },
  { id: 'export', label: 'Export' },
]
const activeTab = ref<TabId>('aliases')

const {
  isLoaded, loadFiles, aliasFlat, aliasOverrides, builderTokens,
  effectiveCss, themeJsonOut, aliasJsonOut, hasOverrides, unload,
  setAliasOverride, setTokenOverride, resetTokenOverride,
  themeFileName, aliasFileName, initPersistence,
} = useThemeBuilder()

/** Parses the uploaded files and surfaces any validation error. */
function onLoad(payload: { themeText: string, aliasText: string, themeName?: string, aliasName?: string }) {
  const result = loadFiles(payload.themeText, payload.aliasText, payload.themeName, payload.aliasName)
  loadError.value = result.ok ? '' : (result.error ?? 'Failed to load files.')
}

/** Returns to the file loader; warns first if the user has unsaved overrides. */
function loadDifferent() {
  if (hasOverrides.value && !window.confirm('Discard your current changes and load a different theme? Your unsaved edits will be lost.')) return
  unload()
}

/** Posts the current derived CSS to the parent page (embedded/bookmarklet mode). */
function postEmbeddedCss() {
  if (!isEmbedded) return
  window.parent.postMessage({
    type: 'kui-token-override',
    css: effectiveCss.value,
    src: window.location.href,
  }, '*')
}

/** Tells the bookmarklet to remove the sidebar iframe. */
function closeEmbedded() {
  window.parent.postMessage({ type: 'kui-close' }, '*')
}

onMounted(() => {
  // Restore persisted state first (keyed by target host in embedded mode, else 'standalone'),
  // then push the resulting CSS to the parent so a restored theme is applied immediately.
  initPersistence(isEmbedded ? (getHashParam('host') ?? undefined) : undefined)
  postEmbeddedCss()
})

if (isEmbedded) {
  watch(effectiveCss, postEmbeddedCss)
}
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.theme-builder { height: 100vh; display: flex; flex-direction: column; overflow: hidden; background: $tb-bg; color: $tb-text; font-family: 'Inter', system-ui, sans-serif; }
.tb-header { flex-shrink: 0; background: $tb-surface; border-bottom: 1px solid $tb-border; padding: 10px 20px; display: flex; align-items: center; justify-content: space-between; }
.tb-header-left { display: flex; align-items: center; gap: 12px; }
.tb-back { font-size: 13px; color: $tb-accent; text-decoration: none; &:hover { text-decoration: underline; } }
.tb-title { font-size: 16px; font-weight: 600; margin: 0; }
.tb-header-right { display: flex; align-items: center; gap: 8px; }
.tb-load-different { background: $tb-surface; color: $tb-text-muted; border: 1px solid $tb-border-active; border-radius: 5px; padding: 5px 9px; font-size: 12px; cursor: pointer; &:hover { color: $tb-text; border-color: $tb-accent; } }
.tb-close { background: $tb-surface; color: $tb-text-muted; border: 1px solid $tb-border-active; border-radius: 5px; padding: 5px 9px; cursor: pointer; }

.tb-tabs { flex-shrink: 0; display: flex; gap: 2px; background: $tb-surface; border-bottom: 1px solid $tb-border; padding: 0 12px; }
.tb-tab {
  background: none; border: none; border-bottom: 2px solid transparent;
  padding: 10px 14px; font-family: inherit; font-size: 13px; font-weight: 500;
  color: $tb-text-muted; cursor: pointer;
  &:hover { color: $tb-text-dim; }
  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: -2px; }
  &--active { color: $tb-accent; border-bottom-color: $tb-accent; }
}

.tb-tabpanel {
  flex: 1; min-height: 0; display: flex;
  > * { flex: 1; min-height: 0; overflow-y: auto; }
}
</style>
