<template>
  <div class="palette-panel">
    <h3 class="pp-heading">
      Color Palette
    </h3>
    <div class="pp-toolbar">
      <input
        v-model="filter"
        aria-label="Filter palette"
        class="pp-search"
        placeholder="Filter palette…"
        type="search"
      >
      <button
        :aria-pressed="showOnlyModified"
        :class="['pp-modified-btn', { 'pp-modified-btn--active': showOnlyModified }]"
        :disabled="!overrideCount && !showOnlyModified"
        :title="showOnlyModified ? 'Show all colors' : 'Show only modified colors'"
        type="button"
        @click="showOnlyModified = !showOnlyModified"
      >
        {{ showOnlyModified ? `✕ Modified only (${overrideCount})` : `Show modified (${overrideCount})` }}
      </button>
    </div>
    <div
      v-for="family in families"
      :key="family.name"
      class="pp-family"
    >
      <div class="pp-family-name">
        {{ family.name }}
      </div>
      <div class="pp-chips">
        <div
          v-for="entry in family.entries"
          :key="entry.key"
          class="pp-chip-wrap"
        >
          <label
            class="pp-chip"
            :title="entry.key"
          >
            <span
              class="pp-swatch"
              :class="{ 'pp-swatch--modified': entry.key in aliasOverrides }"
              :style="{ background: aliasOverrides[entry.key] || entry.baseHex }"
            />
            <input
              class="pp-color-input"
              type="color"
              :value="aliasOverrides[entry.key] || entry.baseHex"
              @input="onInput(entry.key, $event)"
            >
            <span class="pp-step">{{ entry.step ?? entry.family }}</span>
          </label>
          <button
            v-if="entry.key in aliasOverrides"
            class="pp-reset-btn"
            title="Reset to palette default"
            type="button"
            @click="onReset(entry.key)"
          >
            ↺
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { fuzzyMatchTokens } from '@/composables/useTokens'
import type { AliasFlatEntry } from '@/lib/themeBuilderUtils'

const props = defineProps<{
  aliasFlat: AliasFlatEntry[]
  aliasOverrides: Record<string, string>
}>()
const emit = defineEmits<{ change: [key: string, hex: string] }>()

/** Current search filter text, matched against family/step/key (separator-agnostic, multi-term). */
const filter = ref('')

/** When true, only entries with an active override in `aliasOverrides` are shown. */
const showOnlyModified = ref(false)

/** Number of active alias overrides, shown in the modified-only toggle label. */
const overrideCount = computed(() => Object.keys(props.aliasOverrides).length)

/** Alias entries after applying the search filter and (if active) the modified-only filter. */
const visibleEntries = computed(() => {
  let entries = props.aliasFlat
  if (filter.value.trim()) {
    entries = entries.filter((e) => fuzzyMatchTokens(filter.value, e.family, e.step ?? '', e.key))
  }
  if (showOnlyModified.value) {
    entries = entries.filter((e) => e.key in props.aliasOverrides)
  }
  return entries
})

/** Groups the visible (filtered) alias entries back into families for sectioned rendering. */
const families = computed(() => {
  const map = new Map<string, AliasFlatEntry[]>()
  for (const e of visibleEntries.value) {
    if (!map.has(e.family)) map.set(e.family, [])
    map.get(e.family)!.push(e)
  }
  return [...map.entries()].map(([name, entries]) => ({ name, entries }))
})

function onInput(key: string, e: Event) {
  emit('change', key, (e.target as HTMLInputElement).value.toUpperCase())
}

/** Clears an alias override, falling back to the palette default (empty hex signals delete). */
function onReset(key: string) {
  emit('change', key, '')
}
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.palette-panel { padding: 12px 16px; }
.pp-heading { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: $tb-text-muted; margin: 0 0 12px; }
.pp-toolbar { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.pp-search {
  flex: 1;
  min-width: 0;
  font-size: 12px;
  padding: 4px 8px;
  border: 1px solid $tb-border;
  border-radius: 6px;
  background: none;
  color: $tb-text-dim;
  font-family: inherit;

  &::placeholder { color: $tb-text-muted; }
  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 1px; }
}
.pp-modified-btn {
  background: none;
  border: 1px solid $tb-border;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
  color: $tb-text-muted;
  cursor: pointer;
  padding: 2px 8px;
  font-family: inherit;
  white-space: nowrap;
  transition: background 0.12s, color 0.12s, border-color 0.12s;

  &:disabled { opacity: 0.35; cursor: default; }
  &:hover:not(:disabled):not(.pp-modified-btn--active) { color: $tb-text-dim; border-color: $tb-border-active; }
  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 2px; }
  &--active {
    background: $tb-accent-subtle;
    color: $tb-accent;
    border-color: rgba(0, 68, 244, 0.25);
  }
}
.pp-family { margin-bottom: 14px; }
.pp-family-name { font-size: 12px; font-weight: 600; color: $tb-text-dim; text-transform: capitalize; margin-bottom: 6px; }
.pp-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.pp-chip-wrap { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.pp-chip { position: relative; display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; }
.pp-swatch { width: 26px; height: 26px; border-radius: 5px; border: 1px solid rgba(0, 0, 0, 0.15); display: block; &--modified { box-shadow: 0 0 0 2px $tb-accent; } }
.pp-color-input { position: absolute; top: 0; left: 0; width: 26px; height: 26px; opacity: 0; cursor: pointer; }
.pp-step { font-size: 9px; color: $tb-text-muted; font-family: $tb-mono; }
.pp-reset-btn {
  background: none;
  border: none;
  color: $tb-text-muted;
  font-size: 11px;
  line-height: 1;
  cursor: pointer;
  padding: 1px 4px;

  &:hover { color: $tb-accent; }
  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 1px; }
}
</style>
