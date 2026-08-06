<template>
  <SandboxShell
    :chromeless="hosted"
    :embedded="isEmbedded"
    title="Theme Builder"
    @close="close"
  >
    <template #header-actions>
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

    <!-- Top-level switch: apply/unapply the injected stylesheet on the target page. When
         hosted inside SandboxUnifiedEmbed, that shell owns a single global switch instead. -->
    <SandboxPreviewToggle
      v-if="isEmbedded && !hosted"
      v-model="previewEnabled"
    />

    <!-- Reload-persistence is best-effort — surface it when it's actually failing (storage
         full/unavailable) instead of only discovering it after a reload loses everything. -->
    <p
      v-if="persistError"
      class="tb-persist-warning"
      role="status"
    >
      ⚠ {{ persistError }}
    </p>

    <div class="tb-tabpanel">
      <InstructionsPanel
        v-show="activeTab === 'instructions'"
        @go-to-theme="activeTab = 'theme'"
      />
      <div
        v-show="activeTab === 'theme'"
        class="tb-theme-tab"
      >
        <FileLoader
          v-if="!isLoaded"
          :error="loadError"
          @go-to-instructions="activeTab = 'instructions'"
          @load="onLoad"
        />
        <div
          v-else
          class="tb-theme-loaded"
        >
          <h2 class="tb-theme-loaded-title">
            Theme loaded
          </h2>
          <ul class="tb-theme-loaded-list">
            <li>
              <span
                aria-hidden="true"
                class="tb-theme-loaded-check"
              >✓</span>
              <code>{{ themeFileName }}</code>
            </li>
            <li>
              <span
                aria-hidden="true"
                class="tb-theme-loaded-check"
              >✓</span>
              <code>{{ aliasFileName }}</code>
            </li>
          </ul>
          <button
            class="tb-load-different"
            title="Load a different theme"
            type="button"
            @click="loadDifferent"
          >
            ↻ Load different theme
          </button>
        </div>
      </div>
      <template v-if="isLoaded">
        <PalettePanel
          v-show="activeTab === 'aliases'"
          :alias-flat="aliasFlat"
          :alias-overrides="aliasOverrides"
          @change="setAliasOverride"
          @reset-all="resetAllAliasOverrides"
        />
        <TokenList
          v-show="activeTab === 'tokens'"
          :alias-flat="aliasFlat"
          :tokens="builderTokens"
          @reset="resetTokenOverride"
          @reset-all="resetAllTokenOverrides"
          @set="setTokenOverride"
        />
        <OutputPanel
          v-show="activeTab === 'export'"
          :alias-file-name="aliasFileName"
          :alias-json-out="aliasJsonOut"
          :css="effectiveCss"
          :has-overrides="hasOverrides"
          :theme-file-name="themeFileName"
          :theme-json-out="themeJsonOut"
        />
      </template>
    </div>
  </SandboxShell>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useThemeBuilder } from '@/composables/useThemeBuilder'
import { useEmbeddedBridge } from '@/composables/useEmbeddedBridge'
import { getHashParam } from '@/utils/hashRouteQuery'
import { hardenCssPrecedence } from '@/utils/cssUtils'
import SandboxShell from '@/components/shared/SandboxShell.vue'
import SandboxTabs from '@/components/shared/SandboxTabs.vue'
import SandboxPreviewToggle from '@/components/shared/SandboxPreviewToggle.vue'
import FileLoader from './FileLoader.vue'
import InstructionsPanel from './InstructionsPanel.vue'
import PalettePanel from './PalettePanel.vue'
import TokenList from './TokenList.vue'
import OutputPanel from './OutputPanel.vue'

