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

.alias-picker { background: $tb-surface; border: 1px solid $tb-border-active; border-radius: 8px; box-shadow: 0 8px 28px rgba(0, 0, 0, 0.18); padding: 10px; width: 280px; }

.ap-search { background: $tb-bg; border: 1px solid $tb-border; border-radius: 5px; box-sizing: border-box; color: $tb-text; font-size: 12px; margin-bottom: 8px; padding: 6px 8px; width: 100%;

  &:focus-visible { border-color: $tb-accent; outline: none; } }

.ap-grid { display: grid; gap: 4px; grid-template-columns: repeat(2, 1fr); max-height: 260px; overflow-y: auto; }

.ap-item { align-items: center; background: none; border: 1px solid transparent; border-radius: 5px; cursor: pointer; display: flex; gap: 6px; padding: 4px 6px; text-align: left;

  &:hover { background: $tb-surface-2; }

  &--selected { background: $tb-accent-subtle; border-color: $tb-accent; } }

.ap-swatch { border: 1px solid rgba(0, 0, 0, 0.15); border-radius: 4px; flex-shrink: 0; height: 16px; width: 16px; }

.ap-label { color: $tb-text-dim; font-family: $tb-mono; font-size: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.ap-reset { background: none; border: 1px solid $tb-border; border-radius: 5px; color: $tb-text-muted; cursor: pointer; font-size: 11px; margin-top: 8px; padding: 5px; width: 100%;

  &:hover { border-color: $tb-border-active; color: $tb-text; } }
</style>
