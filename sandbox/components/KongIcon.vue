<template>
  <div>
    <div class="kong-icon-container">
      <div>SVG via JavaScript</div>
      <img
        alt="js-svg-icon"
        class="kong-icon"
        :src="props.icon.source"
      >
    </div>
    <div class="kong-icon-container">
      <div>SVG via Sass variable</div>
      <div
        alt="scss-svg-icon"
        class="kong-icon is-sass"
        :class="props.icon.key"
      />
    </div>
    <div class="kong-icon-container is-blue">
      <div>SVG via Sass variable and mask-image</div>
      <div
        alt="scss-svg-icon"
        class="kong-icon is-sass-mask"
        :class="props.icon.key"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'

const props = defineProps({
  icon: {
    type: Object as PropType<{ key: string, source: string }>,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
@import "../../dist/tokens/scss/variables";
// Import SCSS icon variables
@import "../../dist/tokens/scss/icons";

$icon-size: 36px;

.kong-icon-container {
  display: flex;
  align-items: center;
  padding: 4px;
  font-size: $kui-font-size-30;
  border-bottom: 1px solid $kui-color-background-neutral-weaker;

  &:first-of-type {
    border-top: 1px solid $kui-color-background-neutral;
  }

  &.is-blue {
    color: $kui-color-border-primary-weak;
  }
}

.kong-icon {
  display: block;
  width: $icon-size;
  height: $icon-size;
  margin: 0 8px 0 8px;

  &.is-sass {
    background-size: $icon-size;
    background-repeat: no-repeat;

    &.add {
      background-image: url('data:image/svg+xml;base64,#{$kui-asset-icon-add}');
    }
    &.cog {
      background-image: url('data:image/svg+xml;base64,#{$kui-asset-icon-cog}');
    }
    &.mesh {
      background-image: url('data:image/svg+xml;base64,#{$kui-asset-icon-mesh}');
    }
  }

  &.is-sass-mask {
    background: currentColor;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-size: $icon-size;
    mask-size: $icon-size;

    &.add {
      -webkit-mask-image: url('data:image/svg+xml;base64,#{$kui-asset-icon-add}');
      mask-image: url('data:image/svg+xml;base64,#{$kui-asset-icon-add}');
    }
    &.cog {
      -webkit-mask-image: url('data:image/svg+xml;base64,#{$kui-asset-icon-cog}');
      mask-image: url('data:image/svg+xml;base64,#{$kui-asset-icon-cog}');
    }
    &.mesh {
      -webkit-mask-image: url('data:image/svg+xml;base64,#{$kui-asset-icon-mesh}');
      mask-image: url('data:image/svg+xml;base64,#{$kui-asset-icon-mesh}');
    }
  }
}
</style>
