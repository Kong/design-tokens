<template>
  <SandboxShell
    embedded
    title="Kong Design Tokens"
    @close="handleClose"
  >
    <!--
      One global switch for the whole sidebar — not per-tool, and top-level in the header
      (not nested under either option), so "is anything being injected into this page right now,
      and which tool's overrides" is never ambiguous no matter which option is selected. Toggling
      it off does NOT hide either tool's editor (you can keep editing while preview is off,
      same as the original per-tool toggle's behavior) — it only stops pushing CSS onto the
      target page. The info icon spells out that only the active option counts, since a user
      switching without reading closely could otherwise assume both are somehow live.
    -->
    <template #header-actions>
      <SandboxPreviewToggle
        v-model="previewEnabled"
        compact
        :info-tooltip="infoTooltip"
        :tool-label="toolLabel"
      />
    </template>

    <template #tabs>
      <SandboxModeSwitch
        v-model="selectedTool"
        :options="toolOptions"
      />
    </template>

    <div class="sue-body">
      <TokenCustomizer
        v-show="selectedTool === 'customizer'"
        ref="custRef"
        :active="selectedTool === 'customizer'"
        hosted
      />
      <ThemeBuilder
        v-show="selectedTool === 'theme-builder'"
        ref="builderRef"
        :active="selectedTool === 'theme-builder'"
        hosted
      />
    </div>
  </SandboxShell>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useEmbeddedBridge } from '@/composables/useEmbeddedBridge'
import { useThemeBuilder } from '@/composables/useThemeBuilder'
import { isSandboxTool, type SandboxTool } from '@/composables/useSandboxMode'
import { getHashParam, setHashParams } from '@/utils/hashRouteQuery'
import SandboxShell from './SandboxShell.vue'
import SandboxModeSwitch from './SandboxModeSwitch.vue'
import SandboxPreviewToggle from './SandboxPreviewToggle.vue'
import TokenCustomizer from '@/components/customizer/TokenCustomizer.vue'
import ThemeBuilder from '@/components/builder/ThemeBuilder.vue'

/**
 * Shape exposed by `TokenCustomizer.vue`/`ThemeBuilder.vue` via `defineExpose` when `hosted`.
 * `injectedCss` is a `computed` in each child, but a template ref's access to an exposed
 * property auto-unwraps top-level refs (same as template/`this` access) — so it reads here as
 * a plain string, not a `ComputedRef`. Reactivity is preserved regardless: the unwrapping read
 * still registers as a dependency of whichever computed/effect is reading it.
 */
interface HostedToolExpose {
  injectedCss: string
  buildSrc: () => string | Promise<string>
}

// `useThemeBuilder()`'s state is module-scoped (survives across mounts), so this reads the
// same `hasOverrides` the hosted `ThemeBuilder` instance itself uses — no need to reach through
// `builderRef`'s `defineExpose` for this, and it stays correct even while Theme Builder is the
// inactive/hidden tab, which is exactly when a "you have unsaved changes over there" cue matters.
const { hasOverrides: themeBuilderHasOverrides } = useThemeBuilder()

const toolOptions = computed<Array<{ id: SandboxTool, label: string, modified?: boolean, modifiedTooltip?: string }>>(() => [
  {
    id: 'theme-builder',
    label: 'Theme Builder',
    modified: themeBuilderHasOverrides.value,
    modifiedTooltip: 'Theme Builder has unsaved modifications from the loaded theme.',
  },
  { id: 'customizer', label: 'Customizer' },
])

// Only relevant on a domain's very first-ever bookmarklet click — after that, the bookmarklet's
// own restore mechanism persists the full `src` (tool included) per hostname, so re-clicking
// naturally reopens whichever tool was last selected there (see utils/preview-bookmarklet.ts).
// Theme Builder is the default when no `?tool=` is present.
const initialTool = getHashParam('tool')
const selectedTool = ref<SandboxTool>(isSandboxTool(initialTool) ? initialTool : 'theme-builder')

/**
 * The one global "is anything live on the target page" switch, replacing each tool's own
 * `SandboxPreviewToggle` when hosted (each still has its own for the standalone `?embedded=1`
 * legacy path — see `hosted` prop docs on `TokenCustomizer.vue`/`ThemeBuilder.vue`). Defaults
 * on and is not persisted, matching the original per-tool toggle's behavior.
 */
const previewEnabled = ref(true)

const toolLabel = computed(() => (selectedTool.value === 'customizer' ? 'Customizer' : 'Theme Builder'))
const otherToolLabel = computed(() => (selectedTool.value === 'customizer' ? 'Theme Builder' : 'Customizer'))
const infoTooltip = computed(() => `Only ${toolLabel.value}'s changes are live on this page right now. Select ${otherToolLabel.value} above to preview those instead.`)

const custRef = ref<HostedToolExpose | null>(null)
const builderRef = ref<HostedToolExpose | null>(null)

/**
 * The single source of truth for what's "live" on the target page. Only one bridge (below)
 * ever reads this, so there is exactly one `generation` counter and no possibility of a stale
 * tool's async post landing after a newer one's — see the plan's centralized-bridge rationale.
 */
const activeCss = computed(() => {
  if (!previewEnabled.value) return ''
  if (selectedTool.value === 'customizer') return custRef.value?.injectedCss ?? ''
  return builderRef.value?.injectedCss ?? ''
})

async function activeBuildSrc() {
  if (selectedTool.value === 'customizer' && custRef.value) return custRef.value.buildSrc()
  if (selectedTool.value === 'theme-builder' && builderRef.value) return builderRef.value.buildSrc()
  return window.location.href
}

const { post, close } = useEmbeddedBridge({ isEmbedded: true, css: activeCss, buildSrc: activeBuildSrc })

watch(selectedTool, (t) => {
  // `tool=` is always written explicitly (unlike the Customizer's own `startTheme=`, which
  // still omits its default) — write it *before* posting, so `activeBuildSrc`'s delegation
  // into a child's own hash-writing `buildSrc` (which preserves unrelated params) always sees it.
  //
  // `{ immediate: true }` is required to guarantee the hash is written on mount. If a component
  // mounts already at the default ('theme-builder'), a same-value re-selection ('theme-builder')
  // never triggers the watch (Vue watchers only fire on actual value changes, not on same-value
  // assignments). Without `immediate: true`, the hash param would never be set on mount.
  // The `useEmbeddedBridge` generation counter is monotonic (not resolution order), so the early
  // hash write doesn't cause a duplicate real postMessage — only the harmless setHashParams lands.
  setHashParams({ tool: t })
  post()
}, { immediate: true })

watch(previewEnabled, () => post())

/**
 * Flushes the latest edit to the parent before asking the bookmarklet to close. `post()` is
 * async (it awaits `activeBuildSrc()`, which for Customizer awaits real compression work) — if
 * `close()` fired first, the bookmarklet's listener removes the sidebar iframe immediately, and
 * a `kui-token-override` that resolves afterward finds no frame to apply to and is silently
 * dropped. Without this flush, an edit made just before closing never reaches the bookmarklet's
 * per-hostname restore key, so the next open on that host restores one edit behind.
 */
async function handleClose() {
  await post()
  close()
}
</script>

<style lang="scss" scoped>
.sue-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;

  > :deep(.sandbox-shell) {
    flex: 1;
    min-height: 0;
  }
}
</style>
