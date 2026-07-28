<template>
  <div class="alias-picker">
    <input
      v-model="query"
      class="ap-search"
      placeholder="Search aliases…"
      spellcheck="false"
    >
    <div class="ap-grid">
      <button
        v-for="entry in filtered"
        :key="entry.key"
        class="ap-item"
        :class="{ 'ap-item--selected': entry.key === selectedKey }"
        :title="entry.key"
        @click="pick(entry)"
      >
        <span
          class="ap-swatch"
          :style="{ background: entry.baseHex }"
        />
        <span class="ap-label">{{ entry.key }}</span>
      </button>
    </div>
    <button
      class="ap-reset"
      @click="emit('reset')"
    >
      Reset to theme default
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { AliasFlatEntry } from '@/utils/themeBuilderUtils'

const props = defineProps<{
  /** Flattened alias entries to render as swatches. */
  aliasFlat: AliasFlatEntry[]
  /** The `family.step` key of the currently selected alias, for highlighting. */
  selectedKey?: string | null
}>()
const emit = defineEmits<{ select: [ref: string], reset: [] }>()

const query = ref('')

const filtered = computed(() => {
  const q = query.value.toLowerCase().trim()
  if (!q) return props.aliasFlat
  return props.aliasFlat.filter(
    (e) => e.key.toLowerCase().includes(q) || e.baseHex.toLowerCase().includes(q),
  )
})

/** Emits the alias ref string for the chosen entry. */
function pick(entry: AliasFlatEntry) {
  const ref = entry.step
    ? `{color.alias.${entry.family}.${entry.step}}`
    : `{color.alias.${entry.family}}`
  emit('select', ref)
}
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.alias-picker { width: 280px; background: $tb-surface; border: 1px solid $tb-border-active; border-radius: 8px; padding: 10px; box-shadow: 0 8px 28px rgba(0, 0, 0, 0.18); }
.ap-search { width: 100%; box-sizing: border-box; background: $tb-bg; border: 1px solid $tb-border; border-radius: 5px; padding: 6px 8px; font-size: 12px; color: $tb-text; margin-bottom: 8px; &:focus-visible { border-color: $tb-accent; outline: none; } }
.ap-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px; max-height: 260px; overflow-y: auto; }
.ap-item { display: flex; align-items: center; gap: 6px; background: none; border: 1px solid transparent; border-radius: 5px; padding: 4px 6px; cursor: pointer; text-align: left; &:hover { background: $tb-surface-2; } &--selected { border-color: $tb-accent; background: $tb-accent-subtle; } }
.ap-swatch { width: 16px; height: 16px; border-radius: 4px; border: 1px solid rgba(0, 0, 0, 0.15); flex-shrink: 0; }
.ap-label { font-family: $tb-mono; font-size: 10px; color: $tb-text-dim; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ap-reset { width: 100%; margin-top: 8px; background: none; border: 1px solid $tb-border; border-radius: 5px; padding: 5px; font-size: 11px; color: $tb-text-muted; cursor: pointer; &:hover { color: $tb-text; border-color: $tb-border-active; } }
</style>
