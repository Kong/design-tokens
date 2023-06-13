<template>
  <h2>Colors</h2>
  <ColorBlock token="kui-color-background-primary" />
  <ColorBlock token="kui-color-background-warning-weakest" />
  <ColorBlock token="kui-color-background-danger" />
  <ColorBlock token="kui-color-background-success-weakest" />

  <h2>Icons</h2>
  <KongIcon />
</template>

<script setup lang="ts">
import ColorBlock from '@/components/ColorBlock.vue'
import KongIcon from '@/components/KongIcon.vue'
</script>
