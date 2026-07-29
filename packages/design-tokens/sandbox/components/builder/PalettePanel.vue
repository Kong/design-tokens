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
          <button
            class="pp-chip"
            :title="entry.key"
            type="button"
            @click="toggle(entry.key)"
          >
            <span
              class="pp-swatch"
              :class="{ 'pp-swatch--modified': entry.key in aliasOverrides }"
              :style="{ background: aliasOverrides[entry.key] || entry.baseHex }"
            />
            <span class="pp-step">{{ entry.step ?? entry.family }}</span>
          </button>
          <button
            v-if="entry.key in aliasOverrides"
            class="pp-reset-btn"
            title="Reset to palette default"
            type="button"
            @click="onReset(entry.key)"
          >
            ↺
          </button>
          <ColorEditor
            v-if="openKey === entry.key"
            class="pp-editor"
            :model-value="aliasOverrides[entry.key] || entry.baseHex"
            @close="openKey = null"
            @update:model-value="(v) => emit('change', entry.key, v)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { fuzzyMatchTokens } from '@/composables/useTokens'
import type { AliasFlatEntry } from '@/utils/themeBuilderUtils'
import ColorEditor from './ColorEditor.vue'

const props = defineProps<{
  /** Flattened alias entries to render as swatches, grouped by family. */
  aliasFlat: AliasFlatEntry[]
  /** Map of alias key to overridden hex value, keyed for quick lookup. */
  aliasOverrides: Record<string, string>
}>()
const emit = defineEmits<{ change: [key: string, hex: string] }>()

/** Current search filter text, matched against family/step/key (separator-agnostic, multi-term). */
const filter = ref('')

/** When true, only entries with an active override in `aliasOverrides` are shown. */
const showOnlyModified = ref(false)

/** Number of active alias overrides, shown in the modified-only toggle label. */
const overrideCount = computed(() => Object.keys(props.aliasOverrides).length)

/** Key of the alias entry whose ColorEditor popover is currently open, or null when closed. */
const openKey = ref<string | null>(null)

/** Opens the popover for `key`, or closes it if already open. */
function toggle(key: string) {
  openKey.value = openKey.value === key ? null : key
}

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

/** Clears an alias override, falling back to the palette default (empty hex signals delete). */
function onReset(key: string) {
  emit('change', key, '')
}
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.palette-panel { padding: 12px 16px; }

.pp-heading { color: $tb-text-muted; font-size: 13px; font-weight: 600; letter-spacing: 0.05em; margin: 0 0 12px; text-transform: uppercase; }

.pp-toolbar { align-items: center; display: flex; gap: 8px; margin-bottom: 12px; }

.pp-search {
  background: none;
  border: 1px solid $tb-border;
  border-radius: 6px;
  color: $tb-text-dim;
  flex: 1;
  font-family: inherit;
  font-size: 12px;
  min-width: 0;
  padding: 4px 8px;

  &::placeholder { color: $tb-text-muted; }

  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 1px; }
}

.pp-modified-btn {
  background: none;
  border: 1px solid $tb-border;
  border-radius: 10px;
  color: $tb-text-muted;
  cursor: pointer;
  font-family: inherit;
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  transition: background 0.12s, color 0.12s, border-color 0.12s;
  white-space: nowrap;

  &:disabled { cursor: default; opacity: 0.35; }

  &:hover:not(:disabled):not(.pp-modified-btn--active) { border-color: $tb-border-active; color: $tb-text-dim; }

  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 2px; }

  &--active {
    background: $tb-accent-subtle;
    border-color: rgba(0, 68, 244, 0.25);
    color: $tb-accent;
  }
}

.pp-family { margin-bottom: 14px; }

.pp-family-name { color: $tb-text-dim; font-size: 12px; font-weight: 600; margin-bottom: 6px; text-transform: capitalize; }

.pp-chips { display: flex; flex-wrap: wrap; gap: 8px; }

.pp-chip-wrap { align-items: center; display: flex; flex-direction: column; gap: 2px; position: relative; }

.pp-chip { align-items: center; background: none; border: none; cursor: pointer; display: flex; flex-direction: column; gap: 3px; padding: 0;

  &:focus-visible { border-radius: 5px; outline: 2px solid $tb-accent; outline-offset: 2px; } }

.pp-swatch { border: 1px solid rgba(0, 0, 0, 0.15); border-radius: 5px; display: block; height: 26px; width: 26px;

  &--modified { box-shadow: 0 0 0 2px $tb-accent; } }

.pp-editor { left: 0; position: absolute; top: calc(100% + 4px); z-index: 50; }

.pp-step { color: $tb-text-muted; font-family: $tb-mono; font-size: 9px; }

.pp-reset-btn {
  background: none;
  border: none;
  color: $tb-text-muted;
  cursor: pointer;
  font-size: 11px;
  line-height: 1;
  padding: 1px 4px;

  &:hover { color: $tb-accent; }

  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 1px; }
}
</style>
