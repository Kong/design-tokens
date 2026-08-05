<template>
  <div :class="['preview-toggle', { 'preview-toggle--compact': compact }]">
    <button
      :aria-checked="modelValue"
      :aria-label="toolLabel ? `Toggle live preview for ${toolLabel}` : 'Toggle live preview'"
      class="preview-toggle-switch"
      :class="{ 'preview-toggle-switch--on': modelValue }"
      role="switch"
      type="button"
      @click="emit('update:modelValue', !modelValue)"
    >
      <span class="preview-toggle-track">
        <span class="preview-toggle-knob" />
      </span>
      <span class="preview-toggle-text">
        <!--
          The active tool is already named prominently by the mode switch above this toggle —
          repeating it here (an earlier iteration read "Theme Builder Preview: Enabled" right
          next to a "Theme Builder" segment) was redundant and confusing. This toggle's only job
          is the on/off state; scope ("only the active mode") is explained by the info tooltip.
        -->
        <template v-if="compact">
          Live preview:
          <strong :class="modelValue ? 'is-on' : 'is-off'">{{ modelValue ? 'On' : 'Off' }}</strong>
        </template>
        <template v-else>
          {{ modelValue ? 'Live preview on' : 'Live preview off' }}
        </template>
      </span>
    </button>
    <span
      v-if="infoTooltip"
      class="preview-toggle-info-wrap"
    >
      <span
        aria-label="About the preview toggle"
        class="preview-toggle-info-icon"
        tabindex="0"
      >?</span>
      <span
        class="preview-toggle-info-body"
        role="tooltip"
      >{{ infoTooltip }}</span>
    </span>
    <span
      v-if="!compact"
      class="preview-toggle-hint"
    >
      {{ modelValue ? onHint : 'Showing the page’s original tokens' }}
    </span>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  /** Whether the injected token stylesheet is applied to the target page. */
  modelValue: boolean
  /** Hint text shown below the switch when `modelValue` is true. Ignored when `compact`. */
  onHint?: string
  /**
   * Names which tool this switch currently controls (e.g. the active mode in
   * `SandboxUnifiedEmbed.vue`), for the switch's `aria-label` only — not shown visually, since
   * the mode switch above already names the active tool more prominently than this toggle
   * could. Omit for the original single-tool usage, which has nothing to disambiguate.
   */
  toolLabel?: string
  /** Tooltip text for an info icon next to the switch. Omit to hide the icon entirely. */
  infoTooltip?: string
  /**
   * Single-line layout for placement in a cramped header row — hides the long-form hint text
   * below the switch, relying on `toolLabel` + `infoTooltip` to carry that context instead.
   */
  compact?: boolean
}>(), {
  onHint: 'Overrides applied to the page',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.preview-toggle {
  align-items: center;
  background: $tb-surface;
  border-bottom: 1px solid $tb-border;
  display: flex;
  flex-wrap: wrap;
  gap: 4px 10px;
  padding: 8px 12px;

  &--compact {
    background: none;
    border-bottom: none;
    padding: 0;
  }
}

.preview-toggle-switch {
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  display: inline-flex;
  gap: 8px;
  padding: 0;

  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 3px; }
}

.preview-toggle-track {
  background: $tb-border-active;
  border-radius: 999px;
  flex-shrink: 0;
  height: 16px;
  position: relative;
  transition: background 0.15s;
  width: 28px;

  .preview-toggle-switch--on & { background: $tb-accent; }
}

.preview-toggle-knob {
  background: #fff;
  border-radius: 50%;
  height: 12px;
  left: 2px;
  position: absolute;
  top: 2px;
  transition: transform 0.15s;
  width: 12px;

  .preview-toggle-switch--on & { transform: translateX(12px); }
}

.preview-toggle-text {
  color: $tb-text;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;

  strong.is-on { color: $tb-accent; }

  strong.is-off { color: $tb-text-muted; }
}

.preview-toggle-hint {
  color: $tb-text-muted;
  font-size: 11px;
}

// Info icon + tooltip — same pattern as TokenCustomizer's `.embed-tip-*`.
.preview-toggle-info-wrap {
  align-items: center;
  display: inline-flex;
  flex-shrink: 0;
  position: relative;
}

.preview-toggle-info-icon {
  align-items: center;
  background: $tb-surface-2;
  border: 1px solid $tb-border;
  border-radius: 50%;
  color: $tb-text-muted;
  cursor: default;
  display: inline-flex;
  font-size: 10px;
  font-weight: 700;
  height: 16px;
  justify-content: center;
  user-select: none;
  width: 16px;

  &:hover, &:focus-visible { background: $tb-border; color: $tb-text-dim; outline: none; }
}

.preview-toggle-info-body {
  background: $tb-text;
  border-radius: 6px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  color: $tb-bg;
  display: none;
  font-size: 11px;
  line-height: 1.55;
  padding: 10px 12px;
  pointer-events: none;
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  width: 220px;
  z-index: 100;

  &::after {
    border: 5px solid transparent;
    border-bottom-color: $tb-text;
    bottom: 100%;
    content: '';
    position: absolute;
    right: 4px;
  }
}

.preview-toggle-info-wrap:hover .preview-toggle-info-body,
.preview-toggle-info-icon:focus-visible + .preview-toggle-info-body { display: block; }
</style>
