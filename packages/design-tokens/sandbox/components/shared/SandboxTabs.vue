<template>
  <nav
    class="sandbox-tabs"
    role="tablist"
  >
    <button
      v-for="t in tabs"
      :key="t.id"
      :aria-selected="modelValue === t.id"
      :class="['st-tab', { 'st-tab--active': modelValue === t.id }]"
      role="tab"
      type="button"
      @click="emit('update:modelValue', t.id)"
    >
      {{ t.label }}
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
  background: none; border: none; border-bottom: 2px solid transparent;
  color: $tb-text-muted; cursor: pointer; font-family: inherit; font-size: 13px; font-weight: 500;
  padding: 10px 14px;

  &:hover { color: $tb-text-dim; }

  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: -2px; }

  &--active { border-bottom-color: $tb-accent; color: $tb-accent; }
}
</style>
