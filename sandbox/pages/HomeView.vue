<template>
  <h2>Colors</h2>
  <ColorBlock token="kui-color-background-primary" />
  <ColorBlock token="kui-color-background-warning-weakest" />
  <ColorBlock token="kui-color-background-danger" />
  <ColorBlock token="kui-color-background-success-weakest" />

  <h2>Icons</h2>
  <KongIcon
    v-for="(icon, idx) in icons"
    :key="`icon-${idx}`"
    :icon="icon"
  />
</template>

<script setup lang="ts">
import ColorBlock from '@/components/ColorBlock.vue'
import KongIcon from '@/components/KongIcon.vue'

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
