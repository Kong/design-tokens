import { onMounted, onUnmounted, type Ref } from 'vue'

/**
 * Observes the height of a header element and writes it as `--header-h` on the document root.
 * Used to keep sticky sub-elements (tabs, search) correctly positioned below floating headers
 * whose height varies with viewport width.
 */
export function useHeaderHeight(headerEl: Ref<HTMLElement | null>) {
  let observer: ResizeObserver | undefined

  onMounted(() => {
    if (!headerEl.value) return
    observer = new ResizeObserver((entries) => {
      const h = Math.ceil(entries[0]?.borderBoxSize?.[0]?.blockSize ?? 57) // 57px = header natural height at default font size
      document.documentElement.style.setProperty('--header-h', `${h}px`)
    })
    observer.observe(headerEl.value)
  })

  onUnmounted(() => {
    observer?.disconnect()
    document.documentElement.style.removeProperty('--header-h')
  })
}
