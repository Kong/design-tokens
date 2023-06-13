<template>
  <h4>SVG via JavaScript</h4>
  <img
    v-for="(icon, idx) in icons"
    :key="`js-icon-${idx}`"
    alt="js-svg-icon"
    class="kong-icon"
    :src="icon.source"
  >
  <h4>SVG via Sass variable</h4>
  <div
    v-for="(icon, idx) in icons"
    :key="`sass-icon-${idx}`"
    alt="test-icon"
    class="kong-icon is-sass"
    :class="icon.key"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { KUI_ASSET_ICON_ADD, KUI_ASSET_ICON_COG, KUI_ASSET_ICON_MESH } from '@tokens/js/icons'

const icons = computed((): { key: string, source: string }[] => {
  const getIconSrc = (icon: string): string => `data:image/svg+xml;base64,${icon}`

  return [
    {
      key: 'add',
      source: getIconSrc(KUI_ASSET_ICON_ADD),
    },
    {
      key: 'cog',
      source: getIconSrc(KUI_ASSET_ICON_COG),
    },
    {
      key: 'mesh',
      source: getIconSrc(KUI_ASSET_ICON_MESH),
    },
  ]
})
</script>

<style lang="scss">
@import "../../dist/tokens/css/icons.css";
</style>

<style lang="scss" scoped>
// Import SCSS icon variables
@import "../../dist/tokens/scss/icons";

$icon-size: 36px;

.kong-icon {
  display: inline-block;
  width: $icon-size;
  height: $icon-size;
  margin-right: 8px;

  &:last-of-type {
    margin-right: 0;
  }

  &.is-sass {
    background-size: $icon-size;
    background-repeat: no-repeat;
  }

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
</style>
