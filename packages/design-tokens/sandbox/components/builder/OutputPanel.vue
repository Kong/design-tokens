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
  themeJsonOut: string
  aliasJsonOut: string
  themeFileName: string
  aliasFileName: string
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
.op-heading { display: flex; align-items: center; justify-content: space-between; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: $tb-text-muted; margin: 0 0 12px; }
.op-heading--css { margin-top: 20px; }
.op-btn { display: block; width: 100%; margin-bottom: 6px; background: $tb-accent; color: #fff; border: none; border-radius: 6px; padding: 9px; font-size: 13px; font-weight: 600; cursor: pointer; &:hover { opacity: 0.9; } }
.op-note { margin: 0 0 12px; font-size: 12px; color: $tb-text-muted; }
.op-copy-btn { text-transform: none; letter-spacing: normal; background: $tb-surface-2; color: $tb-text-dim; border: 1px solid $tb-border; border-radius: 4px; padding: 3px 8px; font-size: 11px; font-weight: 600; cursor: pointer; &:hover { opacity: 0.85; } }
.op-code {
  margin: 0;
  font-family: $tb-mono;
  font-size: 12px;
  line-height: 1.5;
  color: #cdd6f4;
  background: #1e1e2e;
  border-radius: 6px;
  padding: 10px;
  flex: 1;
  min-height: 0;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
