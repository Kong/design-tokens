<template>
  <div class="cust-group">
    <button
      :aria-expanded="!isCollapsed"
      class="cust-group-header"
      @click="emit('toggle', group.category)"
    >
      <svg
        :class="['group-chevron', { 'group-chevron--open': !isCollapsed }]"
        fill="none"
        height="14"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2.5"
        viewBox="0 0 24 24"
        width="14"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
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
      <!-- Sub-sectioned categories (color, font, border, shadow) show section headers -->
      <template v-if="sections">
        <div
          v-for="section in sections"
          :key="section.section"
          class="cust-subsection"
        >
          <div class="cust-subsection-header">
            {{ section.section }}
          </div>
          <CustTokenRow
            v-for="entry in section.entries"
            :key="entry.cssVar"
            :entry="entry"
            :overridden-value="overrides[entry.cssVar]"
            @change="(cssVar, value, defaultValue) => emit('change', cssVar, value, defaultValue)"
            @reset="(cssVar, defaultValue) => emit('reset', cssVar, defaultValue)"
          />
        </div>
      </template>
      <template v-else>
        <CustTokenRow
          v-for="entry in group.entries"
          :key="entry.cssVar"
          :entry="entry"
          :overridden-value="overrides[entry.cssVar]"
          @change="(cssVar, value, defaultValue) => emit('change', cssVar, value, defaultValue)"
          @reset="(cssVar, defaultValue) => emit('reset', cssVar, defaultValue)"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CATEGORY_LABELS, SECTIONED_CATEGORIES, buildSections } from '@/composables/useTokens'
import type { CustGroup } from '@/composables/useTokenCustomizer'
import CustTokenRow from './CustTokenRow.vue'

const props = defineProps<{
  group: CustGroup
  isCollapsed: boolean
  /** The full overrides map — passed through so each row knows its current state. */
  overrides: Record<string, string>
}>()

const emit = defineEmits<{
  /** Emitted when the group header is clicked; payload is the category key used as collapse map key. */
  toggle: [category: string]
  /** Emitted when a token row value changes; forwarded directly to useTokenCustomizer.setOverride. */
  change: [cssVar: string, value: string, defaultValue: string]
  /** Emitted when a token row reset button is clicked; clears the override for the given var. */
  reset: [cssVar: string, defaultValue: string]
}>()

/** Sub-sections for sectionable categories; null means render as a flat list. */
const sections = computed(() =>
  SECTIONED_CATEGORIES.has(props.group.category) ? buildSections(props.group.entries) : null,
)
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
  flex-shrink: 0;
  transition: transform 0.15s;
  color: $tb-text-muted;

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

// Sub-sections within a group (color → background/border/text, font → family/size/weight)
.cust-subsection { border-top: 1px solid $tb-border; }

.cust-subsection-header {
  padding: 5px 16px 4px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: $tb-text-muted;
  background: $tb-surface-2;
  border-bottom: 1px solid $tb-border;
}
</style>
