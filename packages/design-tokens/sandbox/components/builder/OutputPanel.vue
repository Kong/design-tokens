<template>
  <div class="output-panel">
    <h3 class="op-heading">
      Export
    </h3>
    <button
      class="op-btn"
      @click="exportBoth"
    >
      Export theme files
    </button>
    <p class="op-note">
      Downloads the {{ hasOverrides ? 'modified' : 'unmodified' }}
      <code>*.theme.json</code> and <code>*.alias.color.json</code> files.
    </p>

    <h3 class="op-heading op-heading--css">
      Computed CSS
    </h3>
    <div class="op-btn-row">
      <button
        class="op-btn op-btn--secondary"
        :disabled="!css"
        @click="downloadCss"
      >
        Export computed CSS
      </button>
      <button
        class="op-btn op-btn--secondary"
        :disabled="!css"
        @click="copyCss"
      >
        {{ copied ? '✓ Copied' : 'Copy' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useClipboard } from '@/composables/useClipboard'

const props = defineProps<{
  /** Serialized theme JSON to download on export. */
  themeJsonOut: string
  /** Serialized alias color JSON to download on export. */
  aliasJsonOut: string
  /** Filename used for the downloaded theme JSON file. */
  themeFileName: string
  /** Filename used for the downloaded alias color JSON file. */
  aliasFileName: string
  /** Computed CSS output to export/copy. */
  css: string
  /** Whether any token or alias override is currently set — used only to word the export note. */
  hasOverrides: boolean
}>()

const { copyText } = useClipboard()
const copied = ref(false)
let resetCopiedTimer: ReturnType<typeof setTimeout>

/** Triggers a browser download of the given text under the given filename and MIME type. */
function download(name: string, text: string, mimeType: string) {
  const blob = new Blob([text], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  URL.revokeObjectURL(url)
}

/** Downloads both the theme and alias JSON files sequentially. */
function exportBoth() {
  download(props.themeFileName, props.themeJsonOut, 'application/json')
  download(props.aliasFileName, props.aliasJsonOut, 'application/json')
}

/** Downloads the computed CSS as a standalone .css file. */
function downloadCss() {
  if (!props.css) return
  download('kong-theme-computed.css', props.css, 'text/css')
}

/** Copies the computed CSS to the clipboard and shows a 1.5s confirmation state. */
async function copyCss() {
  if (!props.css) return
  await copyText(props.css, 'computed-css')
  copied.value = true
  clearTimeout(resetCopiedTimer)
  resetCopiedTimer = setTimeout(() => {
    copied.value = false
  }, 1500)
}
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.output-panel { display: flex; flex-direction: column; height: 100%; min-height: 0; padding: 16px; }

.op-heading { align-items: center; color: $tb-text-muted; display: flex; font-size: 13px; font-weight: 600; justify-content: space-between; letter-spacing: 0.05em; margin: 0 0 12px; text-transform: uppercase; }

.op-heading--css { margin-top: 20px; }

.op-btn { background: $tb-accent; border: none; border-radius: 6px; color: #fff; cursor: pointer; display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; padding: 9px; width: 100%;

  &:hover:not(:disabled) { opacity: 0.9; }

  &:disabled { cursor: default; opacity: 0.4; }

  &--secondary {
    background: $tb-surface-2;
    border: 1px solid $tb-border;
    color: $tb-text-dim;
    margin-bottom: 0;

    &:hover:not(:disabled) { border-color: $tb-border-active; color: $tb-text; opacity: 1; }
  }
}

.op-btn-row { display: flex; gap: 8px;

  .op-btn--secondary { flex: 1; }
}

.op-note {
  color: $tb-text-muted;
  font-size: 12px;
  margin: 0 0 12px;

  code { background: $tb-surface-2; border-radius: 3px; font-family: $tb-mono; font-size: 11px; padding: 1px 4px; }
}
</style>
