<template>
  <div class="cust-import-panel">
    <div class="cust-import-label">
      <svg
        fill="none"
        height="13"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
        width="13"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line
          x1="12"
          x2="12"
          y1="15"
          y2="3"
        />
      </svg>
      <span>Import customizations</span>
    </div>

    <div class="cust-import-row">
      <input
        v-model="inputValue"
        class="cust-import-input"
        placeholder="Paste share URL or state code…"
        spellcheck="false"
        type="text"
        @keydown.enter="applyFromInput"
      >
    </div>

    <div class="cust-import-actions">
      <label
        class="cust-import-file-btn"
        title="Import from a .css file containing CSS custom property declarations"
      >
        <input
          ref="fileInputEl"
          accept=".css,text/css"
          style="display:none"
          type="file"
          @change="applyFromFile"
        >
        ↑ .css file
      </label>
      <button
        class="cust-import-apply-btn"
        :disabled="!inputValue.trim()"
        type="button"
        @click="applyFromInput"
      >
        Apply
      </button>
    </div>

    <p
      v-if="feedback"
      :class="['cust-import-feedback', `cust-import-feedback--${feedbackType}`]"
    >
      {{ feedback }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { importFromCode, importFromCss } from '@/composables/useTokenCustomizer'

const inputValue = ref('')
const fileInputEl = ref<HTMLInputElement | null>(null)
const feedback = ref('')
const feedbackType = ref<'success' | 'error'>('success')
let feedbackTimer: ReturnType<typeof setTimeout>

function showFeedback(msg: string, type: 'success' | 'error') {
  feedback.value = msg
  feedbackType.value = type
  clearTimeout(feedbackTimer)
  feedbackTimer = setTimeout(() => { feedback.value = '' }, 3000)
}

async function applyFromInput() {
  const raw = inputValue.value.trim()
  if (!raw) return
  const ok = await importFromCode(raw)
  if (ok) {
    inputValue.value = ''
    showFeedback('Customizations applied.', 'success')
  } else {
    showFeedback('Nothing decoded — check that the URL or state code is correct.', 'error')
  }
}

function applyFromFile(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    const css = e.target?.result as string
    const ok = importFromCss(css)
    if (ok) {
      showFeedback(`Imported from ${file.name}.`, 'success')
    } else {
      showFeedback('No CSS custom properties found in the file.', 'error')
    }
    // Reset so the same file can be re-imported after making changes
    if (fileInputEl.value) fileInputEl.value.value = ''
  }
  reader.readAsText(file)
}
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.cust-import-panel {
  background: $tb-surface;
  border-bottom: 1px solid $tb-border;
  padding: 12px 16px;
}

.cust-import-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: $tb-text-muted;
  margin-bottom: 8px;

  svg { flex-shrink: 0; }
}

.cust-import-row {
  margin-bottom: 6px;
}

.cust-import-input {
  width: 100%;
  background: $tb-bg;
  border: 1px solid $tb-border;
  border-radius: 5px;
  padding: 6px 10px;
  font-family: $tb-mono;
  font-size: 11px;
  color: $tb-text;
  outline: none;
  box-sizing: border-box;

  &::placeholder { color: $tb-text-muted; }
  &:focus-visible { border-color: $tb-accent; }
}

.cust-import-actions {
  display: flex;
  gap: 6px;
}

.cust-import-file-btn {
  background: $tb-surface-2;
  border: 1px solid $tb-border;
  border-radius: 4px;
  color: $tb-text-dim;
  cursor: pointer;
  font-family: inherit;
  font-size: 11px;
  font-weight: 500;
  padding: 4px 9px;
  white-space: nowrap;
  flex-shrink: 0;
  line-height: 1.5;
  transition: background 0.1s, border-color 0.1s, color 0.1s;

  &:hover { background: $tb-border; color: $tb-text; }
}

.cust-import-apply-btn {
  flex: 1;
  background: $tb-surface-2;
  border: 1px solid $tb-border-active;
  border-radius: 4px;
  color: $tb-text-dim;
  cursor: pointer;
  font-family: inherit;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 12px;
  transition: background 0.1s, color 0.1s, border-color 0.1s;

  &:disabled { opacity: 0.35; cursor: default; }
  &:hover:not(:disabled) { background: $tb-accent; color: #fff; border-color: $tb-accent; }
  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 2px; }
}

.cust-import-feedback {
  font-size: 11px;
  margin: 6px 0 0;

  &--success { color: $tb-success; }
  &--error { color: #ef4444; }
}
</style>
