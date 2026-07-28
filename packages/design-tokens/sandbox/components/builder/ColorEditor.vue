<template>
  <div
    ref="rootEl"
    aria-label="Edit color"
    class="color-editor"
    role="dialog"
    @keydown.esc.stop.prevent="emit('close')"
  >
    <div :class="['ce-preview', { 'ce-preview--alpha': isAlphaOrTransparent }]">
      <span
        class="ce-preview-fill"
        :style="previewStyle"
      />
    </div>

    <div class="ce-row">
      <label
        class="ce-native"
        title="Open the system color picker"
      >
        <span
          class="ce-native-swatch"
          :style="{ background: pickerHex }"
        />
        <input
          class="ce-native-input"
          type="color"
          :value="pickerHex"
          @input="onNative"
        >
        <span class="ce-native-label">Pick</span>
      </label>

      <div
        aria-label="Color format"
        class="ce-format"
        role="tablist"
      >
        <button
          v-for="f in formats"
          :key="f"
          :aria-selected="format === f"
          :class="['ce-format-btn', { 'ce-format-btn--active': format === f }]"
          role="tab"
          type="button"
          @click="setFormat(f)"
        >
          {{ f.toUpperCase() }}
        </button>
      </div>
    </div>

    <input
      ref="textEl"
      v-model="draft"
      autocomplete="off"
      :class="['ce-text', { 'ce-text--invalid': invalid }]"
      :placeholder="format === 'hex' ? '#RRGGBB' : 'rgb(r, g, b)'"
      spellcheck="false"
      @input="onText"
      @keydown.enter.prevent="commitAndClose"
    >
    <p
      v-if="invalid"
      class="ce-hint"
    >
      Enter a hex (#CCFF00) or rgb(204, 255, 0) color.
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { normalizeColor, toPickerHex, toRgbString } from '@/utils/colorUtils'

const props = defineProps<{
  /** Current color value: canonical hex (#RRGGBB / #RRGGBBAA) or `transparent`. */
  modelValue: string
}>()
const emit = defineEmits<{
  /** Emitted with a normalized color whenever the user picks or types a valid value. */
  'update:modelValue': [value: string]
  /** Emitted when the editor should close (Esc, Enter, or an outside click). */
  close: []
}>()

/** The two supported display/entry formats. */
type Format = 'hex' | 'rgb'
const formats: Format[] = ['hex', 'rgb']
const format = ref<Format>('hex')
const rootEl = ref<HTMLElement | null>(null)
const textEl = ref<HTMLInputElement | null>(null)

/** Renders a color in the active format, passing unparseable input through untouched. */
function formatFor(color: string, f: Format): string {
  const n = normalizeColor(color)
  if (!n) return color
  if (n === 'transparent') return 'transparent'
  return f === 'rgb' ? toRgbString(n) : n
}

/** The editable text field content; seeded from modelValue in the current format. */
const draft = ref(formatFor(props.modelValue, format.value))

/** True while the draft is non-empty but not a parseable color. */
const invalid = computed(() => draft.value.trim() !== '' && normalizeColor(draft.value) === null)

/** A 6-digit hex safe for the native `<input type="color">`. */
const pickerHex = computed(() => toPickerHex(props.modelValue))

/** True when the value carries alpha or is transparent — drives the checkerboard backing. */
const isAlphaOrTransparent = computed(() => {
  const n = normalizeColor(props.modelValue)
  return n === 'transparent' || (typeof n === 'string' && n.length === 9)
})

/** Inline background for the large preview fill. */
const previewStyle = computed(() => {
  const n = normalizeColor(props.modelValue) ?? props.modelValue
  return { background: n === 'transparent' ? 'transparent' : n }
})

/** Emits a normalized value while the typed draft parses to a color. */
function onText() {
  const n = normalizeColor(draft.value)
  if (n) emit('update:modelValue', n)
}

/** Emits the native picker's hex and reflects it into the draft. */
function onNative(e: Event) {
  const hex = (e.target as HTMLInputElement).value.toUpperCase()
  emit('update:modelValue', hex)
  draft.value = formatFor(hex, format.value)
}

/** Switches the display format and reformats the draft from the current value. */
function setFormat(f: Format) {
  format.value = f
  draft.value = formatFor(props.modelValue, f)
}

/** Commits the current draft (when valid) and closes. */
function commitAndClose() {
  const n = normalizeColor(draft.value)
  if (n) emit('update:modelValue', n)
  emit('close')
}

/** Closes when a pointer press lands outside the editor. */
function onDocPointer(e: PointerEvent) {
  if (rootEl.value && !rootEl.value.contains(e.target as Node)) emit('close')
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocPointer, true)
  textEl.value?.focus()
  textEl.value?.select()
})
onBeforeUnmount(() => document.removeEventListener('pointerdown', onDocPointer, true))
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.color-editor { background: $tb-surface; border: 1px solid $tb-border-active; border-radius: 8px; box-shadow: 0 8px 28px rgba(0, 0, 0, 0.18); display: flex; flex-direction: column; gap: 8px; padding: 10px; width: 210px; }

.ce-preview { border: 1px solid $tb-border; border-radius: 6px; height: 34px; overflow: hidden; }

.ce-preview--alpha { background: repeating-conic-gradient(#bbb 0% 25%, #fff 0% 50%) 0 0 / 10px 10px; }

.ce-preview-fill { display: block; height: 100%; width: 100%; }

.ce-row { align-items: center; display: flex; gap: 8px; justify-content: space-between; }

.ce-native { align-items: center; border: 1px solid $tb-border; border-radius: 5px; color: $tb-text-dim; cursor: pointer; display: inline-flex; font-size: 11px; gap: 6px; padding: 3px 8px; position: relative;

  &:hover { border-color: $tb-accent; } }

.ce-native-swatch { border: 1px solid rgba(0, 0, 0, 0.15); border-radius: 3px; height: 14px; width: 14px; }

.ce-native-input { border: none; cursor: pointer; height: 100%; inset: 0; opacity: 0; padding: 0; position: absolute; width: 100%; }

.ce-native-label { font-weight: 500; }

.ce-format { background: $tb-surface-2; border: 1px solid $tb-border; border-radius: 5px; display: inline-flex; overflow: hidden; }

.ce-format-btn { background: none; border: none; color: $tb-text-muted; cursor: pointer; font-family: inherit; font-size: 10px; font-weight: 600; letter-spacing: 0.03em; padding: 3px 9px;

  &:hover:not(&--active) { color: $tb-text-dim; }

  &--active { background: $tb-accent; color: #fff; }

  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: -2px; } }

.ce-text { background: $tb-bg; border: 1px solid $tb-border; border-radius: 5px; box-sizing: border-box; color: $tb-text; font-family: $tb-mono; font-size: 12px; padding: 5px 8px; width: 100%;

  &:focus-visible { border-color: $tb-accent; outline: none; }

  &--invalid { border-color: #e53e3e; } }

.ce-hint { color: #e53e3e; font-size: 10px; line-height: 1.4; margin: 0; }
</style>
