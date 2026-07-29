<template>
  <div class="cust-output-panel">
    <div class="cust-output-header">
      <span class="cust-output-label">{{ label }}</span>
      <div
        v-if="css"
        class="cust-output-actions"
      >
        <button
          class="cust-output-btn"
          title="Download CSS file"
          @click="emit('download')"
        >
          ↓ Download
        </button>
        <button
          class="cust-output-btn"
          :title="copied ? 'Copied!' : 'Copy CSS'"
          @click="emit('copy')"
        >
          {{ copied ? '✓ Copied' : '⎘ Copy' }}
        </button>
      </div>
    </div>
    <pre class="cust-output-code"><code>{{ css || placeholder }}</code></pre>
    <p
      v-if="css"
      class="cust-output-hint"
    >
      Paste this into your app CSS to override the default tokens.
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  /** Heading shown above the code block (e.g. "Override patch CSS", "All tokens CSS"). */
  label: string
  /** CSS content to display; empty string shows the placeholder. */
  css: string
  /** Whether the CSS was just copied (shows confirmation for 1.5s). */
  copied: boolean
  /** Placeholder text shown when `css` is empty. */
  placeholder: string
}>()

const emit = defineEmits<{
  /** Emitted when the user clicks ⎘ Copy. */
  copy: []
  /** Emitted when the user clicks ↓ Download. */
  download: []
}>()
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.cust-output-panel {
  background: $tb-surface;
  border-bottom: 1px solid $tb-border;
}

.cust-output-header {
  align-items: center;
  border-bottom: 1px solid $tb-border;
  display: flex;
  justify-content: space-between;
  padding: 10px 16px 8px;
}

.cust-output-label {
  color: $tb-text-muted;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.cust-output-actions {
  align-items: center;
  display: flex;
  gap: 4px;
}

.cust-output-btn {
  background: none;
  border: 1px solid $tb-border;
  border-radius: 3px;
  color: $tb-text-dim;
  cursor: pointer;
  font-family: inherit;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.5;
  padding: 2px 7px;
  transition: color 0.1s, border-color 0.1s, background 0.1s;
  white-space: nowrap;

  &:hover { background: $tb-accent-subtle; border-color: $tb-accent; color: $tb-accent; }

  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 2px; }
}

.cust-output-code {
  background: #1e1e2e;
  color: #cdd6f4;
  font-family: $tb-mono;
  font-size: 11px;
  line-height: 1.6;
  margin: 0;
  max-height: 220px;
  overflow-x: auto;
  overflow-y: auto;
  padding: 12px 16px;
  scrollbar-gutter: stable;
  white-space: pre;
}

.cust-output-hint {
  color: $tb-text-muted;
  font-size: 12px;
  line-height: 1.5;
  margin: 0;
  padding: 8px 16px;
}
</style>
