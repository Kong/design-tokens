import { onMounted, onUnmounted, toValue } from 'vue'
import type { MaybeRefOrGetter, Ref } from 'vue'

/**
 * Binds Cmd+F (macOS) / Ctrl+F (Windows/Linux) to focus a specific search input,
 * preventing the browser's native find-in-page dialog from opening.
 *
 * @param inputEl - Ref to the `<input>` element that should receive focus on shortcut.
 * @param enabled - When falsy, the shortcut is a no-op (native find-in-page is left alone).
 *   Defaults to always enabled. Used so a tool mounted-but-hidden inside
 *   `SandboxUnifiedEmbed.vue` doesn't keep intercepting Cmd/Ctrl+F while another tool is active.
 */
export function useSearchShortcut(inputEl: Ref<HTMLInputElement | null>, enabled: MaybeRefOrGetter<boolean> = true) {
  function onKeydown(e: KeyboardEvent) {
    if (!toValue(enabled)) return
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
