# Kong Design Tokens Sandbox

Interactive browser and customizer for all Kong UI design tokens.

---

## Running locally

```bash
# From the repo root
pnpm sandbox          # dev server at http://localhost:5173
pnpm sandbox:build    # production build into sandbox/dist/
pnpm sandbox:preview  # serve sandbox/dist/ locally
```

---

## Token Browser (`/`)

Browse all design tokens organized by category (Color, Font, Space, etc.).

### Copying tokens

Use the **CSS / Sass / JS** toggle in the header to select the copy format:

| Format | Example output |
|--------|---------------|
| CSS | `var(--kui-color-background-primary)` |
| Sass | `$kui-color-background-primary` |
| JS | `KUI_COLOR_BACKGROUND_PRIMARY` |

Click any token card to copy it in the selected format.

### Searching

- **Search bar**: filter across all token names and values
- **Cmd/Ctrl+F**: jumps focus to the search input (overrides browser find)
- Results are grouped by category with per-group match counts

### Bookmarklet quick-start

A **Kong Design Token Customizer** button on the homepage opens a modal with the bookmarklet drag link and setup instructions. See [Bookmarklet](#bookmarklet) for full details.

---

## Token Customizer (`/#/customize`)

Override token values to experiment with themes. Changes apply live to preview elements on the page — no rebuild needed.

### Editing tokens

1. Browse or filter the left-hand token list
2. Click any color swatch to open a native color picker, or type a value directly
3. Modified tokens are highlighted; the header badge tracks how many are overridden
4. Click **✕** on any row to reset that token, or **Reset all** to clear everything

### Collapsing groups

- Use the **Collapse all / Expand all** toggle above the token list
- Click any group header to collapse/expand individually
- Enable **Only modified** to hide all unmodified tokens

### CSS output panel

The right-hand panel shows the CSS to copy or download:

| State | Label | Contents |
|-------|-------|----------|
| No overrides | *No overrides yet* | — placeholder — |
| Overrides active | **Override patch CSS** | Only changed tokens |
| "All tokens" enabled | **All tokens CSS** | All 337 tokens (overrides applied) |

Use the **Inject all tokens** toggle (in the preview panel settings) to switch between the two export modes.

**⎘ Copy** copies the displayed CSS to the clipboard.
**↓ Download** downloads the full-tokens CSS as a `.css` file (always includes all tokens, overrides applied).

### Custom selector

By default the exported CSS uses `:root { … }`. Enter a custom selector (e.g. `[data-theme="dark"]`) in the **Selector** field to scope the output to a different element. The same selector is applied to overrides injected via the bookmarklet.

### Sharing overrides

Click **Copy share link** in the share panel to copy a URL with your overrides encoded in the hash:

```
https://kongponents.konghq.com/design-tokens/#/customize?o=W1si…
```

- Overrides are encoded by CSS variable name — links remain valid as new tokens are added
- Opening the link restores the exact overrides that were active when it was copied
- Unknown token names in the hash are silently ignored (forward-compatible)
- Share links **do not** include `embedded=1` — they always open the full customizer

---

## Bookmarklet

The bookmarklet lets you test your token overrides live on any site — including authenticated pages — directly in your browser.

### One-time setup

1. Open the **Kong Design Token Customizer** modal on the homepage (or navigate to `/#/customize` and find the bookmarklet card in the preview panel)
2. **Drag the 🔖 link** to your browser's bookmarks bar

### Per-page usage

1. Navigate to any page you want to preview (your existing browser session applies — auth works)
2. Click the bookmarklet in your bookmarks bar
3. A fixed-position customizer sidebar slides in from the right edge of the page

The sidebar is the token customizer running in an `iframe` in embedded mode (`?embedded=1`). Token overrides are sent from the iframe to the host page via `window.parent.postMessage` — no same-origin requirement.

### Persistence across navigation

The bookmarklet saves the full customizer URL (including your `?o=` overrides) to `sessionStorage` keyed by hostname. If you navigate to another page on the same site, click the bookmarklet again — it restores your exact overrides automatically.

### Toggling the sidebar

Click the **◀ / ▶** tab on the right edge of the page to show or hide the sidebar without losing your overrides.

### Sharing from the bookmarklet

Use **Copy share link** inside the embedded sidebar to copy a clean share URL (no `embedded=1`). Pasting this URL opens the full customizer with your overrides pre-loaded.

---

## Live Preview (dev mode only)

When running `pnpm sandbox`, the center column shows an iframe preview panel.

1. Paste any URL into the address bar and click **Load**
2. The page renders inside an iframe via the Vite proxy — token overrides are injected live as you edit them
3. Use the breakpoint preset buttons or the `px` input to resize the preview viewport

**How it works:** The Vite dev server proxies the request server-side (no CORS limits), rewrites the HTML to inject a `<style id="tb-token-overrides">` tag and a `<base>` tag for relative-URL resolution, and strips `Content-Security-Policy` and `X-Frame-Options` headers. The iframe is same-origin with the customizer, so overrides update the style tag directly on every change.

The iframe preview is **not** available on the hosted GitHub Pages build — use the bookmarklet instead.

---

## Troubleshooting

**Bookmarklet sidebar doesn't appear**
- Some pages block all injected scripts; try a different page or disable browser extensions that may interfere

**Bookmarklet shows a loading error**
- Check the site is reachable and your network is connected
- The error appears after 8 seconds; re-clicking the bookmarklet retries

**Preview iframe (dev mode) shows blank or error**
- Some pages may still fail even through the proxy (auth-gated pages, strict CORS on API calls within the page)
- Use the bookmarklet for pages that require your session

**Share link doesn't restore overrides**
- Links created with the old index-based encoding (before the name-based migration) are not backward-compatible — this was a one-time change
- If a token was renamed since the link was created, that override is silently skipped

**Overrides not appearing in the CSS output**
- Make sure the **Inject all tokens** toggle is set to the mode you want — "Override patch CSS" only shows when at least one token is changed
