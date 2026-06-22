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
            <a
              class="bm-drag-link"
              :href="bookmarkletHref"
              @click.prevent
            >
              🔖 Design Token Customizer
            </a>
            <span class="bm-drag-hint">← drag this to your bookmarks bar</span>
          </div>
          <ol class="bm-steps">
            <li>Drag the link above to your browser's bookmarks bar</li>
            <li>Navigate to the page you want to customize</li>
            <li>Click the bookmarklet — a token editor panel opens on the page</li>
            <li>Edit tokens; changes apply live</li>
          </ol>
          <hr class="bm-divider">
          <div class="bm-standalone-row">
            <span class="bm-standalone-label">For standalone use (share links, CSS export):</span>
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
  /** The `javascript:` bookmarklet href for the drag link. */
  bookmarkletHref: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.bm-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.bm-modal {
  background: $tb-surface;
  border: 1px solid $tb-border;
  border-radius: 10px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.22);
  width: 100%;
  max-width: 480px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.bm-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 14px;
  border-bottom: 1px solid $tb-border;
}

.bm-title {
  font-size: 15px;
  font-weight: 600;
  color: $tb-text;
  margin: 0;
}

.bm-close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  color: $tb-text-muted;
  padding: 4px 6px;
  border-radius: 4px;
  line-height: 1;

  &:hover { background: $tb-surface-2; color: $tb-text; }
  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 2px; }
}

.bm-body {
  padding: 20px;
}

.bm-desc {
  font-size: 13px;
  color: $tb-text-dim;
  margin: 0 0 16px;
  line-height: 1.6;
}

.bm-drag-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.bm-drag-link {
  display: inline-block;
  background: $tb-accent-subtle;
  color: $tb-accent;
  border: 1px solid rgba(0, 68, 244, 0.2);
  border-radius: 6px;
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  cursor: grab;
  user-select: none;
  flex-shrink: 0;

  &:active { cursor: grabbing; }
  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 2px; }
}

.bm-drag-hint {
  font-size: 12px;
  color: $tb-text-muted;
}

.bm-steps {
  margin: 0 0 16px;
  padding-left: 20px;
  font-size: 13px;
  color: $tb-text-dim;
  line-height: 1.8;

  code {
    background: $tb-surface-2;
    border-radius: 3px;
    padding: 1px 4px;
    font-family: $tb-mono;
    font-size: 11px;
  }
}

.bm-divider {
  border: none;
  border-top: 1px solid $tb-border;
  margin: 16px 0;
}

.bm-standalone-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.bm-standalone-label {
  font-size: 12px;
  color: $tb-text-muted;
}

.bm-standalone-link {
  font-size: 13px;
  font-weight: 500;
  color: $tb-accent;
  text-decoration: none;

  &:hover { text-decoration: underline; }
  &:focus-visible { outline: 2px solid $tb-accent; outline-offset: 2px; border-radius: 2px; }
}
</style>