const props = defineProps<{
  /**
   * True when mounted inside `SandboxUnifiedEmbed.vue`'s mode switcher rather than standalone.
   * Suppresses this tool's own `SandboxShell` header/close chrome and its own postMessage
   * bridge (the unified shell owns one bridge for the whole sidebar and reads `injectedCss`/
   * `buildSrc` via `defineExpose` instead). Default false = today's standalone behavior.
   */
  hosted?: boolean
  /**
   * True when this tool is the one currently visible in the sidebar. Irrelevant unless
   * `hosted`, since a non-hosted instance is always the only one. Unused today (Theme Builder
   * has no global-listener shortcut like Customizer's search), kept for contract symmetry.
   */
  active?: boolean
}>()

/** True when running as the embedded bookmarklet sidebar. */
const isEmbedded = getHashParam('embedded') === '1'
const loadError = ref('')

/** The builder tabs. Instructions is first and the default so a new user sees it immediately. */
type TabId = 'instructions' | 'theme' | 'aliases' | 'tokens' | 'export'
const activeTab = ref<TabId>('instructions')

const {
  isLoaded, loadFiles, aliasFlat, aliasOverrides, tokenOverrides, builderTokens,
  effectiveCss, themeJsonOut, aliasJsonOut, hasOverrides, unload,
  setAliasOverride, setTokenOverride, resetTokenOverride,
  themeFileName, aliasFileName, initPersistence, persistError,
} = useThemeBuilder()

/** True once at least one color alias has been overridden from the loaded theme's value. */
const hasAliasOverrides = computed(() => Object.keys(aliasOverrides).length > 0)
/** True once at least one token has been overridden from the loaded theme's value. */
const hasTokenOverrides = computed(() => Object.keys(tokenOverrides).length > 0)

const tabs = computed<Array<{ id: TabId, label: string, modified?: boolean, modifiedTooltip?: string, disabled?: boolean }>>(() => [
  { id: 'instructions', label: 'Instructions' },
  { id: 'theme', label: 'Theme' },
  {
    id: 'aliases',
    label: 'Color aliases',
    disabled: !isLoaded.value,
    modified: hasAliasOverrides.value,
    modifiedTooltip: 'One or more color aliases have been modified from the loaded theme.',
  },
  {
    id: 'tokens',
    label: 'Tokens',
    disabled: !isLoaded.value,
    modified: hasTokenOverrides.value,
    modifiedTooltip: 'One or more tokens have been modified from the loaded theme.',
  },
  { id: 'export', label: 'Export', disabled: !isLoaded.value },
])

// Restore persisted state synchronously in setup so the embedded bridge's on-mount
// post reflects any restored theme. Keyed by target host in embedded mode, else 'standalone'.
initPersistence(isEmbedded ? (getHashParam('host') ?? undefined) : undefined)

/**
 * Clears every color alias override (confirmed already by `PalettePanel.vue` before emitting).
 * Scoped to aliases only — clearing token overrides too from this button would silently wipe
 * changes the user can't see from the Aliases tab they're looking at.
 */
function resetAllAliasOverrides() {
  for (const k in aliasOverrides) delete aliasOverrides[k]
}

/** Clears every token override (confirmed already by `TokenList.vue` before emitting). Scoped to tokens only — see `resetAllAliasOverrides`. */
function resetAllTokenOverrides() {
  for (const k in tokenOverrides) delete tokenOverrides[k]
}

/**
 * Whether the injected stylesheet is applied on the target page. Toggled from the top of
 * the embedded panel so designers can compare before/after without unloading the theme.
 */
const previewEnabled = ref(true)

/**
 * CSS pushed to the host page: precedence-hardened so it wins over the page's own token
 * declarations, or empty when preview is toggled off. The Export panel keeps showing the
 * clean `effectiveCss`.
 */
const injectedCss = computed(() => previewEnabled.value ? hardenCssPrecedence(effectiveCss.value) : '')

