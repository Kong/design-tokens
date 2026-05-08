<template>
  <div :class="['cust-row', { 'cust-row--modified': isOverridden, 'cust-row--no-swatch': !isAnyColor }]">
    <!-- Color swatch: only rendered for color-valued tokens -->
    <div
      v-if="isAnyColor"
      class="cust-swatch-wrap"
    >
      <!-- Hex tokens get a native color picker overlaid on the visible swatch -->
      <input
        v-if="isHex"
        class="cust-color-input"
        :title="`Pick color for ${entry.cssVar}`"
        type="color"
        :value="localValue"
        @input="(e) => handleColorInput((e.target as HTMLInputElement).value)"
      >
      <div
        :class="['cust-swatch', { 'cust-swatch--no-pick': !isHex }]"
        :style="{ background: localValue }"
      />
    </div>

    <span
      class="cust-var-name"
      :title="entry.cssVar"
    >{{ entry.cssVar }}</span>

    <input
      class="cust-value-input"
      :class="{ 'cust-value-input--invalid': showInvalid }"
      :placeholder="entry.value"
      type="text"
      :value="localValue"
      @input="(e) => handleInput((e.target as HTMLInputElement).value)"
    >

    <!-- Space is always reserved to prevent layout shift when override is added/removed -->
    <button
      class="cust-reset-btn"
      :style="{ visibility: isOverridden ? 'visible' : 'hidden' }"
      :title="`Reset to ${entry.value}`"
      @click="emit('reset', entry.cssVar, entry.value)"
    >
      ✕
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { TokenEntry } from '@/composables/useTokens'

const props = defineProps<{
  entry: TokenEntry
  /** The active override value; undefined means using the token's default. */
  overriddenValue: string | undefined
}>()

const emit = defineEmits<{
  /** Emitted on every debounced input change; parent decides whether it becomes a stored override. */
  change: [cssVar: string, value: string, defaultValue: string]
  /** Emitted when the user clicks the reset (✕) button. */
  reset: [cssVar: string, defaultValue: string]
}>()

/** Uppercases a hex color string; leaves other values unchanged. */
function toUpperHex(val: string): string {
  return /^#[0-9a-f]{3,8}$/i.test(val) ? val.toUpperCase() : val
}

/** Local input state, initialized from the active override or the token default. */
const localValue = ref(toUpperHex(props.overriddenValue ?? props.entry.value))

/**
 * Syncs the local display value when the override is cleared externally,
 * e.g. when "Reset all" is triggered from the header.
 */
watch(() => props.overriddenValue, (val) => {
  localValue.value = toUpperHex(val ?? props.entry.value)
})

const isOverridden = computed(() => props.overriddenValue !== undefined)

/** Marks the input invalid when the field is empty while an override is active (unsetting path). */
const showInvalid = computed(() => localValue.value.trim() === '' && isOverridden.value)

/** True when the current value is a 3/4/6/8-digit hex color, enabling the native color picker. */
const isHex = computed(() =>
  /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(localValue.value),
)
/** True for any CSS color syntax; used to decide whether to render the swatch column. */
const isAnyColor = computed(() => /^(#|rgb|rgba|hsl)/.test(localValue.value))

let debounceTimer: ReturnType<typeof setTimeout>

/**
 * Handles text input with a 300ms debounce.
 * Empty values propagate so the parent's `setOverride` can clear the override.
 */
function handleInput(value: string) {
  localValue.value = value
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emit('change', props.entry.cssVar, value, props.entry.value)
  }, 300)
}

/**
 * Handles the native color picker input with a shorter 80ms debounce
 * so the live preview feels snappy while dragging the color wheel.
 * The browser always returns lowercase 6-digit hex, so we uppercase it.
 */
function handleColorInput(value: string) {
  const upper = value.toUpperCase()
  localValue.value = upper
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emit('change', props.entry.cssVar, upper, props.entry.value)
  }, 80)
}
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.cust-row {
  display: grid;
  // Four columns: swatch | var name | text input | reset button
  grid-template-columns: 28px 1fr auto auto;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-bottom: 1px solid rgba(0, 10, 60, 0.04);

  &:last-child { border-bottom: none; }
  &--modified { background: $tb-accent-subtle; }
  // Non-color tokens skip the swatch column
  &--no-swatch { grid-template-columns: 1fr auto auto; }
}

.cust-swatch-wrap {
  position: relative;
  width: 24px;
  height: 24px;
  flex-shrink: 0;

  // Hover effect for the clickable color picker swatch
  &:hover .cust-swatch:not(.cust-swatch--no-pick) {
    border-color: $tb-accent;
    box-shadow: 0 0 0 2px $tb-accent-subtle;
  }
}

// Invisible <input type="color"> overlaid on the swatch to capture clicks
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
  transition: border-color 0.12s, box-shadow 0.12s;

  // Read-only color display (non-hex colors like rgba/hsl don't open a picker)
  &--no-pick { cursor: default; }
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
  &--invalid { border-color: #e53e3e; }

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
