<template>
  <div :class="['sandbox-shell', { 'sandbox-shell--chromeless': chromeless }]">
    <header
      v-if="!chromeless"
      ref="headerEl"
      class="ss-header"
    >
      <div class="ss-header-left">
        <router-link
          v-if="!embedded"
          class="ss-back"
          to="/"
        >
          ← Browse
        </router-link>
        <h1 class="ss-title">
          {{ title }}
        </h1>
        <slot name="title-extra" />
      </div>
      <div class="ss-header-right">
        <slot name="header-actions" />
        <button
          v-if="embedded"
          class="ss-close"
          title="Close"
          type="button"
          @click="emit('close')"
        >
          ✕
        </button>
      </div>
    </header>

    <slot name="tabs" />

    <div class="ss-body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useHeaderHeight } from '@/composables/useHeaderHeight'

defineProps<{
  /** Header title text. */
  title: string
  /** When true, hides the Browse link and shows the close (✕) button. */
  embedded: boolean
  /**
   * When true, suppresses this shell's own header (title + close button) entirely and fills
   * its container's height instead of the full viewport. Used when hosted inside
   * `SandboxUnifiedEmbed.vue`, which owns a single header/close button for the whole sidebar.
   * The `#tabs` slot still renders — that's each tool's own internal navigation, not chrome.
   */
  chromeless?: boolean
}>()
const emit = defineEmits<{ close: [] }>()

const headerEl = ref<HTMLElement | null>(null)
useHeaderHeight(headerEl)
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.sandbox-shell { background: $tb-bg; color: $tb-text; display: flex; flex-direction: column; font-family: 'Inter', system-ui, sans-serif; height: 100vh; overflow: hidden;

  // Hosted inside SandboxUnifiedEmbed: fill the flex space it's given instead of re-claiming
  // the whole viewport a second time (the unified shell's own root already does that).
  &--chromeless { height: 100%; }
}

.ss-header { align-items: center; background: $tb-surface; border-bottom: 1px solid $tb-border; display: flex; flex-shrink: 0; flex-wrap: wrap; gap: 10px; justify-content: space-between; padding: 10px 20px; }

.ss-header-left { align-items: center; display: flex; gap: 12px; }

.ss-header-right { align-items: center; display: flex; flex-wrap: wrap; gap: 8px; }

.ss-back { color: $tb-accent; font-size: 13px; text-decoration: none;

  &:hover { text-decoration: underline; } }

.ss-title { font-size: 16px; font-weight: 600; margin: 0; }

.ss-close { background: $tb-surface; border: 1px solid $tb-border-active; border-radius: 5px; color: $tb-text-muted; cursor: pointer; padding: 5px 9px;

  &:hover { border-color: $tb-accent; color: $tb-text; } }

.ss-body { display: flex; flex: 1; flex-direction: column; min-height: 0; overflow: hidden; }
</style>