/**
 * Only run this component's own postMessage bridge when it's the sole embedded instance
 * (standalone `?embedded=1` route). When `hosted`, `SandboxUnifiedEmbed.vue` owns the single
 * bridge for the whole sidebar and reads `injectedCss`/`buildSrc` via `defineExpose` below —
 * running a second bridge here would race it (two independent `generation` counters).
 *
 * A plain boolean, not a computed ref: `useEmbeddedBridge` checks this option's truthiness
 * directly (`if (opts.isEmbedded)`), so passing a ref object here would always be truthy
 * regardless of its `.value`. `hosted` is a prop set once at mount and never toggles for the
 * lifetime of an instance, so no reactivity is needed.
 */
const bridgeEnabled = isEmbedded && !props.hosted
const { close } = useEmbeddedBridge({ isEmbedded: bridgeEnabled, css: injectedCss })

// This component's own bridge call above passes no `buildSrc`, so it defaults to
// `window.location.href` (see useEmbeddedBridge.ts) — expose that same fallback so
// SandboxUnifiedEmbed's delegation doesn't need to special-case "this tool has no custom buildSrc".
defineExpose({ injectedCss, buildSrc: () => window.location.href })

/**
 * Parses the loaded theme's files and surfaces any validation error. On success, advances off the
 * Theme tab straight to Color aliases — staying on Theme would just show the loaded-file
 * summary, which isn't where editing happens.
 */
function onLoad(payload: { themeText: string, aliasText: string, themeName?: string, aliasName?: string }) {
  const result = loadFiles(payload.themeText, payload.aliasText, payload.themeName, payload.aliasName)
  if (result.ok) {
    loadError.value = ''
    activeTab.value = 'aliases'
  } else {
    loadError.value = result.error ?? 'Failed to load files.'
  }
}

/**
 * Returns to the file loader; always confirms first, since loading a different theme discards
 * the current one (and any unsaved overrides) regardless of whether changes were made. Also
 * moves back to the Theme tab — Aliases/Tokens/Export are disabled once unloaded, so staying on
 * whichever of those was active would leave the user on a now-disabled tab.
 */
function loadDifferent() {
  const message = hasOverrides.value
    ? 'Discard your current changes and load a different theme? Your unsaved edits will be lost.'
    : 'Load a different theme? Your currently loaded theme will be cleared.'
  if (!window.confirm(message)) return
  unload()
  activeTab.value = 'theme'
}
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.tb-theme-loaded { color: $tb-text; margin: 60px auto; max-width: 460px; padding: 0 20px; }

.tb-theme-loaded-title { font-size: 20px; font-weight: 600; margin: 0 0 16px; }

.tb-theme-loaded-list { list-style: none; margin: 0 0 24px; padding: 0;

  li { align-items: center; display: flex; font-size: 13px; gap: 8px; margin-bottom: 8px; }

  code { background: $tb-surface-2; border-radius: 3px; font-family: $tb-mono; font-size: 12px; padding: 1px 5px; } }

.tb-theme-loaded-check { color: $tb-accent; font-weight: 700; }

.tb-load-different { background: $tb-surface; border: 1px solid $tb-border-active; border-radius: 6px; color: $tb-text; cursor: pointer; font-size: 13px; font-weight: 600; padding: 10px; width: 100%;

  &:hover { border-color: $tb-accent; } }

.tb-github { align-items: center; background: $tb-surface; border: 1px solid $tb-border-active; border-radius: 5px; color: $tb-text-muted; display: inline-flex; padding: 5px 9px; text-decoration: none;

  &:hover { border-color: $tb-accent; color: $tb-text; }

  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 2px; } }

.tb-persist-warning {
  background: #fef2f2;
  border-bottom: 1px solid rgba(239, 68, 68, 0.3);
  color: #b91c1c;
  flex-shrink: 0;
  font-size: 12px;
  line-height: 1.5;
  margin: 0;
  padding: 8px 12px;
}

.tb-tabpanel { display: flex;
  flex: 1; min-height: 0;

  > * { flex: 1; min-height: 0; overflow-y: auto; }
}
</style>
