<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive :max="10">
      <component
        :is="Component"
        :key="`${route.path}?embedded=${route.query.embedded ?? ''}&host=${route.query.host ?? ''}`"
      />
    </keep-alive>
  </router-view>
</template>

<style lang="scss">
html,
body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  margin: 0;
  padding: 0;
}

// Remove default browser outline globally; each interactive element provides
// its own :focus-visible style so keyboard users always see a visible indicator.
*:focus { outline: none; }

*:focus-visible { outline: revert; }

// Thin scrollbars across all scrollable containers.
* {
  scrollbar-color: rgba(0, 10, 60, 0.18) transparent;
  scrollbar-width: thin;
}

::-webkit-scrollbar { height: 6px; width: 6px; }

::-webkit-scrollbar-track { background: transparent; }

::-webkit-scrollbar-thumb {
  background: rgba(0, 10, 60, 0.18);
  border-radius: 3px;

  &:hover { background: rgba(0, 10, 60, 0.32); }
}
</style>
