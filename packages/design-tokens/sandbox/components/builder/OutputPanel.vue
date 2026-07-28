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
      Downloads both {{ themeFileName }} and {{ aliasFileName }}.
    </p>

    <h3 class="op-heading op-heading--css">
      Computed CSS
      <button
        v-if="css"
        class="op-copy-btn"
        @click="copyCss"
      >
        {{ copied ? '✓ Copied' : 'Copy' }}
      </button>
    </h3>
    <pre class="op-code"><code>{{ css || placeholder }}</code></pre>
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
  /** Computed CSS output to preview and copy to the clipboard. */
  css: string
}>()

const placeholder = '/* Load a theme and edit tokens to see the computed CSS. */'

const { copyText } = useClipboard()
const copied = ref(false)
let resetCopiedTimer: ReturnType<typeof setTimeout>

/** Triggers a browser download of the given JSON text under the given filename. */
function download(name: string, text: string) {
  const blob = new Blob([text], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  URL.revokeObjectURL(url)
}

/** Downloads both the theme and alias JSON files sequentially. */
function exportBoth() {
  download(props.themeFileName, props.themeJsonOut)
  download(props.aliasFileName, props.aliasJsonOut)
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

  &:hover { opacity: 0.9; } }

.op-note { color: $tb-text-muted; font-size: 12px; margin: 0 0 12px; }

.op-copy-btn { background: $tb-surface-2; border: 1px solid $tb-border; border-radius: 4px; color: $tb-text-dim; cursor: pointer; font-size: 11px; font-weight: 600; letter-spacing: normal; padding: 3px 8px; text-transform: none;

  &:hover { opacity: 0.85; } }

.op-code {
  background: #1e1e2e;
  border-radius: 6px;
  color: #cdd6f4;
  flex: 1;
  font-family: $tb-mono;
  font-size: 12px;
  line-height: 1.5;
  margin: 0;
  min-height: 0;
  overflow: auto;
  padding: 10px;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
