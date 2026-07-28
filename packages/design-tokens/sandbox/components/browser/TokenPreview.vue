<template>
  <div :class="['token-preview', `token-preview--${token.category}`]">
    <template v-if="token.category === 'color'">
      <div
        class="preview-color-swatch"
        :style="{ background: token.value }"
      />
    </template>

    <template v-else-if="token.category === 'space'">
      <div class="preview-bar-wrap">
        <div
          :class="['space-bar', { 'space-bar--auto': token.value === 'auto' }]"
          :style="token.value !== 'auto' ? { width: spaceBarWidth } : {}"
        />
        <span class="bar-value">{{ token.value }}</span>
      </div>
    </template>

    <!-- Shadow: small white box with the shadow rendered on a light stage -->
    <template v-else-if="token.category === 'shadow'">
      <div class="preview-shadow-stage">
        <div
          class="shadow-demo-box"
          :style="{ boxShadow: token.value }"
        />
      </div>
    </template>

    <!-- Border radius: filled box; Border width: stroke line -->
    <template v-else-if="token.category === 'border'">
      <div
        v-if="borderSubtype === 'radius'"
        class="preview-center"
      >
        <div
          class="border-radius-demo"
          :style="{ borderRadius: token.value }"
        />
      </div>
      <div
        v-else
        class="preview-bar-wrap"
        style="padding: 16px;"
      >
        <div
          class="border-width-demo"
          :style="{ height: token.value }"
        />
      </div>
    </template>

    <!-- Font: three sub-types from key shape (FAMILY / SIZE / WEIGHT) -->
    <template v-else-if="token.category === 'font'">
      <div class="preview-font">
        <span
          v-if="fontSubtype === 'family'"
          class="font-sample"
          :style="{ fontFamily: token.value }"
        >Ag</span>
        <span
          v-else-if="fontSubtype === 'size'"
          class="font-sample"
          :style="{ fontSize: fontSizeDisplay, lineHeight: '1' }"
        >Ag</span>
        <span
          v-else-if="fontSubtype === 'weight'"
          class="font-sample"
          :style="{ fontWeight: token.value }"
        >Kong</span>
      </div>
    </template>

    <template v-else-if="token.category === 'letter-spacing'">
      <div class="preview-letter-spacing">
        <span :style="{ letterSpacing: token.value }">Letters</span>
      </div>
    </template>

    <template v-else-if="token.category === 'line-height'">
      <div
        class="preview-line-height"
        :style="{ lineHeight: token.value }"
      >
        <span>The quick brown</span>
        <span>fox jumps over</span>
      </div>
    </template>

    <!-- Breakpoint: proportional ruler relative to 1920px as max reference -->
    <template v-else-if="token.category === 'breakpoint'">
      <div
        class="preview-bar-wrap"
        style="padding: 16px;"
      >
        <div
          class="space-bar breakpoint-bar"
          :style="{ width: breakpointBarWidth }"
        />
        <span class="bar-value">{{ token.value }}</span>
      </div>
    </template>

    <!-- Components: dispatch on value type inferred from key, then color, then badge -->
    <template v-else-if="token.category === 'components'">
      <div
        v-if="componentValueType === 'border-width'"
        class="preview-bar-wrap"
        style="padding: 16px;"
      >
        <div
          class="border-width-demo"
          :style="{ height: token.value }"
        />
      </div>
      <div
        v-else-if="isColorValue"
        class="preview-center"
      >
        <div
          class="preview-swatch-sm"
          :style="{ background: token.value }"
        />
      </div>
      <div
        v-else
        class="preview-center"
      >
        <div class="value-badge">
          {{ token.value }}
        </div>
      </div>
    </template>

    <!-- Fallback for any future token categories not yet explicitly handled -->
    <template v-else>
      <div class="preview-center">
        <div class="value-badge">
          {{ token.value }}
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TokenEntry } from '@/composables/useTokens'

const props = defineProps<{
  token: TokenEntry
}>()

