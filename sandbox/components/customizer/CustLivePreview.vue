<template>
  <div class="cust-preview-panel">
    <div class="preview-section-header">
      Live preview
    </div>
    <div class="preview-body">
      <!-- Colors: buttons and badges -->
      <div class="preview-section">
        <div class="preview-label">
          Buttons
        </div>
        <div class="preview-row">
          <button class="prev-btn prev-btn--primary">
            Primary
          </button>
          <button class="prev-btn prev-btn--danger">
            Danger
          </button>
          <button class="prev-btn prev-btn--neutral">
            Neutral
          </button>
        </div>
      </div>

      <div class="preview-section">
        <div class="preview-label">
          Status badges
        </div>
        <div class="preview-row">
          <span class="prev-badge prev-badge--success">Success</span>
          <span class="prev-badge prev-badge--warning">Warning</span>
          <span class="prev-badge prev-badge--danger">Danger</span>
          <span class="prev-badge prev-badge--info">Info</span>
        </div>
      </div>

      <!-- Typography -->
      <div class="preview-section">
        <div class="preview-label">
          Typography
        </div>
        <p class="prev-text-heading">
          Heading text
        </p>
        <p class="prev-text-body">
          Body text — The quick brown fox
        </p>
        <p class="prev-text-small">
          Small / secondary text
        </p>
        <p class="prev-text-mono">
          Monospace: var(--kui-color-bg)
        </p>
      </div>

      <!-- Border radius -->
      <div class="preview-section">
        <div class="preview-label">
          Border radius
        </div>
        <div class="preview-row prev-radii">
          <div
            class="prev-radius prev-radius--none"
            title="radius-0 / none"
          />
          <div
            class="prev-radius prev-radius--sm"
            title="radius-20 / sm"
          />
          <div
            class="prev-radius prev-radius--md"
            title="radius-30 / md"
          />
          <div
            class="prev-radius prev-radius--lg"
            title="radius-50 / lg"
          />
          <div
            class="prev-radius prev-radius--pill"
            title="radius-round / pill"
          />
        </div>
      </div>

      <!-- Shadow -->
      <div class="preview-section">
        <div class="preview-label">
          Shadows
        </div>
        <div class="preview-row">
          <div class="prev-shadow prev-shadow--sm" />
          <div class="prev-shadow prev-shadow--md" />
          <div class="prev-shadow prev-shadow--lg" />
        </div>
      </div>

      <!-- Spacing -->
      <div class="preview-section">
        <div class="preview-label">
          Space scale
        </div>
        <div class="prev-space-demo">
          <div class="prev-space-box prev-space-box--xs" />
          <div class="prev-space-box prev-space-box--sm" />
          <div class="prev-space-box prev-space-box--md" />
          <div class="prev-space-box prev-space-box--lg" />
          <div class="prev-space-box prev-space-box--xl" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No token CSS import: --kui-* vars resolve via the live override style tag injected
// by useTokenCustomizer. Fallback values in each var() handle the no-override state.
</script>

