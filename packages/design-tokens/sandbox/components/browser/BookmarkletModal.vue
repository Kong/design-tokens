<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="bm-backdrop"
      @click.self="emit('update:modelValue', false)"
    >
      <div
        aria-labelledby="bm-title"
        aria-modal="true"
        class="bm-modal"
        role="dialog"
      >
        <div class="bm-header">
          <h2
            id="bm-title"
            class="bm-title"
          >
            Use tokens on any page
          </h2>
          <button
            aria-label="Close"
            class="bm-close"
            @click="emit('update:modelValue', false)"
          >
            ✕
          </button>
        </div>
        <div class="bm-body">
          <p class="bm-desc">
            The bookmarklet injects a live token editor sidebar directly onto any page — no code changes needed.
            Your existing browser session is preserved, so authenticated pages work as-is.
          </p>
          <div class="bm-drag-row">
            <div class="bm-drag-links">
              <a
                class="bm-drag-link"
                :href="bookmarkletHref"
                @click.prevent
              >
                🔖 Kong Design Tokens
              </a>
            </div>
            <span class="bm-drag-hint">← drag to your bookmarks bar</span>
          </div>
          <ol class="bm-steps">
            <li>Drag the link above to your browser's bookmarks bar</li>
            <li>Navigate to the page you want to customize</li>
            <li>Click the bookmarklet — a panel opens on the page</li>
            <li>Switch between Theme Builder and Customizer from the tabs inside the panel; edit tokens and changes apply live</li>
          </ol>
          <hr class="bm-divider">
          <div class="bm-standalone-row">
            <span class="bm-standalone-label">For standalone use (live preview, CSS export/import):</span>
            <router-link
              class="bm-standalone-link"
              to="/customize"
              @click="emit('update:modelValue', false)"
            >
              Open Token Customizer →
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  /** Controls visibility; use with v-model. */
  modelValue: boolean
  /** The single unified bookmarklet's `javascript:` href for the drag link. */
  bookmarkletHref: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.bm-backdrop {
  align-items: center;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 20px;
  position: fixed;
  z-index: 1000;
}

.bm-modal {
  background: $tb-surface;
  border: 1px solid $tb-border;
  border-radius: 10px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.22);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  max-width: 480px;
  width: 100%;
}

.bm-header {
  align-items: center;
  border-bottom: 1px solid $tb-border;
  display: flex;
  justify-content: space-between;
  padding: 16px 20px 14px;
}

.bm-title {
  color: $tb-text;
  font-size: 15px;
  font-weight: 600;
  margin: 0;
}

.bm-close {
  background: none;
  border: none;
  border-radius: 4px;
  color: $tb-text-muted;
  cursor: pointer;
  font-size: 13px;
  line-height: 1;
  padding: 4px 6px;

  &:hover { background: $tb-surface-2; color: $tb-text; }

  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 2px; }
}

.bm-body {
  padding: 20px;
}

.bm-desc {
  color: $tb-text-dim;
  font-size: 13px;
  line-height: 1.6;
  margin: 0 0 16px;
}

.bm-drag-row {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.bm-drag-links {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.bm-drag-link {
  background: $tb-accent-subtle;
  border: 1px solid rgba(0, 68, 244, 0.2);
  border-radius: 6px;
  color: $tb-accent;
  cursor: grab;
  display: inline-block;
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 500;
  padding: 7px 14px;
  text-decoration: none;
  user-select: none;

  &:active { cursor: grabbing; }

  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 2px; }
}

.bm-drag-hint {
  color: $tb-text-muted;
  font-size: 12px;
}

.bm-steps {
  color: $tb-text-dim;
  font-size: 13px;
  line-height: 1.8;
  margin: 0 0 16px;
  padding-left: 20px;

  code {
    background: $tb-surface-2;
    border-radius: 3px;
    font-family: $tb-mono;
    font-size: 11px;
    padding: 1px 4px;
  }
}

.bm-divider {
  border: none;
  border-top: 1px solid $tb-border;
  margin: 16px 0;
}

.bm-standalone-row {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.bm-standalone-label {
  color: $tb-text-muted;
  font-size: 12px;
}

.bm-standalone-link {
  color: $tb-accent;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;

  &:hover { text-decoration: underline; }

  &:focus-visible { border-radius: 2px; outline: 2px solid $tb-accent; outline-offset: 2px; }
}
</style>
