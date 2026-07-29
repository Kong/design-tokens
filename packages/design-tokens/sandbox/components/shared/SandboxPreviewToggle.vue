<template>
  <div class="preview-toggle">
    <button
      :aria-checked="modelValue"
      class="preview-toggle-switch"
      :class="{ 'preview-toggle-switch--on': modelValue }"
      role="switch"
      type="button"
      @click="emit('update:modelValue', !modelValue)"
    >
      <span class="preview-toggle-track">
        <span class="preview-toggle-knob" />
      </span>
      <span class="preview-toggle-text">{{ modelValue ? 'Preview on' : 'Preview off' }}</span>
    </button>
    <span class="preview-toggle-hint">
      {{ modelValue ? 'Overrides applied to the page' : 'Showing the page’s original tokens' }}
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  /** Whether the injected token stylesheet is applied to the target page. */
  modelValue: boolean
}>()

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
}

.preview-toggle-hint {
  color: $tb-text-muted;
  font-size: 11px;
}
</style>