<style lang="scss">
// Non-scoped: preview elements reference --kui-* vars directly so live override injection works
.cust-preview-panel {
  .prev-btn {
    border: none;
    border-radius: var(--kui-border-radius-30, 4px);
    padding: var(--kui-space-30, 6px) var(--kui-space-60, 16px);
    font-family: var(--kui-font-family-text, 'Inter', sans-serif);
    font-size: var(--kui-font-size-30, 14px);
    font-weight: var(--kui-font-weight-semibold, 600);
    cursor: default;

    &--primary {
      background: var(--kui-color-background-primary, #0044f4);
      color: var(--kui-color-text-inverse, #ffffff);
    }
    &--danger {
      background: var(--kui-color-background-danger, #d60027);
      color: var(--kui-color-text-inverse, #ffffff);
    }
    &--neutral {
      background: var(--kui-color-background-neutral-weakest, #f9fafb);
      color: var(--kui-color-text, #0f172a);
      border: 1px solid var(--kui-color-border, #e0e4ea);
    }
  }

  .prev-badge {
    display: inline-flex;
    align-items: center;
    border-radius: var(--kui-border-radius-round, 100px);
    padding: 2px 10px;
    font-family: var(--kui-font-family-text, 'Inter', sans-serif);
    font-size: var(--kui-font-size-20, 12px);
    font-weight: var(--kui-font-weight-medium, 500);

    &--success {
      background: var(--kui-color-background-success-weakest, #dcfce7);
      color: var(--kui-color-text-success, #005944);
    }
    &--warning {
      background: var(--kui-color-background-warning-weakest, #fef3c7);
      color: var(--kui-color-text-warning, #854d0e);
    }
    &--danger {
      background: var(--kui-color-background-danger-weakest, #ffe5e5);
      color: var(--kui-color-text-danger, #d60027);
    }
    &--info {
      background: var(--kui-color-background-info-weakest, #eefaff);
      color: var(--kui-color-text-info, #0030cc);
    }
  }

  .prev-text-heading {
    font-family: var(--kui-font-family-text, 'Inter', sans-serif);
    font-size: var(--kui-font-size-50, 20px);
    font-weight: var(--kui-font-weight-semibold, 600);
    color: var(--kui-color-text, #0f172a);
    margin: 0 0 2px;
    line-height: 1.3;
  }
  .prev-text-body {
    font-family: var(--kui-font-family-text, 'Inter', sans-serif);
    font-size: var(--kui-font-size-30, 14px);
    color: var(--kui-color-text, #0f172a);
    margin: 0 0 2px;
  }
  .prev-text-small {
    font-family: var(--kui-font-family-text, 'Inter', sans-serif);
    font-size: var(--kui-font-size-20, 12px);
    color: var(--kui-color-text-neutral, #6c7489);
    margin: 0;
  }
  .prev-text-mono {
    font-family: var(--kui-font-family-code, 'JetBrains Mono', monospace);
    font-size: var(--kui-font-size-20, 12px);
    color: var(--kui-color-text-neutral, #6c7489);
    margin: 0;
  }

  .prev-radius {
    width: 36px;
    height: 36px;
    background: var(--kui-color-background-primary, #0044f4);
    opacity: 0.7;

    &--none   { border-radius: var(--kui-border-radius-0, 0px); }
    &--sm     { border-radius: var(--kui-border-radius-20, 2px); }
    &--md     { border-radius: var(--kui-border-radius-30, 4px); }
    &--lg     { border-radius: var(--kui-border-radius-50, 8px); }
    &--pill   { border-radius: var(--kui-border-radius-round, 100px); }
  }

  .prev-shadow {
    width: 48px;
    height: 48px;
    background: white;
    border-radius: var(--kui-border-radius-30, 4px);

    &--sm { box-shadow: var(--kui-shadow-border, 0 0 0 1px rgba(0,0,0,0.1)); }
    &--md { box-shadow: var(--kui-shadow-focus, 0 0 0 3px rgba(0,68,244,0.2)); }
    &--lg { box-shadow: var(--kui-shadow-popover, 0 4px 12px rgba(0,0,0,0.12)); }
  }

  .prev-space-box {
    background: var(--kui-color-background-primary, #0044f4);
    opacity: 0.6;
    border-radius: 2px;
    height: 100%;

    &--xs { width: var(--kui-space-20, 2px); }
    &--sm { width: var(--kui-space-40, 8px); }
    &--md { width: var(--kui-space-60, 16px); }
    &--lg { width: var(--kui-space-80, 24px); }
    &--xl { width: var(--kui-space-100, 40px); }
  }
}
</style>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.cust-preview-panel {
  background: $tb-surface;
}

.preview-section-header {
  padding: 10px 16px 8px;
  border-bottom: 1px solid $tb-border;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: $tb-text-muted;
}

.preview-body {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.preview-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.preview-label {
  font-size: 11px;
  font-weight: 500;
  color: $tb-text-muted;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.preview-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}

.prev-radii {
  align-items: flex-end;
}

.prev-space-demo {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 36px;
}
</style>
