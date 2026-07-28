<template>
  <SandboxShell
    :embedded="isEmbedded"
    title="Theme Builder"
    @close="close"
  >
    <template #header-actions>
      <button
        v-if="isLoaded"
        class="tb-load-different"
        title="Load a different theme"
        type="button"
        @click="loadDifferent"
      >
        ↻ Load different theme
      </button>
      <a
        aria-label="Kong Design Tokens on GitHub"
        class="tb-github"
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

    <template #tabs>
      <SandboxTabs
        v-model="activeTab"
        :tabs="tabs"
      />
    </template>

    <div class="tb-tabpanel">
      <InstructionsPanel v-show="activeTab === 'instructions'" />
      <FileLoader
        v-if="!isLoaded && activeTab !== 'instructions'"
        :error="loadError"
        @load="onLoad"
      />
      <template v-else-if="isLoaded">
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
      </template>
    </div>
  </SandboxShell>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useThemeBuilder } from '@/composables/useThemeBuilder'
import { useEmbeddedBridge } from '@/composables/useEmbeddedBridge'
import { getHashParam } from '@/utils/hashRouteQuery'
import SandboxShell from '@/components/shared/SandboxShell.vue'
import SandboxTabs from '@/components/shared/SandboxTabs.vue'
import FileLoader from './FileLoader.vue'
import InstructionsPanel from './InstructionsPanel.vue'
import PalettePanel from './PalettePanel.vue'
import TokenList from './TokenList.vue'
import OutputPanel from './OutputPanel.vue'

/** True when running as the embedded bookmarklet sidebar. */
const isEmbedded = getHashParam('embedded') === '1'
const loadError = ref('')

/** The builder tabs. Instructions is first and the default so a new user sees it immediately. */
type TabId = 'instructions' | 'aliases' | 'tokens' | 'export'
const tabs: Array<{ id: TabId, label: string }> = [
  { id: 'instructions', label: 'Instructions' },
  { id: 'aliases', label: 'Color aliases' },
  { id: 'tokens', label: 'Tokens' },
  { id: 'export', label: 'Export' },
]
const activeTab = ref<TabId>('instructions')

const {
  isLoaded, loadFiles, aliasFlat, aliasOverrides, builderTokens,
  effectiveCss, themeJsonOut, aliasJsonOut, hasOverrides, unload,
  setAliasOverride, setTokenOverride, resetTokenOverride,
  themeFileName, aliasFileName, initPersistence,
} = useThemeBuilder()

// Restore persisted state synchronously in setup so the embedded bridge's on-mount
// post reflects any restored theme. Keyed by target host in embedded mode, else 'standalone'.
initPersistence(isEmbedded ? (getHashParam('host') ?? undefined) : undefined)

const { close } = useEmbeddedBridge({ isEmbedded, css: effectiveCss })

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
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.tb-load-different { background: $tb-surface; color: $tb-text-muted; border: 1px solid $tb-border-active; border-radius: 5px; padding: 5px 9px; font-size: 12px; cursor: pointer; &:hover { color: $tb-text; border-color: $tb-accent; } }
.tb-github { display: inline-flex; align-items: center; background: $tb-surface; color: $tb-text-muted; border: 1px solid $tb-border-active; border-radius: 5px; padding: 5px 9px; text-decoration: none; &:hover { color: $tb-text; border-color: $tb-accent; } &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 2px; } }
.tb-tabpanel {
  flex: 1; min-height: 0; display: flex;
  > * { flex: 1; min-height: 0; overflow-y: auto; }
}
</style>
