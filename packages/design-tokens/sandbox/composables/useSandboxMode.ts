/**
 * Which tool tab is selected in the unified bookmarklet sidebar. Whether that tool's overrides
 * are actually live on the target page is a *separate*, orthogonal concern — see
 * `SandboxUnifiedEmbed.vue`'s own `previewEnabled` toggle. A tool stays selected (and editable)
 * even while live preview is switched off; switching tools never implies enabling/disabling.
 */
export type SandboxTool = 'customizer' | 'theme-builder'

/** Type guard narrowing a raw hash-param string to a valid `SandboxTool`. */
export function isSandboxTool(v: string | null): v is SandboxTool {
  return v === 'customizer' || v === 'theme-builder'
}
