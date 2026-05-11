<template>
  <router-view />
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
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 10, 60, 0.18) transparent;
}
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: rgba(0, 10, 60, 0.18);
  border-radius: 3px;
  &:hover { background: rgba(0, 10, 60, 0.32); }
}
</style>
