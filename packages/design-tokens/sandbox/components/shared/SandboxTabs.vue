<template>
  <nav
    class="sandbox-tabs"
    role="tablist"
  >
    <button
      v-for="t in tabs"
      :key="t.id"
      :aria-label="t.modified ? `${t.label} — ${t.modifiedTooltip || 'Modified'}` : undefined"
      :aria-selected="modelValue === t.id"
      :class="['st-tab', { 'st-tab--active': modelValue === t.id }]"
      role="tab"
      type="button"
      @click="emit('update:modelValue', t.id)"
    >
      {{ t.label }}
      <!--
        Decorative only — the button's own aria-label above already carries the "modified"
        status and its tooltip text for screen readers, so this dot is not independently
        focusable (a tabindex here would give one tab two focus stops for sighted keyboard users).
      -->
      <span
        v-if="t.modified"
        class="st-tab-dot-wrap"
      >
        <span
          aria-hidden="true"
          class="st-tab-dot"
        />
        <span
          aria-hidden="true"
          class="st-tab-dot-tooltip"
        >{{ t.modifiedTooltip || 'Modified' }}</span>
      </span>
    </button>
  </nav>
</template>

<script setup lang="ts">
/** A single tab descriptor. */
interface TabDef {
  /** Stable tab id (also the v-model value). */
  id: string
  /** Human-readable tab label. */
  label: string
  /** Shows a small dot next to the label — e.g. unsaved/uncommitted changes on this tab. */
  modified?: boolean
  /** Tooltip text for the dot. Defaults to "Modified" when `modified` is set but this is omitted. */
  modifiedTooltip?: string
}
defineProps<{
  /** Tabs to render, in order. */
  tabs: TabDef[]
  /** Currently active tab id (v-model). */
  modelValue: string
}>()
const emit = defineEmits<{ 'update:modelValue': [id: string] }>()
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.sandbox-tabs { background: $tb-surface; border-bottom: 1px solid $tb-border; display: flex; flex-shrink: 0; gap: 2px; padding: 0 12px; }

.st-tab {
  align-items: center; background: none; border: none; border-bottom: 2px solid transparent;
  color: $tb-text-muted; cursor: pointer; display: inline-flex; font-family: inherit; font-size: 13px; font-weight: 500;
  gap: 5px; padding: 10px 14px;
  transition: background 0.12s, color 0.12s;

  &:hover { color: $tb-text-dim; }

  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: -2px; }

  &--active { border-bottom-color: $tb-accent; color: $tb-accent; }
}

// Modified-tab dot + tooltip — same interaction pattern as `.embed-tip-*`/`.preview-toggle-info-*`.
.st-tab-dot-wrap {
  display: inline-flex;
  position: relative;
}

.st-tab-dot {
  background: #e53e3e;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
  height: 7px;
  width: 7px;

  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 2px; }
}

.st-tab-dot-tooltip {
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

.st-tab-dot-wrap:hover .st-tab-dot-tooltip,
.st-tab:focus-visible .st-tab-dot-tooltip { display: block; }
</style>
