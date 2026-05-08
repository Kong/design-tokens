<template>
  <div
    :class="['token-card', `token-card--${token.category}`, { 'token-card--copied': isCopied }]"
    :title="copyHint"
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

    <div
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
    </div>
  </div>
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

const copyText = computed(() => {
  if (props.copyFormat === 'sass') return toSassVar(props.token.cssVar)
  if (props.copyFormat === 'js') return props.token.key
  return `var(${props.token.cssVar})`
})

const copyHint = computed(() => `Click to copy: ${copyText.value}`)

function handleCopy() {
  emit('copy', props.token.key, copyText.value)
}
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.token-card {
  position: relative;
  background: $tb-surface;
  border: 1px solid $tb-border;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.15s, transform 0.12s, box-shadow 0.15s;
  // Subgrid: card spans 2 parent tracks (preview row + info row) and passes them
  // through to its children so every card in a row has identical preview/info heights.
  display: grid;
  grid-row: span 2;
  grid-template-rows: subgrid;

  &:hover {
    border-color: $tb-border-active;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

    .card-copy-indicator { opacity: 1; }
  }

  &--copied {
    border-color: $tb-success;

    .card-copy-indicator {
      opacity: 1;
      color: $tb-success;
      background: rgba(5, 150, 105, 0.08);
      border-color: $tb-success;
    }
  }
}

.card-color-aura {
  position: absolute;
  inset: 0;
  opacity: 0.05;
  pointer-events: none;
  transition: opacity 0.2s;

  .token-card:hover & { opacity: 0.1; }
}

// Token name and value — allow wrapping so full names are always readable
.card-info {
  padding: 10px 12px 9px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  border-top: 1px solid $tb-border;
}

.card-token-name {
  font-family: $tb-mono;
  font-size: 11px;
  color: $tb-text;
  line-height: 1.5;
  word-break: break-all;
  overflow-wrap: anywhere;
}

.card-token-value {
  font-family: $tb-mono;
  font-size: 11px;
  color: $tb-text-dim;
  word-break: break-all;
  overflow-wrap: anywhere;
}

// Copy indicator: hidden until hover, top-right corner
.card-copy-indicator {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  background: $tb-surface;
  border: 1px solid $tb-border-active;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: $tb-text-dim;
  opacity: 0;
  transition: opacity 0.12s, color 0.12s, background 0.12s;
  pointer-events: none;
}
</style>