const isColorValue = computed(() => /^(#|rgb|rgba|hsl)/.test(props.token.value))

// KUI_FONT_FAMILY_* | KUI_FONT_SIZE_* | KUI_FONT_WEIGHT_* — third segment identifies sub-type
const fontSubtype = computed(() =>
  props.token.category === 'font' ? props.token.key.split('_')[2]?.toLowerCase() : null,
)

// KUI_BORDER_RADIUS_* | KUI_BORDER_WIDTH_* — third segment identifies sub-type
const borderSubtype = computed(() =>
  props.token.category === 'border' ? props.token.key.split('_')[2]?.toLowerCase() : null,
)

/**
 * For component tokens, parse the property type from the key segments after the component name.
 * KUI_BUTTON_BORDER_WIDTH_* → 'border-width'
 * Returns null for non-component tokens or unrecognized property shapes.
 */
const componentValueType = computed((): string | null => {
  if (props.token.category !== 'components') return null
  const parts = props.token.key.split('_').slice(2) // drop KUI + component name
  if (parts[0] === 'BORDER' && parts[1] === 'WIDTH') return 'border-width'
  return null
})

// 96px = KUI_SPACE_150, the current maximum space value
const spaceBarWidth = computed(() => {
  const px = parseFloat(props.token.value)
  return isNaN(px) ? '0%' : `${Math.min((px / 96) * 100, 100)}%`
})

/** Cap rendered size so large font tokens don't overflow the card. */
const fontSizeDisplay = computed(() => {
  const px = parseFloat(props.token.value)
  return isNaN(px) ? props.token.value : `${Math.min(px, 44)}px`
})

// Relative to 1920px as a "full viewport" reference for the breakpoint ruler
const breakpointBarWidth = computed(() => {
  const px = parseFloat(props.token.value)
  return isNaN(px) ? '100%' : `${Math.min((px / 1920) * 100, 100)}%`
})
</script>

<style lang="scss" scoped>
@use '@/assets/tb-vars' as *;

.token-preview {
  align-items: center;
  display: flex;
  justify-content: center;
  min-height: 64px;
  overflow: hidden;

  // Color previews need more height for the swatch to read well
  &--color { min-height: 100px; padding: 0; }
}

.preview-color-swatch {
  height: 100%;
  min-height: 100px;
  width: 100%;
}

.preview-swatch-sm {
  border: 1px solid $tb-border;
  border-radius: 4px;
  height: 52px;
  width: 52px;
}

.preview-center {
  align-items: center;
  display: flex;
  justify-content: center;
  padding: 12px;
  width: 100%;
}

// Space / breakpoint bar
.preview-bar-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 16px;
  width: 100%;
}

.space-bar {
  background: $tb-accent;
  border-radius: 3px;
  height: 5px;
  min-width: 2px;

  &--auto {
    background: repeating-linear-gradient(
      90deg,
      $tb-accent 0px,
      $tb-accent 5px,
      transparent 5px,
      transparent 10px
    );
    width: 100% !important;
  }
}

.breakpoint-bar { background: color-mix(in srgb, $tb-accent 60%, transparent); }

.bar-value {
  color: $tb-text-dim;
  font-family: $tb-mono;
  font-size: 11px;
}

// Shadow stage on a white background so the shadow is visible regardless of theme
.preview-shadow-stage {
  align-items: center;
  background: $tb-surface-2;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  margin: 12px;
  padding: 16px;
}

.shadow-demo-box {
  background: white;
  border-radius: 4px;
  height: 52px;
  width: 52px;
}

.border-radius-demo {
  background: $tb-accent;
  height: 52px;
  opacity: 0.7;
  width: 52px;
}

.border-width-demo {
  background: $tb-accent;
  border-radius: 1px;
  min-height: 1px;
  width: 100%;
}

.preview-font {
  align-items: center;
  display: flex;
  justify-content: center;
  min-height: 72px;
  padding: 12px 16px;
  width: 100%;
}

.font-sample {
  color: $tb-text;
  font-size: 32px;
  line-height: 1.2;
  max-width: 100%;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.preview-letter-spacing {
  align-items: center;
  display: flex;
  justify-content: center;
  padding: 12px 16px;
  width: 100%;

  span {
    color: $tb-text;
    font-size: 18px;
    font-weight: 500;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.preview-line-height {
  color: $tb-text;
  display: flex;
  flex-direction: column;
  font-size: 12px;
  height: auto;
  // Allow the container to grow so multi-line previews aren't clipped
  min-height: 72px;
  overflow: visible;
  padding: 10px 16px;
  width: 100%;

  span { display: block; }
}

// Simple value badge for animation, unknown, and component non-color tokens
.value-badge {
  background: $tb-surface-2;
  border: 1px solid $tb-border;
  border-radius: 4px;
  color: $tb-text-dim;
  font-family: $tb-mono;
  font-size: 11px;
  max-width: calc(100% - 24px);
  overflow: hidden;
  padding: 4px 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
