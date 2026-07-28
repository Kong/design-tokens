<template>
  <div class="file-loader">
    <h2 class="fl-title">
      Load a theme to edit
    </h2>
    <p class="fl-hint">
      Scaffold a new theme first with <code>node scripts/theme-scaffold.mjs &lt;name&gt;</code>,
      then load its two source files here.
    </p>

    <label
      class="fl-drop"
      :class="{ 'fl-drop--dragover': themeDragOver }"
      @dragenter.prevent="themeDragOver = true"
      @dragleave.prevent="themeDragOver = false"
      @dragover.prevent="themeDragOver = true"
      @drop.prevent="onThemeDrop"
    >
      <input
        accept=".json,application/json"
        type="file"
        @change="onTheme"
      >
      <span>{{ themeName || 'Choose *.theme.json' }}</span>
      <span
        v-if="themeName"
        class="fl-check"
      >✓</span>
    </label>

    <label
      class="fl-drop"
      :class="{ 'fl-drop--dragover': aliasDragOver }"
      @dragenter.prevent="aliasDragOver = true"
      @dragleave.prevent="aliasDragOver = false"
      @dragover.prevent="aliasDragOver = true"
      @drop.prevent="onAliasDrop"
    >
      <input
        accept=".json,application/json"
        type="file"
        @change="onAlias"
      >
      <span>{{ aliasName || 'Choose *.alias.color.json' }}</span>
      <span
        v-if="aliasName"
        class="fl-check"
      >✓</span>
    </label>

    <p
      v-if="error"
      class="fl-error"
    >
      {{ error }}
    </p>

    <button
      class="fl-btn"
      :disabled="!canLoad"
      @click="emitLoad"
    >
      Load Theme
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

defineProps<{
  /** Error message to display below the drop zones, if a load attempt failed. */
  error?: string
}>()
const emit = defineEmits<{ load: [{ themeText: string, aliasText: string, themeName: string, aliasName: string }] }>()

const themeName = ref('')
const aliasName = ref('')
const themeText = ref('')
const aliasText = ref('')
const themeDragOver = ref(false)
const aliasDragOver = ref(false)

const canLoad = computed(() => !!themeText.value && !!aliasText.value)

/** Reads a file's text into the given refs and stores its name. */
async function readFile(file: File, nameRef: typeof themeName, textRef: typeof themeText) {
  nameRef.value = file.name
  textRef.value = await file.text()
}

/** Reads a selected (change event) file into text and stores it with its name. */
async function readInto(e: Event, nameRef: typeof themeName, textRef: typeof themeText) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  await readFile(file, nameRef, textRef)
}

/** Reads a dropped file into text and stores it with its name. */
async function readDropped(e: DragEvent, nameRef: typeof themeName, textRef: typeof themeText) {
  const file = e.dataTransfer?.files?.[0]
  if (!file) return
  await readFile(file, nameRef, textRef)
}

const onTheme = (e: Event) => readInto(e, themeName, themeText)
const onAlias = (e: Event) => readInto(e, aliasName, aliasText)

function onThemeDrop(e: DragEvent) {
  themeDragOver.value = false
  readDropped(e, themeName, themeText)
}

function onAliasDrop(e: DragEvent) {
  aliasDragOver.value = false
  readDropped(e, aliasName, aliasText)
}

function emitLoad() {
  if (!canLoad.value) return
  emit('load', { themeText: themeText.value, aliasText: aliasText.value, themeName: themeName.value, aliasName: aliasName.value })
}
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.file-loader { color: $tb-text; font-family: 'Inter', system-ui, sans-serif; margin: 60px auto; max-width: 460px; padding: 0 20px; }

.fl-title { font-size: 20px; font-weight: 600; margin: 0 0 8px; }

.fl-hint { color: $tb-text-dim; font-size: 13px; line-height: 1.5; margin: 0 0 24px;

  code { background: $tb-surface-2; border-radius: 3px; font-family: $tb-mono; font-size: 12px; padding: 1px 5px; } }

.fl-drop { align-items: center; border: 1px dashed $tb-border-active; border-radius: 8px; color: $tb-text-dim; cursor: pointer; display: flex; font-size: 13px; gap: 10px; margin-bottom: 12px; padding: 14px 16px;

  input { display: none; }

  > * { pointer-events: none; }

  &:hover { border-color: $tb-accent; } }

.fl-drop--dragover { background: $tb-surface-2; border-color: $tb-accent; }

.fl-check { color: $tb-accent; font-weight: 700; margin-left: auto; }

.fl-error { color: #ef4444; font-size: 13px; margin: 4px 0 12px; }

.fl-btn { background: $tb-accent; border: none; border-radius: 6px; color: #fff; cursor: pointer; font-size: 14px; font-weight: 600; padding: 10px; width: 100%;

  &:disabled { cursor: default; opacity: 0.4; } }
</style>
