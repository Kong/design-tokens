<template>
  <div class="color-block-container">
    <div
      class="swatch"
      :style="blockStyles"
    />
    <div class="description">
      <span>{{ token }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  token: {
    type: String,
    required: true,
    default: '',
  },
})

const blockStyles = computed((): Record<string, string> => ({
  backgroundColor: `var(--${props.token}, '#000')`,
}))
</script>

<style lang="scss" scoped>
.color-block-container {
  display: flex;
  align-items: center;
  margin: 8px;
  padding: 24px 0;

  .swatch {
    width: 40px;
    height: 40px;
    border-radius: 4px;
  }

  .description {
    flex: 1;
    margin-left: 16px;
    font-size: var(--kui-font-size-30);

    span {
      display: block;

      &:first-of-type {
        font-weight: 600;
        margin-bottom: 4px;
      }
    }
  }
}
</style>
