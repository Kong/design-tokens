<template>
  <div class="cust-share-panel">
    <div class="cust-share-label">
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
        <circle
          cx="18"
          cy="5"
          r="3"
        />
        <circle
          cx="6"
          cy="12"
          r="3"
        />
        <circle
          cx="18"
          cy="19"
          r="3"
        />
        <line
          x1="8.59"
          x2="15.42"
          y1="13.51"
          y2="17.49"
        />
        <line
          x1="15.41"
          x2="8.59"
          y1="6.51"
          y2="10.49"
        />
      </svg>
      <span>Share customized tokens</span>
      <span
        v-if="overrideCount > 0"
        class="share-badge"
      >{{ overrideCount }} token{{ overrideCount === 1 ? '' : 's' }}</span>
    </div>
    <button
      class="cust-share-copy-btn"
      :class="{ 'cust-share-copy-btn--copied': copied }"
      :title="copied ? 'Copied!' : 'Copy share link'"
      @click="emit('copy')"
    >
      <svg
        fill="none"
        height="13"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2.5"
        viewBox="0 0 24 24"
        width="13"
      >
        <rect
          height="13"
          rx="2"
          width="13"
          x="9"
          y="9"
        />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
      {{ copied ? '✓ Link copied!' : 'Copy share link' }}
    </button>
    <button
      v-if="stateCode"
      class="cust-share-code-btn"
      :class="{ 'cust-share-code-btn--copied': copiedCode }"
      title="Copy the portable state code — paste it into Import on any hostname"
      @click="emit('copyCode')"
    >
      {{ copiedCode ? '✓ Code copied!' : '⎘ Copy state code' }}
    </button>
    <p class="cust-share-hint">
      Your token overrides are encoded directly in the URL. Bookmark or paste the link
      anywhere — or use "Copy state code" to transfer your customizations to a different site.
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  /** Number of currently overridden tokens; drives the badge. */
  overrideCount: number
  /** Whether the share link was just copied (shows confirmation for 1.5s). */
  copied: boolean
  /** The bare encoded state code (`o=` value); when non-empty the "Copy state code" button is shown. */
  stateCode: string
  /** Whether the state code was just copied (shows confirmation for 1.5s). */
  copiedCode: boolean
}>()

const emit = defineEmits<{
  /** Emitted when the user clicks Copy share link. */
  copy: []
  /** Emitted when the user clicks Copy state code. */
  copyCode: []
}>()
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.cust-share-panel {
  background: $tb-surface;
  border-bottom: 1px solid $tb-border;
  padding: 12px 16px;
}

.cust-share-label {
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

.share-badge {
  background: $tb-accent-subtle;
  color: $tb-accent;
  border-radius: 8px;
  padding: 1px 6px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0;
}

.cust-share-copy-btn {
  width: 100%;
  background: $tb-accent;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  transition: opacity 0.12s, background 0.15s;
  white-space: nowrap;

  &:hover { opacity: 0.85; }
  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 2px; }
  &--copied { background: $tb-success; }
}

.cust-share-code-btn {
  width: 100%;
  margin-top: 6px;
  background: $tb-surface-2;
  color: $tb-text-dim;
  border: 1px solid $tb-border-active;
  border-radius: 5px;
  padding: 6px 16px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: background 0.12s, color 0.12s, border-color 0.12s;
  white-space: nowrap;

  &:hover { background: $tb-border; color: $tb-text; }
  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 2px; }
  &--copied { background: $tb-success; color: #fff; border-color: $tb-success; }
}

.cust-share-hint {
  font-size: 12px;
  color: $tb-text-muted;
  margin: 8px 0 0;
  line-height: 1.55;
}
</style>
