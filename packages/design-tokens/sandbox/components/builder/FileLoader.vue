<template>
  <div class="file-loader">
    <h2 class="fl-title">
      Load a theme to edit
    </h2>
    <p class="fl-hint">
      New themes are scaffolded from the command line — see the
      <a
        class="fl-link"
        href="#"
        @click.prevent="emit('go-to-instructions')"
      >Instructions tab</a> for how. Once you have a theme's two source files, load them below.
    </p>

    <label
      class="fl-label"
      for="fl-builtin-select"
    >
      Load an existing theme
    </label>
    <select
      id="fl-builtin-select"
      v-model="selectedBuiltInId"
      class="fl-select"
      :disabled="usingUpload"
    >
      <option
        disabled
        value=""
      >
        Choose a theme…
      </option>
      <option
        v-for="theme in BUILT_IN_THEMES"
        :key="theme.id"
        :value="theme.id"
      >
        {{ theme.label }}
      </option>
    </select>

    <p class="fl-or">
      or upload your own files
    </p>

    <label
      class="fl-drop"
      :class="{ 'fl-drop--dragover': aliasDragOver, 'fl-drop--disabled': usingBuiltIn }"
      @dragenter.prevent="aliasDragOver = true"
      @dragleave.prevent="aliasDragOver = false"
      @dragover.prevent="aliasDragOver = true"
      @drop.prevent="onAliasDrop"
    >
      <input
        accept=".json,application/json"
        :disabled="usingBuiltIn"
        type="file"
        @change="onAlias"
      >
      <span>{{ aliasName || 'Choose *.alias.color.json' }}</span>
      <span
        v-if="aliasName"
        class="fl-check"
      >✓</span>
    </label>

    <label
      class="fl-drop"
      :class="{ 'fl-drop--dragover': themeDragOver, 'fl-drop--disabled': usingBuiltIn }"
      @dragenter.prevent="themeDragOver = true"
      @dragleave.prevent="themeDragOver = false"
      @dragover.prevent="themeDragOver = true"
      @drop.prevent="onThemeDrop"
    >
      <input
        accept=".json,application/json"
        :disabled="usingBuiltIn"
        type="file"
        @change="onTheme"
      >
      <span>{{ themeName || 'Choose *.theme.json' }}</span>
      <span
        v-if="themeName"
        class="fl-check"
      >✓</span>
    </label>

    <p
      v-if="error"
      class="fl-error"
    >
      {{ error }}
    </p>

    <div class="fl-actions">
      <button
        class="fl-btn"
        :disabled="!canLoad"
        @click="emitLoad"
      >
        Load Theme
      </button>
      <button
        v-if="hasSelection"
        class="fl-clear-btn"
        type="button"
        @click="clearSelection"
      >
        Clear selection
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { BUILT_IN_THEMES } from '@/composables/useBuiltInThemes'

defineProps<{
  /** Error message to display below the drop zones, if a load attempt failed. */
  error?: string
}>()
const emit = defineEmits<{
  load: [{ themeText: string, aliasText: string, themeName: string, aliasName: string }]
  'go-to-instructions': []
}>()

/** Id of the built-in theme picked from the dropdown, or '' when none is selected. */
const selectedBuiltInId = ref('')

const themeName = ref('')
const aliasName = ref('')
const themeText = ref('')
const aliasText = ref('')
const themeDragOver = ref(false)
const aliasDragOver = ref(false)

/** True once a built-in theme has been picked from the dropdown (but not yet loaded). */
const usingBuiltIn = computed(() => selectedBuiltInId.value !== '')
/** True once either upload file has started loading (but not yet loaded). */
const usingUpload = computed(() => !!themeName.value || !!aliasName.value)
/** True once the user has started either loading method — drives the "Clear selection" affordance. */
const hasSelection = computed(() => usingBuiltIn.value || usingUpload.value)

/** True once a full pair of files (built-in or uploaded) is ready for the "Load Theme" click. */
const canLoad = computed(() => usingBuiltIn.value || (!!themeText.value && !!aliasText.value))

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

/**
 * Commits whichever loading method is ready — a picked built-in theme wins if one is
 * selected (the dropdown and uploads are mutually exclusive so both can never be ready at
 * once), otherwise the two uploaded files. Same `load` emit contract either way.
 */
function emitLoad() {
  if (usingBuiltIn.value) {
    const theme = BUILT_IN_THEMES.find((t) => t.id === selectedBuiltInId.value)
    if (!theme) return
    emit('load', {
      themeText: theme.themeText,
      aliasText: theme.aliasText,
      themeName: theme.themeFileName,
      aliasName: theme.aliasFileName,
    })
    return
  }
  if (!canLoad.value) return
  emit('load', { themeText: themeText.value, aliasText: aliasText.value, themeName: themeName.value, aliasName: aliasName.value })
}

/** Resets both loading methods so the user can start over or switch methods. */
function clearSelection() {
  selectedBuiltInId.value = ''
  themeName.value = ''
  aliasName.value = ''
  themeText.value = ''
  aliasText.value = ''
}
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.file-loader { color: $tb-text; font-family: 'Inter', system-ui, sans-serif; margin: 60px auto; max-width: 460px; padding: 0 20px; }

.fl-title { font-size: 20px; font-weight: 600; margin: 0 0 8px; }

.fl-hint { color: $tb-text-dim; font-size: 13px; line-height: 1.5; margin: 0 0 24px;

  code { background: $tb-surface-2; border-radius: 3px; font-family: $tb-mono; font-size: 12px; padding: 1px 5px; } }

.fl-link { color: $tb-accent; text-decoration: none;

  &:hover { text-decoration: underline; } }

.fl-label { color: $tb-text-dim; display: block; font-size: 12px; font-weight: 600; margin: 0 0 6px; text-transform: uppercase; }

.fl-select {
  appearance: none;
  background-color: $tb-surface;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 14px;
  border: 1px solid $tb-border-active;
  border-radius: 6px;
  color: $tb-text;
  font-size: 13px;
  margin-bottom: 16px;
  padding: 10px 34px 10px 10px;
  width: 100%;

  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 2px; }

  &:disabled { cursor: not-allowed; opacity: 0.5; }
}

.fl-or { color: $tb-text-dim; font-size: 12px; margin: 0 0 16px; text-align: center; }

.fl-drop { align-items: center; border: 1px dashed $tb-border-active; border-radius: 8px; color: $tb-text-dim; cursor: pointer; display: flex; font-size: 13px; gap: 10px; margin-bottom: 12px; padding: 14px 16px;

  input { display: none; }

  > * { pointer-events: none; }

  &:hover { border-color: $tb-accent; } }

.fl-drop--dragover { background: $tb-surface-2; border-color: $tb-accent; }

.fl-drop--disabled { cursor: not-allowed; opacity: 0.5; pointer-events: none; }

.fl-check { color: $tb-accent; font-weight: 700; margin-left: auto; }

.fl-error { color: #ef4444; font-size: 13px; margin: 4px 0 12px; }

.fl-actions { display: flex; flex-direction: column; gap: 8px; }

.fl-btn { background: $tb-accent; border: none; border-radius: 6px; color: #fff; cursor: pointer; font-size: 14px; font-weight: 600; padding: 10px; width: 100%;

  &:disabled { cursor: default; opacity: 0.4; } }

.fl-clear-btn {
  background: none;
  border: none;
  color: $tb-text-dim;
  cursor: pointer;
  font-size: 12px;
  padding: 4px;
  text-decoration: underline;

  &:hover { color: $tb-text; }

  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 2px; }
}
</style>
