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
        placeholder="Paste CSS (or a legacy share URL/state code)…"
        spellcheck="false"
        type="text"
        @keydown.enter="applyFromInput"
      >
    </div>

    <div class="cust-import-actions">
      <label
        class="cust-import-file-btn"
        title="Import from a .css file — accepts raw overrides or a @kong/design-tokens theme file (e.g. electric-lime-day.css)"
      >
        <input
          ref="fileInputEl"
          accept=".css,text/css"
          style="display: none"
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
  feedbackTimer = setTimeout(() => {
    feedback.value = ''
  }, 3000)
}

async function applyFromInput() {
  const raw = inputValue.value.trim()
  if (!raw) return
  // Auto-detect: if the text contains a CSS custom property declaration (--var: value),
  // parse it as CSS. Otherwise treat it as a share URL or state code.
  // This lets users paste a `:root { --kui-…: …; }` block or a full @kong/design-tokens
  // theme file directly into the input without needing the file-upload button.
  const looksLikeCss = /--[\w-]+\s*:/.test(raw)
  const ok = looksLikeCss ? importFromCss(raw) : await importFromCode(raw)
  if (ok) {
    inputValue.value = ''
    showFeedback('Customizations applied.', 'success')
  } else {
    showFeedback(
      looksLikeCss
        ? 'No CSS custom properties found — check your input.'
        : 'Nothing decoded — check that the URL or state code is correct.',
      'error',
    )
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
  align-items: center;
  color: $tb-text-muted;
  display: flex;
  font-size: 11px;
  font-weight: 700;
  gap: 6px;
  letter-spacing: 0.07em;
  margin-bottom: 8px;
  text-transform: uppercase;

  svg { flex-shrink: 0; }
}

.cust-import-row {
  margin-bottom: 6px;
}

.cust-import-input {
  background: $tb-bg;
  border: 1px solid $tb-border;
  border-radius: 5px;
  box-sizing: border-box;
  color: $tb-text;
  font-family: $tb-mono;
  font-size: 11px;
  outline: none;
  padding: 6px 10px;
  width: 100%;

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
  flex-shrink: 0;
  font-family: inherit;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.5;
  padding: 4px 9px;
  transition: background 0.1s, border-color 0.1s, color 0.1s;
  white-space: nowrap;

  &:hover { background: $tb-border; color: $tb-text; }
}

.cust-import-apply-btn {
  background: $tb-surface-2;
  border: 1px solid $tb-border-active;
  border-radius: 4px;
  color: $tb-text-dim;
  cursor: pointer;
  flex: 1;
  font-family: inherit;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 12px;
  transition: background 0.1s, color 0.1s, border-color 0.1s;

  &:disabled { cursor: default; opacity: 0.35; }

  &:hover:not(:disabled) { background: $tb-accent; border-color: $tb-accent; color: #fff; }

  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 2px; }
}

.cust-import-feedback {
  font-size: 11px;
  margin: 6px 0 0;

  &--success { color: $tb-success; }

  &--error { color: #ef4444; }
}
</style>
