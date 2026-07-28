<template>
  <div class="sandbox-shell">
    <header
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
}>()
const emit = defineEmits<{ close: [] }>()

const headerEl = ref<HTMLElement | null>(null)
useHeaderHeight(headerEl)
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.sandbox-shell { height: 100vh; display: flex; flex-direction: column; overflow: hidden; background: $tb-bg; color: $tb-text; font-family: 'Inter', system-ui, sans-serif; }
.ss-header { flex-shrink: 0; background: $tb-surface; border-bottom: 1px solid $tb-border; padding: 10px 20px; display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
.ss-header-left { display: flex; align-items: center; gap: 12px; }
.ss-header-right { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.ss-back { font-size: 13px; color: $tb-accent; text-decoration: none; &:hover { text-decoration: underline; } }
.ss-title { font-size: 16px; font-weight: 600; margin: 0; }
.ss-close { background: $tb-surface; color: $tb-text-muted; border: 1px solid $tb-border-active; border-radius: 5px; padding: 5px 9px; cursor: pointer; &:hover { color: $tb-text; border-color: $tb-accent; } }
.ss-body { flex: 1; min-height: 0; display: flex; flex-direction: column; overflow: hidden; }
</style>
