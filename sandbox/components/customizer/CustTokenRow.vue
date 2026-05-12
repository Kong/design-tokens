<template>
  <div :class="['cust-row', { 'cust-row--modified': isOverridden && !showInvalid, 'cust-row--invalid': showInvalid, 'cust-row--no-swatch': !isColorEntry }]">
    <!-- Color swatch: rendered for all color-valued tokens (based on entry default, not current input) -->
    <div
      v-if="isColorEntry"
      class="cust-swatch-wrap"
    >
      <!-- Hex tokens get a native color picker overlaid on the visible swatch -->
      <input
        v-if="isHex"
        :aria-label="`Pick color for ${entry.cssVar}`"
        class="cust-color-input"
        :title="`Pick color for ${entry.cssVar}`"
        type="color"
        :value="isValidColor ? localValue : entry.value"
        @input="(e) => handleColorInput((e.target as HTMLInputElement).value)"
      >
      <!-- Show default value in swatch when current input is invalid -->
      <div
        :class="['cust-swatch', { 'cust-swatch--no-pick': !isHex }]"
        :style="{ background: isValidColor ? localValue : entry.value }"
      />
    </div>

    <span
      class="cust-var-name"
      :title="entry.cssVar"
    >{{ entry.cssVar }}</span>

    <div class="cust-value-wrap">
      <input
        :id="entry.cssVar.slice(2)"
        :aria-label="`Value for ${entry.cssVar}`"
        class="cust-value-input"
        :class="{ 'cust-value-input--invalid': showInvalid }"
        :placeholder="entry.value"
        type="text"
        :value="localValue"
        @input="(e) => handleInput((e.target as HTMLInputElement).value)"
      >
      <span
        v-if="showInvalid"
        class="cust-error-icon"
        :title="`Invalid value — default &quot;${entry.value}&quot; is used until fixed`"
      >
        <svg
          fill="none"
          height="13"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-width="1.5"
          viewBox="0 0 16 16"
          width="13"
        >
          <circle
            cx="8"
            cy="8"
            r="6.5"
          />
          <path d="M8 4.5v4" />
          <circle
            cx="8"
            cy="11.5"
            fill="currentColor"
            r="0.75"
            stroke="none"
          />
        </svg>
      </span>
    </div>

    <!-- Space always reserved to prevent layout shift when override is added/removed -->
    <button
      class="cust-reset-btn"
      :style="{ visibility: isOverridden || localValue !== toUpperHex(entry.value) ? 'visible' : 'hidden' }"
      :title="`Reset to ${entry.value}`"
      @click="handleReset"
    >
      ✕
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
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
 * Debounced copy of localValue — updated in the debounce callback alongside emit.
 * showInvalid uses this so the error state doesn't flicker while the user is typing.
 */
const validatedValue = ref(localValue.value)

/**
 * Syncs the local display value when the override is cleared externally,
 * e.g. when "Reset all" is triggered from the header.
 */
watch(() => props.overriddenValue, (val) => {
  const resolved = toUpperHex(val ?? props.entry.value)
  localValue.value = resolved
  validatedValue.value = resolved
})

const isOverridden = computed(() => props.overriddenValue !== undefined)

/** True when the token's default value is a CSS color — determines swatch visibility and validation. */
const isColorEntry = computed(() => /^(#|rgb|rgba|hsl)/i.test(props.entry.value))

/**
 * True when the current input is a valid CSS color, using browser-native validation.
 * Always true for non-color tokens (no validation applied).
 * Empty input is considered valid here — emptiness is handled separately by showInvalid.
 */
const isValidColor = computed(() => {
  if (!isColorEntry.value) return true
  const v = localValue.value.trim()
  if (!v) return true
  return CSS.supports('color', v)
})

/**
 * Show the error state when:
 *  - the field is empty while an override is active (user is trying to clear)
 *  - the token is a color and the current value is not a valid CSS color
 * Uses validatedValue (debounced) so the error doesn't appear while the user is mid-type.
 */
const showInvalid = computed(() => {
  const v = validatedValue.value.trim()
  return (v === '' && isOverridden.value) ||
    (isColorEntry.value && v !== '' && !CSS.supports('color', v))
})

/** True when the current value is a 3/4/6/8-digit hex color, enabling the native color picker. */
const isHex = computed(() =>
  /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(localValue.value),
)

let debounceTimer: ReturnType<typeof setTimeout>
onUnmounted(() => clearTimeout(debounceTimer))

/**
 * Handles text input with a 300ms debounce.
 * For color tokens, emits an empty string when the value is not a valid CSS color so that
 * `setOverride` clears the override and the live preview falls back to the token default.
 * The invalid value stays visible in the input so the user can see and fix it.
 */
function handleInput(value: string) {
  localValue.value = value
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    validatedValue.value = value
    const v = value.trim()
    const emitValue = isColorEntry.value && v && !CSS.supports('color', v) ? '' : value
    emit('change', props.entry.cssVar, emitValue, props.entry.value)
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
    validatedValue.value = upper
    emit('change', props.entry.cssVar, upper, props.entry.value)
  }, 80)
}

/** Resets local state immediately and notifies the parent. */
function handleReset() {
  clearTimeout(debounceTimer)
  localValue.value = toUpperHex(props.entry.value)
  validatedValue.value = localValue.value
  emit('reset', props.entry.cssVar, props.entry.value)
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
  &--invalid { background: rgba(239, 68, 68, 0.07); }
  // Non-color tokens skip the swatch column
  &--no-swatch { grid-template-columns: 1fr auto auto; }
}

.cust-swatch-wrap {
  position: relative;
  width: 24px;
  height: 24px;
  flex-shrink: 0;

  // Grow + shadow on hover signals the swatch is clickable (like the token cards)
  &:hover .cust-swatch:not(.cust-swatch--no-pick) {
    transform: scale(1.15);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.22);
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
  transition: transform 0.12s, box-shadow 0.12s;

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
  width: 96px;
  box-sizing: border-box;

  &:focus-visible { border-color: $tb-accent; outline: none; }
  &--invalid { border-color: #e53e3e; padding-right: 24px; }

  @media (max-width: 640px) { width: 80px; }
}

.cust-value-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.cust-error-icon {
  position: absolute;
  right: 6px;
  display: inline-flex;
  align-items: center;
  color: #e53e3e;
  cursor: default;
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
