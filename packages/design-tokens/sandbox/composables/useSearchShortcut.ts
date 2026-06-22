import { onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'

/**
 * Binds Cmd+F (macOS) / Ctrl+F (Windows/Linux) to focus a specific search input,
 * preventing the browser's native find-in-page dialog from opening.
 *
 * @param inputEl - Ref to the `<input>` element that should receive focus on shortcut.
 */
export function useSearchShortcut(inputEl: Ref<HTMLInputElement | null>) {
  function onKeydown(e: KeyboardEvent) {
    // metaKey = Cmd on Mac; ctrlKey = Ctrl on Windows/Linux
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
      e.preventDefault()
      inputEl.value?.focus()
      inputEl.value?.select()
    }
  }

  onMounted(() => window.addEventListener('keydown', onKeydown))
  onUnmounted(() => window.removeEventListener('keydown', onKeydown))
}
