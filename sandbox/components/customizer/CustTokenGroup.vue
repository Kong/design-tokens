<template>
  <div class="cust-group">
    <button
      class="cust-group-header"
      @click="emit('toggle', group.category)"
    >
      <span
        class="group-chevron"
        :class="{ 'group-chevron--open': !isCollapsed }"
      >▸</span>
      <span class="group-label">{{ CATEGORY_LABELS[group.category] ?? group.category }}</span>
      <span class="group-count">{{ group.entries.length }}</span>
      <span
        v-if="group.overrideCount > 0"
        class="group-modified-badge"
      >{{ group.overrideCount }} modified</span>
    </button>

    <div
      v-show="!isCollapsed"
      class="cust-group-body"
    >
      <CustTokenRow
        v-for="entry in group.entries"
        :key="entry.cssVar"
        :entry="entry"
        :overridden-value="overrides[entry.cssVar]"
        @change="(cssVar, value, defaultValue) => emit('change', cssVar, value, defaultValue)"
        @reset="(cssVar, defaultValue) => emit('reset', cssVar, defaultValue)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CATEGORY_LABELS } from '@/composables/useTokens'
import type { CustGroup } from '@/composables/useTokenCustomizer'
import CustTokenRow from './CustTokenRow.vue'

defineProps<{
  group: CustGroup
  isCollapsed: boolean
  /** The full overrides map — passed through so each row knows its current state. */
  overrides: Record<string, string>
}>()

const emit = defineEmits<{
  toggle: [category: string]
  change: [cssVar: string, value: string, defaultValue: string]
  reset: [cssVar: string, defaultValue: string]
}>()
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.cust-group { border-bottom: 1px solid $tb-border; }

.cust-group-header {
  width: 100%;
  background: $tb-bg;
  border: none;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  color: $tb-text-muted;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &:hover { background: #eaecf1; color: $tb-text-dim; }
  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: -2px; }
}

.group-chevron {
  display: inline-block;
  transition: transform 0.15s;
  font-size: 10px;

  &--open { transform: rotate(90deg); }
}

.group-label { flex: 1; }

.group-count {
  background: $tb-surface-2;
  border-radius: 8px;
  padding: 1px 6px;
  font-weight: 500;
}

.group-modified-badge {
  background: $tb-accent-subtle;
  color: $tb-accent;
  border-radius: 8px;
  padding: 1px 6px;
}

.cust-group-body { background: $tb-surface; }
</style>
