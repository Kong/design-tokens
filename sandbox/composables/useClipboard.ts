import { ref } from 'vue'

/**
 * Clipboard helper with a 1.5s visual confirmation state.
 * Falls back to the deprecated `execCommand('copy')` when the Clipboard API
 * is unavailable (e.g. on the Vite HTTP dev server, which is not HTTPS).
 */
export function useClipboard() {
  const copiedKey = ref<string | null>(null)
  let resetTimer: ReturnType<typeof setTimeout>

  /**
   * Copies `text` to the clipboard and marks `key` as copied for 1.5s.
   * `key` can be any string used to identify which element was copied.
   */
  async function copyText(text: string, key: string = '__default__') {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // navigator.clipboard requires HTTPS; Vite dev server is HTTP so we need this fallback
      const el = document.createElement('textarea')
      el.value = text
      Object.assign(el.style, { position: 'fixed', opacity: '0', pointerEvents: 'none' })
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    copiedKey.value = key
    clearTimeout(resetTimer)
    resetTimer = setTimeout(() => {
      copiedKey.value = null
    }, 1500)
  }

  return { copiedKey, copyText }
}
