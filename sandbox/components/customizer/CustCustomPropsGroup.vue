<template>
  <div class="ccp-group">
    <!-- Group header — same style as CustTokenGroup -->
    <button
      :aria-expanded="!isCollapsed"
      class="ccp-group-header"
      @click="emit('toggle')"
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
      <span class="group-label">User Custom Properties</span>
      <span class="group-count">{{ group.totalCount }}</span>
      <span
        v-if="group.totalCount > 0"
        class="group-modified-badge"
      >{{ group.totalCount }} modified</span>
    </button>

    <div
      v-show="!isCollapsed"
      class="ccp-group-body"
    >
      <!-- Existing custom prop rows -->
      <div
        v-for="{ cssVar, value } in group.entries"
        :key="cssVar"
        class="ccp-row"
      >
        <span
          class="ccp-var-name"
          :title="cssVar"
        >{{ cssVar }}</span>
        <input
          class="ccp-value-input"
          spellcheck="false"
          type="text"
          :value="value"
          @change="setCustomProp(cssVar, ($event.target as HTMLInputElement).value)"
          @keydown.enter="($event.target as HTMLInputElement).blur()"
        >
        <button
          aria-label="Remove"
          class="ccp-remove-btn"
          title="Remove"
          type="button"
          @click="removeCustomProp(cssVar)"
        >
          ✕
        </button>
      </div>

      <!-- Placeholder when search filters out all entries but there are entries elsewhere -->
      <div
        v-if="group.entries.length === 0 && group.totalCount > 0"
        class="ccp-no-match"
      >
        No custom properties match the current filter.
      </div>

      <!-- Add form -->
      <div class="ccp-add-row">
        <input
          v-model="newVar"
          class="ccp-add-input ccp-add-input--var"
          placeholder="--my-custom-var"
          spellcheck="false"
          type="text"
          @keydown.enter="tryAdd"
        >
        <input
          v-model="newValue"
          class="ccp-add-input ccp-add-input--val"
          placeholder="value"
          spellcheck="false"
          type="text"
          @keydown.enter="tryAdd"
        >
        <button
          class="ccp-add-btn"
          :disabled="!canAdd"
          type="button"
          @click="tryAdd"
        >
          Add
        </button>
      </div>
      <p
        v-if="addError"
        class="ccp-error"
      >
        {{ addError }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { setCustomProp, removeCustomProp } from '@/composables/useTokenCustomizer'
import type { CustomPropsGroup } from '@/composables/useTokenCustomizer'

defineProps<{
  /** Filtered group data from `customPropsGroup` computed. */
  group: CustomPropsGroup
  /** Whether this accordion is currently collapsed. */
  isCollapsed: boolean
}>()

const emit = defineEmits<{
  /** Emitted when the header is clicked; parent should toggle collapsed state. */
  toggle: []
}>()

const newVar = ref('')
const newValue = ref('')
const addError = ref('')

const canAdd = computed(() => newVar.value.trim().startsWith('--') && newValue.value.trim().length > 0)

function tryAdd() {
  const cssVar = newVar.value.trim()
  const value = newValue.value.trim()
  addError.value = ''

  if (!cssVar) {
    addError.value = 'Enter a CSS variable name'
    return
  }
  if (!cssVar.startsWith('--')) {
    addError.value = 'Variable name must start with --'
    return
  }
  if (!value) {
    addError.value = 'Enter a value'
    return
  }

  setCustomProp(cssVar, value)
  newVar.value = ''
  newValue.value = ''
}
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.ccp-group { border-bottom: 1px solid $tb-border; }

.ccp-group-header {
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

.ccp-group-body {
  background: $tb-surface;
  padding-bottom: 4px;
}

.ccp-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 16px;
  border-top: 1px solid $tb-border;
}

.ccp-var-name {
  font-family: $tb-mono;
  font-size: 11px;
  color: $tb-text-dim;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ccp-value-input {
  background: $tb-bg;
  border: 1px solid $tb-border;
  border-radius: 4px;
  padding: 3px 7px;
  font-family: $tb-mono;
  font-size: 11px;
  color: $tb-text;
  outline: none;
  width: 120px;
  flex-shrink: 0;

  &:focus-visible { border-color: $tb-accent; }
}

.ccp-remove-btn {
  background: none;
  border: 1px solid transparent;
  border-radius: 3px;
  color: $tb-text-muted;
  cursor: pointer;
  font-size: 10px;
  padding: 2px 5px;
  flex-shrink: 0;
  line-height: 1;
  transition: color 0.1s, background 0.1s, border-color 0.1s;

  &:hover { color: #ef4444; background: rgba(239, 68, 68, 0.07); border-color: rgba(239, 68, 68, 0.3); }
  &:focus-visible { outline: 2px solid #ef4444; outline-offset: 2px; }
}

.ccp-no-match {
  padding: 8px 16px;
  font-size: 12px;
  color: $tb-text-muted;
  border-top: 1px solid $tb-border;
}

.ccp-add-row {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 8px 16px 4px;
  border-top: 1px solid $tb-border;
}

.ccp-add-input {
  background: $tb-bg;
  border: 1px solid $tb-border;
  border-radius: 4px;
  padding: 4px 7px;
  font-family: $tb-mono;
  font-size: 11px;
  color: $tb-text;
  outline: none;
  min-width: 0;

  &::placeholder { color: $tb-text-muted; }
  &:focus-visible { border-color: $tb-accent; }

  &--var { flex: 2; }
  &--val { flex: 1; }
}

.ccp-add-btn {
  background: $tb-accent;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 4px 10px;
  font-family: inherit;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: opacity 0.12s;

  &:disabled { opacity: 0.4; cursor: default; }
  &:hover:not(:disabled) { opacity: 0.85; }
  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 2px; }
}

.ccp-error {
  font-size: 11px;
  color: #ef4444;
  margin: 0;
  padding: 0 16px 6px;
}
</style>
