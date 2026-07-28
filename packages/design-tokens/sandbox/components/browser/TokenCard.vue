<template>
  <button
    :class="['token-card', `token-card--${token.category}`, { 'token-card--copied': isCopied }]"
    :title="copyHint"
    type="button"
    @click="handleCopy"
  >
    <!-- Low-opacity bleed of the token color into the card background (color tokens only) -->
    <div
      v-if="token.category === 'color'"
      aria-hidden="true"
      class="card-color-aura"
      :style="{ background: token.value }"
    />

    <TokenPreview :token="token" />

    <div class="card-info">
      <span class="card-token-name">{{ tokenDisplayName(token.cssVar) }}</span>
      <span class="card-token-value">{{ token.value }}</span>
    </div>

    <span
      aria-hidden="true"
      class="card-copy-indicator"
    >
      <span v-if="isCopied">✓</span>
      <svg
        v-else
        fill="none"
        height="11"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
        width="11"
      >
        <rect
          height="13"
          rx="2"
          width="13"
          x="9"
          y="9"
        />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TokenEntry } from '@/composables/useTokens'
import { toSassVar, tokenDisplayName } from '@/composables/useTokens'
import TokenPreview from './TokenPreview.vue'

const props = defineProps<{
  token: TokenEntry
  copyFormat: 'css' | 'sass' | 'js'
  isCopied: boolean
}>()

const emit = defineEmits<{
  copy: [key: string, text: string]
}>()

/** Token text to copy, formatted per the active copyFormat. */
const copyText = computed(() => {
  if (props.copyFormat === 'sass') return toSassVar(props.token.cssVar)
  if (props.copyFormat === 'js') return props.token.key
  return `var(${props.token.cssVar})`
})

/** Tooltip text shown on hover describing the copy action. */
const copyHint = computed(() => `Click to copy: ${copyText.value}`)

/** Emits the copy event with the token key and formatted text. */
function handleCopy() {
  emit('copy', props.token.key, copyText.value)
}
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.token-card {
  // Button reset: override UA defaults so the card looks identical to the old div
  appearance: none;
  background: $tb-surface;
  border: 1px solid $tb-border;
  border-radius: 8px;
  cursor: pointer;
  // Subgrid: card spans 2 parent tracks (preview row + info row) and passes them
  // through to its children so every card in a row has identical preview/info heights.
  display: grid;
  font: inherit;
  grid-row: span 2;
  grid-template-rows: subgrid;
  overflow: hidden;
  padding: 0;
  position: relative;
  text-align: left;
  transition: border-color 0.15s, transform 0.12s, box-shadow 0.15s;

  &:hover {
    border-color: $tb-border-active;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);

    .card-copy-indicator { opacity: 1; }
  }

  &--copied {
    border-color: $tb-success;

    .card-copy-indicator {
      background: rgba(5, 150, 105, 0.08);
      border-color: $tb-success;
      color: $tb-success;
      opacity: 1;
    }
  }
}

.card-color-aura {
  inset: 0;
  opacity: 0.05;
  pointer-events: none;
  position: absolute;
  transition: opacity 0.2s;

  .token-card:hover & { opacity: 0.1; }
}

// Token name and value — allow wrapping so full names are always readable
.card-info {
  border-top: 1px solid $tb-border;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 10px 12px 9px;
}

.card-token-name {
  color: $tb-text;
  font-family: $tb-mono;
  font-size: 11px;
  line-height: 1.5;
  overflow-wrap: anywhere;
  word-break: break-all;
}

.card-token-value {
  color: $tb-text-dim;
  font-family: $tb-mono;
  font-size: 11px;
  overflow-wrap: anywhere;
  word-break: break-all;
}

// Copy indicator: hidden until hover, top-right corner
.card-copy-indicator {
  align-items: center;
  background: $tb-surface;
  border: 1px solid $tb-border-active;
  border-radius: 4px;
  color: $tb-text-dim;
  display: flex;
  font-size: 12px;
  height: 22px;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  position: absolute;
  right: 6px;
  top: 6px;
  transition: opacity 0.12s, color 0.12s, background 0.12s;
  width: 22px;
}
</style>
