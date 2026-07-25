<template>
  <div class="file-loader">
    <h2 class="fl-title">
      Load a theme to edit
    </h2>
    <p class="fl-hint">
      Scaffold a new theme first with <code>node scripts/theme-scaffold.mjs &lt;name&gt;</code>,
      then load its two source files here.
    </p>

    <label class="fl-drop">
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

    <label class="fl-drop">
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

defineProps<{ error?: string }>()
const emit = defineEmits<{ load: [{ themeText: string, aliasText: string, themeName: string, aliasName: string }] }>()

const themeName = ref('')
const aliasName = ref('')
const themeText = ref('')
const aliasText = ref('')

const canLoad = computed(() => !!themeText.value && !!aliasText.value)

/** Reads a selected file into text and stores it with its name. */
async function readInto(e: Event, nameRef: typeof themeName, textRef: typeof themeText) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  nameRef.value = file.name
  textRef.value = await file.text()
}

const onTheme = (e: Event) => readInto(e, themeName, themeText)
const onAlias = (e: Event) => readInto(e, aliasName, aliasText)

function emitLoad() {
  if (!canLoad.value) return
  emit('load', { themeText: themeText.value, aliasText: aliasText.value, themeName: themeName.value, aliasName: aliasName.value })
}
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.file-loader { max-width: 460px; margin: 60px auto; padding: 0 20px; font-family: 'Inter', system-ui, sans-serif; color: $tb-text; }
.fl-title { font-size: 20px; font-weight: 600; margin: 0 0 8px; }
.fl-hint { font-size: 13px; color: $tb-text-dim; margin: 0 0 24px; line-height: 1.5; code { font-family: $tb-mono; font-size: 12px; background: $tb-surface-2; padding: 1px 5px; border-radius: 3px; } }
.fl-drop { display: flex; align-items: center; gap: 10px; border: 1px dashed $tb-border-active; border-radius: 8px; padding: 14px 16px; margin-bottom: 12px; cursor: pointer; font-size: 13px; color: $tb-text-dim; input { display: none; } &:hover { border-color: $tb-accent; } }
.fl-check { margin-left: auto; color: $tb-accent; font-weight: 700; }
.fl-error { color: #ef4444; font-size: 13px; margin: 4px 0 12px; }
.fl-btn { width: 100%; background: $tb-accent; color: #fff; border: none; border-radius: 6px; padding: 10px; font-size: 14px; font-weight: 600; cursor: pointer; &:disabled { opacity: 0.4; cursor: default; } }
</style>
