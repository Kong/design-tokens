<template>
  <div class="token-list">
    <div class="tl-search-wrap">
      <input
        v-model="filter"
        class="tl-search"
        placeholder="Filter tokens…"
        type="search"
      >
      <button
        :aria-pressed="showModifiedOnly"
        :class="['tl-modified-btn', { 'tl-modified-btn--active': showModifiedOnly }]"
        :disabled="modifiedCount === 0 && !showModifiedOnly"
        :title="showModifiedOnly ? 'Show all tokens' : 'Show only modified tokens'"
        @click="showModifiedOnly = !showModifiedOnly"
      >
        {{ showModifiedOnly ? `✕ Modified only (${modifiedCount})` : `Show modified (${modifiedCount})` }}
      </button>
    </div>
    <TokenRow
      v-for="token in visible"
      :key="token.key"
      :alias-flat="aliasFlat"
      :token="token"
      @reset="(k) => emit('reset', k)"
      @set="(k, v) => emit('set', k, v)"
    />
    <div
      v-if="visible.length === 0"
      class="tl-empty"
    >
      No tokens match "{{ filter }}"
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import TokenRow from './TokenRow.vue'
import { fuzzyMatchTokens } from '@/composables/useTokens'
import type { AliasFlatEntry, BuilderToken } from '@/lib/themeBuilderUtils'

const props = defineProps<{ tokens: BuilderToken[], aliasFlat: AliasFlatEntry[] }>()
const emit = defineEmits<{ set: [key: string, value: string], reset: [key: string] }>()

/** Current text entered in the search input, used for fuzzy-matching against token CSS var names. */
const filter = ref('')

/** Whether the list is restricted to tokens with an overridden (modified) source. */
const showModifiedOnly = ref(false)

/** Count of tokens currently overridden (i.e. modified from their inherited/empty default). */
const modifiedCount = computed(() => props.tokens.filter((t) => t.source === 'overridden').length)

/** Tokens shown in the list: must match the search filter, and — when the modified-only toggle is active — must also be overridden. */
const visible = computed(() => props.tokens.filter((t) => {
  if (showModifiedOnly.value && t.source !== 'overridden') return false
  return fuzzyMatchTokens(filter.value, t.cssVar)
}))
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.token-list { display: flex; flex-direction: column; }
.tl-search-wrap { position: sticky; top: 0; display: flex; align-items: center; gap: 8px; background: $tb-surface; padding: 10px 12px; border-bottom: 1px solid $tb-border; z-index: 5; }
.tl-search { flex: 1; width: 100%; box-sizing: border-box; background: $tb-bg; border: 1px solid $tb-border; border-radius: 5px; padding: 6px 10px; font-size: 13px; color: $tb-text; &:focus-visible { border-color: $tb-accent; outline: none; } }
.tl-modified-btn {
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
  &:hover:not(:disabled):not(.tl-modified-btn--active) { color: $tb-text-dim; border-color: $tb-border-active; }
  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 2px; }
  &--active {
    background: $tb-accent-subtle;
    color: $tb-accent;
    border-color: rgba(0, 68, 244, 0.25);
  }
}
.tl-empty { padding: 40px 20px; text-align: center; color: $tb-text-muted; font-size: 14px; }
</style>
