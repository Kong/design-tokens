<template>
  <div class="token-list">
    <div class="tl-search-wrap">
      <div class="tl-search-input-wrap">
        <input
          v-model="filter"
          class="tl-search"
          placeholder="Filter tokens…"
          type="search"
        >
        <button
          v-if="filter"
          aria-label="Clear filter"
          class="tl-search-clear"
          type="button"
          @click="filter = ''"
        >
          <svg
            fill="none"
            height="12"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="2.5"
            viewBox="0 0 24 24"
            width="12"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      <button
        :aria-pressed="showModifiedOnly"
        :class="['tl-modified-btn', { 'tl-modified-btn--active': showModifiedOnly }]"
        :disabled="modifiedCount === 0 && !showModifiedOnly"
        :title="showModifiedOnly ? 'Show all tokens' : 'Show only modified tokens'"
        @click="showModifiedOnly = !showModifiedOnly"
      >
        {{ showModifiedOnly ? `✕ Modified only (${modifiedCount})` : `Show modified (${modifiedCount})` }}
      </button>
      <button
        v-if="modifiedCount > 0"
        class="tl-reset-btn"
        title="Clear all token overrides"
        @click="handleResetAll"
      >
        Reset all
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
import type { AliasFlatEntry, BuilderToken } from '@/utils/themeBuilderUtils'

const props = defineProps<{
  /** Builder tokens to list, in their current (overridden or default) state. */
  tokens: BuilderToken[]
  /** Flattened alias entries passed through to each row's alias picker. */
  aliasFlat: AliasFlatEntry[]
}>()
const emit = defineEmits<{ set: [key: string, value: string], reset: [key: string], resetAll: [] }>()

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

/** Confirms with the user before clearing all token overrides to prevent accidental resets. */
function handleResetAll() {
  if (!window.confirm('Reset all token overrides? This will restore every token to its inherited/loaded value.')) return
  emit('resetAll')
}
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.token-list { display: flex; flex-direction: column; }

.tl-search-wrap { align-items: center; background: $tb-surface; border-bottom: 1px solid $tb-border; display: flex; gap: 8px; padding: 10px 12px; position: sticky; top: 0; z-index: 5; }

.tl-search-input-wrap { flex: 1; position: relative; }

.tl-search { background: $tb-bg; border: 1px solid $tb-border; border-radius: 5px; box-sizing: border-box; color: $tb-text; font-size: 13px; padding: 6px 28px 6px 10px; width: 100%;

  &:focus-visible { border-color: $tb-accent; outline: none; }
  // Hide the browser-native clear button — we use our own
  &::-webkit-search-cancel-button { display: none; } }

.tl-search-clear {
  align-items: center;
  background: $tb-surface-2;
  border: 1px solid $tb-border;
  border-radius: 3px;
  color: $tb-text-muted;
  cursor: pointer;
  display: flex;
  line-height: 1;
  padding: 2px 3px;
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);

  &:hover { background: $tb-border; color: $tb-text; }

  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 1px; }
}

.tl-modified-btn {
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

  &:hover:not(:disabled):not(.tl-modified-btn--active) { border-color: $tb-border-active; color: $tb-text-dim; }

  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 2px; }

  &--active {
    background: $tb-accent-subtle;
    border-color: rgba(0, 68, 244, 0.25);
    color: $tb-accent;
  }
}

.tl-reset-btn {
  background: none;
  border: 1px solid $tb-border;
  border-radius: 10px;
  color: #ef4444;
  cursor: pointer;
  font-family: inherit;
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  transition: background 0.12s, border-color 0.12s;
  white-space: nowrap;

  &:hover { background: rgba(239, 68, 68, 0.07); border-color: rgba(239, 68, 68, 0.35); }

  &:focus-visible { outline: 2px solid #ef4444; outline-offset: 2px; }
}

.tl-empty { color: $tb-text-muted; font-size: 14px; padding: 40px 20px; text-align: center; }
</style>
