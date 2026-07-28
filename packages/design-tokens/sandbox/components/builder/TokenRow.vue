<template>
  <div :class="['token-row', { 'token-row--modified': token.source === 'overridden' }]">
    <div class="tr-main">
      <code class="tr-name">{{ token.cssVar }}</code>
    </div>

    <div
      ref="controlEl"
      class="tr-control"
    >
      <template v-if="token.isColor">
        <button
          class="tr-color-btn"
          @click="open = !open"
        >
          <span
            class="tr-swatch"
            :style="{ background: token.derivedValue || 'transparent' }"
          />
          <span class="tr-color-text">{{ currentRef || 'pick alias' }}</span>
        </button>
        <button
          v-if="token.source === 'overridden'"
          class="tr-reset"
          title="Reset to theme default"
          @click="emit('reset', token.key)"
        >
          ↺
        </button>
        <div
          v-if="open"
          class="tr-popover"
          @keydown.esc.stop.prevent="open = false"
        >
          <AliasPicker
            :alias-flat="aliasFlat"
            :selected-key="selectedKey"
            @reset="onReset"
            @select="onSelect"
          />
        </div>
      </template>
      <template v-else>
        <input
          class="tr-text"
          :placeholder="token.source === 'empty' ? 'unset' : ''"
          spellcheck="false"
          :value="token.rawValue"
          @input="onText"
        >
        <button
          v-if="token.source === 'overridden'"
          class="tr-reset"
          title="Reset to theme default"
          @click="emit('reset', token.key)"
        >
          ↺
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, onUnmounted, ref } from 'vue'
import AliasPicker from './AliasPicker.vue'
import { parseAliasRef } from '@/utils/themeBuilderUtils'
import type { AliasFlatEntry, BuilderToken } from '@/utils/themeBuilderUtils'

const props = defineProps<{
  /** The token this row edits. */
  token: BuilderToken
  /** Flattened alias entries passed through to the alias picker popover. */
  aliasFlat: AliasFlatEntry[]
}>()
const emit = defineEmits<{ set: [key: string, value: string], reset: [key: string] }>()

const open = ref(false)
const controlEl = ref<HTMLElement | null>(null)

/** Closes the alias picker popover when a pointer press lands outside it. */
function onDocPointer(e: PointerEvent) {
  if (open.value && controlEl.value && !controlEl.value.contains(e.target as Node)) open.value = false
}
onMounted(() => document.addEventListener('pointerdown', onDocPointer, true))
onBeforeUnmount(() => document.removeEventListener('pointerdown', onDocPointer, true))

/** The current alias ref string, if the raw value is one. */
const currentRef = computed(() => {
  const ref = parseAliasRef(props.token.rawValue)
  return ref ? props.token.rawValue : ''
})

/** The `family.step` key of the current ref, for highlighting in the picker. */
const selectedKey = computed(() => {
  const ref = parseAliasRef(props.token.rawValue)
  if (!ref) return null
  return ref.step ? `${ref.family}.${ref.step}` : ref.family
})

function onSelect(refStr: string) {
  emit('set', props.token.key, refStr)
  open.value = false
}
function onReset() {
  emit('reset', props.token.key)
  open.value = false
}
// Debounce the non-color text input so the live (bookmarklet) preview updates as the
// user types rather than only on blur, without posting on every keystroke.
let debounceTimer: ReturnType<typeof setTimeout>
onUnmounted(() => clearTimeout(debounceTimer))
function onText(e: Event) {
  const value = (e.target as HTMLInputElement).value
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => emit('set', props.token.key, value), 200)
}
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.token-row {
  align-items: center;
  border-bottom: 1px solid $tb-border;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  padding: 6px 12px;

  // Modified rows get a left accent bar + subtle tint (no layout shift) instead of a text label
  &--modified {
    background: $tb-accent-subtle;
    box-shadow: inset 3px 0 0 $tb-accent;
  }
}

.tr-main {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 2px;
}

.tr-name {
  color: $tb-text;
  font-family: $tb-mono;
  font-size: 11px;
  white-space: nowrap;
}

.tr-control {
  align-items: center;
  display: flex;
  flex: 1;
  gap: 6px;
  min-width: 0;
  position: relative;
}

.tr-color-btn {
  align-items: center;
  background: $tb-bg;
  border: 1px solid $tb-border;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  gap: 6px;
  padding: 3px 8px;
}

.tr-swatch {
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  height: 16px;
  width: 16px;
}

.tr-color-text {
  color: $tb-text-dim;
  font-family: $tb-mono;
  font-size: 10px;
}

.tr-popover {
  position: absolute;
  right: 0;
  top: calc(100% + 4px);
  z-index: 50;
}

.tr-text {
  background: $tb-bg;
  border: 1px solid $tb-border;
  border-radius: 5px;
  color: $tb-text;
  flex: 1;
  font-family: $tb-mono;
  font-size: 11px;
  min-width: 0;
  padding: 3px 8px;

  &:focus-visible {
    border-color: $tb-accent;
    outline: none;
  }
}

.tr-reset {
  background: none;
  border: 1px solid $tb-border;
  border-radius: 5px;
  color: $tb-text-muted;
  cursor: pointer;
  padding: 2px 6px;

  &:hover {
    color: $tb-text;
  }
}
</style>
