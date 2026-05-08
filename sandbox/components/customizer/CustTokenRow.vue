<template>
  <div :class="['cust-row', { 'cust-row--modified': isOverridden }]">
    <!-- Hex colors get a native <input type="color"> picker; other colors show a read-only swatch -->
    <div
      v-if="isHex"
      class="cust-swatch-wrap"
    >
      <input
        class="cust-color-input"
        :title="`Pick color for ${entry.cssVar}`"
        type="color"
        :value="currentValue"
        @input="(e) => emit('change', entry.cssVar, (e.target as HTMLInputElement).value, entry.value)"
      >
      <div
        class="cust-swatch"
        :style="{ background: currentValue }"
      />
    </div>
    <div
      v-else-if="isAnyColor"
      class="cust-swatch-wrap"
    >
      <div
        class="cust-swatch cust-swatch--no-pick"
        :style="{ background: currentValue }"
      />
    </div>
    <div
      v-else
      class="cust-swatch-wrap"
    >
      <div class="cust-swatch cust-swatch--value" />
    </div>

    <span
      class="cust-var-name"
      :title="entry.cssVar"
    >{{ entry.cssVar }}</span>

    <input
      class="cust-value-input"
      :placeholder="entry.value"
      type="text"
      :value="currentValue"
      @change="(e) => emit('change', entry.cssVar, (e.target as HTMLInputElement).value, entry.value)"
    >

    <button
      v-if="isOverridden"
      class="cust-reset-btn"
      :title="`Reset to ${entry.value}`"
      @click="emit('reset', entry.cssVar, entry.value)"
    >
      ✕
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TokenEntry } from '@/composables/useTokens'

const props = defineProps<{
  entry: TokenEntry
  /** The active override value; undefined means using the token's default. */
  overriddenValue: string | undefined
}>()

const emit = defineEmits<{
  /** User changed the value; parent decides whether it becomes an override. */
  change: [cssVar: string, value: string, defaultValue: string]
  /** User clicked the reset button. */
  reset: [cssVar: string, defaultValue: string]
}>()

const currentValue = computed(() => props.overriddenValue ?? props.entry.value)
const isOverridden = computed(() => props.overriddenValue !== undefined)

const isHex = computed(() =>
  /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(currentValue.value),
)
const isAnyColor = computed(() => /^(#|rgb|rgba|hsl)/.test(currentValue.value))
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.cust-row {
  display: grid;
  grid-template-columns: 28px 1fr auto auto;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-bottom: 1px solid rgba(0, 10, 60, 0.04);

  &:last-child { border-bottom: none; }
  &--modified { background: $tb-accent-subtle; }
}

.cust-swatch-wrap {
  position: relative;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

// Invisible <input type="color"> sits on top of the visible swatch
.cust-color-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
  padding: 0;
  border: none;
}

.cust-swatch {
  width: 22px;
  height: 22px;
  border-radius: 4px;
  border: 1px solid $tb-border-active;
  pointer-events: none;

  &--no-pick { cursor: default; }
  &--value { background: $tb-surface-2; }
}

.cust-var-name {
  font-family: $tb-mono;
  font-size: 11px;
  color: $tb-text-dim;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}

.cust-value-input {
  font-family: $tb-mono;
  font-size: 11px;
  color: $tb-text;
  background: $tb-bg;
  border: 1px solid $tb-border;
  border-radius: 4px;
  padding: 3px 7px;
  width: 120px;

  &:focus-visible { border-color: $tb-accent; outline: none; }

  @media (max-width: 640px) { width: 80px; }
}

.cust-reset-btn {
  background: none;
  border: none;
  color: $tb-text-muted;
  cursor: pointer;
  font-size: 11px;
  padding: 2px 4px;
  border-radius: 3px;
  line-height: 1;

  &:hover { color: $tb-text; background: $tb-surface-2; }
  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 2px; }
}
</style>
