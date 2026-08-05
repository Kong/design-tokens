<template>
  <div
    aria-label="Sandbox tool"
    class="sandbox-mode-switch"
    role="radiogroup"
    @keydown="onKeydown"
  >
    <button
      v-for="(opt, i) in options"
      :key="opt.id"
      ref="buttonEls"
      :aria-checked="modelValue === opt.id"
      :aria-label="opt.modified ? `${opt.label} — ${opt.modifiedTooltip || 'Modified'}` : undefined"
      :class="['sms-option', { 'sms-option--active': modelValue === opt.id }]"
      role="radio"
      :tabindex="modelValue === opt.id ? 0 : -1"
      type="button"
      @click="select(opt.id, i)"
    >
      {{ opt.label }}
      <!--
        Decorative only — the button's own aria-label above already carries the "modified"
        status and its tooltip text for screen readers, so this dot is not independently
        focusable (matches SandboxTabs.vue's same dot pattern).
      -->
      <span
        v-if="opt.modified"
        class="sms-dot-wrap"
      >
        <span
          aria-hidden="true"
          class="sms-dot"
        />
        <span
          aria-hidden="true"
          class="sms-dot-tooltip"
        >{{ opt.modifiedTooltip || 'Modified' }}</span>
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

/** A single segment in the switch. */
interface ModeOption {
  /** Stable option id (also the v-model value). */
  id: string
  /** Human-readable option label. */
  label: string
  /** Shows a small dot next to the label — e.g. unsaved/uncommitted changes for this option. */
  modified?: boolean
  /** Tooltip text for the dot. Defaults to "Modified" when `modified` is set but this is omitted. */
  modifiedTooltip?: string
}

const props = defineProps<{
  /** Exactly which options exist — this is a mutually-exclusive switch, not a tab list. */
  options: ModeOption[]
  /** Currently active option id (v-model). */
  modelValue: string
}>()
const emit = defineEmits<{ 'update:modelValue': [id: string] }>()

const buttonEls = ref<HTMLButtonElement[]>([])

function select(id: string, index: number) {
  emit('update:modelValue', id)
  buttonEls.value[index]?.focus()
}

/**
 * Arrow-key navigation between segments, matching native `role="radiogroup"` behavior: arrow
 * keys both move focus AND change the selection (unlike a tablist, where arrow keys move focus
 * only and Enter/Space commits it) — a real radio group gets this for free from `<input
 * type="radio">`; a custom `role="radio"` implementation has to do it explicitly or it's a
 * radiogroup in name only.
 */
function onKeydown(e: KeyboardEvent) {
  const currentIndex = props.options.findIndex((o) => o.id === props.modelValue)
  let nextIndex: number | null = null
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    nextIndex = (currentIndex + 1) % props.options.length
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    nextIndex = (currentIndex - 1 + props.options.length) % props.options.length
  } else if (e.key === 'Home') {
    nextIndex = 0
  } else if (e.key === 'End') {
    nextIndex = props.options.length - 1
  }
  if (nextIndex === null) return
  e.preventDefault()
  const next = props.options[nextIndex]
  if (next) select(next.id, nextIndex)
}
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.sandbox-mode-switch {
  background: $tb-surface;
  border-bottom: 1px solid $tb-border;
  display: flex;
  flex-shrink: 0;
  gap: 2px;
  padding: 8px 12px;
}

.sms-option {
  align-items: center;
  background: $tb-surface-2;
  border: 1px solid $tb-border;
  color: $tb-text-muted;
  cursor: pointer;
  display: inline-flex;
  flex: 1;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  gap: 5px;
  justify-content: center;
  padding: 7px 14px;
  transition: background 0.12s, color 0.12s, border-color 0.12s;

  // One continuous pill: square off the touching inner edges, round only the outer ones.
  &:first-child { border-radius: 6px 0 0 6px; }
  &:last-child { border-radius: 0 6px 6px 0; border-left-width: 0; }

  &:hover { color: $tb-text-dim; }

  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 2px; z-index: 1; }

  &--active {
    background: $tb-accent;
    border-color: $tb-accent;
    color: #fff;
    font-weight: 700;
    z-index: 1;

    // `.sms-option:hover`'s `color: $tb-text-dim` above has higher specificity (a class plus
    // a pseudo-class) than plain `.sms-option--active`'s `color: #fff`, so without this it wins
    // and hovering the filled/active segment silently swaps its text to dim gray on blue —
    // unreadable. Needs the same specificity (class + pseudo-class) to override it back.
    &:hover { color: #fff; filter: brightness(0.94); }
  }
}

// Modified-option dot + tooltip — same interaction pattern as `SandboxTabs.vue`'s `.st-tab-dot-*`.
.sms-dot-wrap {
  display: inline-flex;
  position: relative;
}

.sms-dot {
  background: #e53e3e;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
  height: 7px;
  width: 7px;

  // On the active (filled-accent) segment the dot needs a light ring to stay visible.
  .sms-option--active & { box-shadow: 0 0 0 1.5px #fff; }
}

.sms-dot-tooltip {
  background: $tb-text;
  border-radius: 6px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  color: $tb-bg;
  display: none;
  font-size: 11px;
  font-weight: 400;
  left: 50%;
  line-height: 1.5;
  padding: 8px 10px;
  pointer-events: none;
  position: absolute;
  text-align: left;
  top: calc(100% + 8px);
  transform: translateX(-50%);
  width: 200px;
  z-index: 100;

  &::after {
    border: 5px solid transparent;
    border-bottom-color: $tb-text;
    bottom: 100%;
    content: '';
    left: 50%;
    position: absolute;
    transform: translateX(-50%);
  }
}

.sms-dot-wrap:hover .sms-dot-tooltip,
.sms-option:focus-visible .sms-dot-tooltip { display: block; }
</style>
