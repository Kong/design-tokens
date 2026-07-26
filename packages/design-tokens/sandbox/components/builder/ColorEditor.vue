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
import { normalizeColor, toPickerHex, toRgbString } from '@/lib/colorUtils'

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

.color-editor { width: 210px; background: $tb-surface; border: 1px solid $tb-border-active; border-radius: 8px; padding: 10px; box-shadow: 0 8px 28px rgba(0, 0, 0, 0.18); display: flex; flex-direction: column; gap: 8px; }

.ce-preview { height: 34px; border-radius: 6px; overflow: hidden; border: 1px solid $tb-border; }
.ce-preview--alpha { background: repeating-conic-gradient(#bbb 0% 25%, #fff 0% 50%) 0 0 / 10px 10px; }
.ce-preview-fill { display: block; width: 100%; height: 100%; }

.ce-row { display: flex; align-items: center; gap: 8px; justify-content: space-between; }

.ce-native { position: relative; display: inline-flex; align-items: center; gap: 6px; border: 1px solid $tb-border; border-radius: 5px; padding: 3px 8px; cursor: pointer; font-size: 11px; color: $tb-text-dim; &:hover { border-color: $tb-accent; } }
.ce-native-swatch { width: 14px; height: 14px; border-radius: 3px; border: 1px solid rgba(0, 0, 0, 0.15); }
.ce-native-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; border: none; padding: 0; }
.ce-native-label { font-weight: 500; }

.ce-format { display: inline-flex; background: $tb-surface-2; border: 1px solid $tb-border; border-radius: 5px; overflow: hidden; }
.ce-format-btn { background: none; border: none; padding: 3px 9px; font-family: inherit; font-size: 10px; font-weight: 600; letter-spacing: 0.03em; color: $tb-text-muted; cursor: pointer; &:hover:not(&--active) { color: $tb-text-dim; } &--active { background: $tb-accent; color: #fff; } &:focus-visible { outline: 2px solid $tb-accent; outline-offset: -2px; } }

.ce-text { width: 100%; box-sizing: border-box; background: $tb-bg; border: 1px solid $tb-border; border-radius: 5px; padding: 5px 8px; font-family: $tb-mono; font-size: 12px; color: $tb-text; &:focus-visible { border-color: $tb-accent; outline: none; } &--invalid { border-color: #e53e3e; } }
.ce-hint { margin: 0; font-size: 10px; color: #e53e3e; line-height: 1.4; }
</style>
