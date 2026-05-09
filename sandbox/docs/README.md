# Kong Design Tokens Sandbox

Interactive browser and customizer for all Kong UI design tokens.

---

## Running locally

```bash
# From the repo root
pnpm sandbox
```

Opens at `http://localhost:5173`.

---

## Token Browser (`/`)

Browse all 337 design tokens organized into categories:

| Tab | What's inside |
|-----|--------------|
| Color | Background, border, and text color tokens |
| Space | Spacing scale |
| Font | Family, size, and weight |
| Border | Radius and width |
| Shadow | Box shadow values |
| Animation | Duration/easing |
| Breakpoint | Responsive breakpoints |
| Letter Spacing | Letter spacing scale |
| Line Height | Line height scale |
| Components | Icon, method, navigation, and status tokens |

### Copying tokens

Use the **CSS / Sass / JS** toggle in the header to select the copy format:

| Format | Example output |
|--------|---------------|
| CSS | `var(--kui-color-background-primary)` |
| Sass | `$kui-color-background-primary` |
| JS | `KUI_COLOR_BACKGROUND_PRIMARY` |

Click any token card to copy it in the selected format.

### Searching

- **Search bar**: type to filter across all tokens and values
- **Cmd/Ctrl+F**: jumps focus to the search input (overrides browser find)
- Results are grouped by category with match counts

---

## Token Customizer (`/customize`)

Override token values to experiment with themes. Changes apply live via a `<style>` tag injected in the document — no rebuild needed.

### Editing tokens

1. Browse or filter the left-hand token list
2. Click any color swatch to open a native color picker, or type directly into the value input
3. Modified tokens are highlighted in blue; a count badge in the header tracks how many are overridden
4. Click **✕** on any row to reset that token, or **Reset all** to clear everything

### Exporting

| Button | What it does |
|--------|-------------|
| **Copy CSS** | Copies a minimal `:root { … }` block with only your changed tokens — paste into your app CSS |
| **↓ Download** | Downloads a complete CSS file with all 337 tokens, overrides applied — use as a standalone stylesheet |

### Sharing overrides

Click **Copy share link** to copy a URL with your overrides encoded in the hash fragment (e.g. `…/customize#o=W1si…`).

- The hash encodes override values by CSS variable name — share links remain valid even as new tokens are added
- Opening the link restores exactly the overrides that were active when it was copied
- Unknown token names in the hash are silently ignored (backwards-compatible with renamed tokens)

---

## Live Preview

Test your token overrides against a real application. Two modes are available depending on whether you're running locally or using the hosted site.

### Mode A — Local dev (iframe proxy)

Available when running `pnpm sandbox`.

1. In the customizer, find the **preview panel** in the center column (visible on screens ≥ 1200px wide)
2. Paste any URL into the address bar and click **Load**
3. The page renders inside an iframe via the local dev proxy — your token overrides are injected live as you edit them

**Limitations:**
- Pages that require authentication will load in their logged-out state (the proxy is unauthenticated)
- Some sites may fail to load if they use strict referrer policies or heavily depend on cookies/session

**How it works:** The Vite dev server proxies the request through Node.js (no browser CORS limits), rewrites the HTML to inject a `<style id="tb-token-overrides">` tag and a `<base>` tag for relative-URL resolution, then strips `Content-Security-Policy` headers so inline styles are allowed. The iframe is same-origin with our app, so the customizer can update the style tag directly.

### Mode B — Hosted / GitHub Pages (bookmarklet)

Available on the hosted site (or any non-dev build).

**One-time setup:**

1. Open the customizer's preview panel
2. Drag the **🔖 Drag to bookmarks bar** link to your browser's bookmarks bar

**Per-session usage:**

1. Paste your target URL in the preview panel and click **Open →** — the page opens in a new window
2. Navigate to that window and click the bookmarklet in your bookmarks bar
3. The customizer shows **"Connected to \<origin\>"** and starts sending overrides immediately
4. Edit any token — changes appear in the target window in real time

**Advantages over the proxy:**
- Your existing browser session applies — authenticated pages work as-is
- No proxy needed — tokens are injected via `postMessage`

**How it works:** The bookmarklet injects a `<style>` tag into the target page and registers a `message` event listener. When you edit tokens in the customizer, it sends `{ type: 'kui-token-override', css: '…' }` to the popup window via `postMessage`. The bookmarklet's listener writes the CSS to the injected style tag.

**Viewport controls (both modes):**

The row of buttons above the preview shows the actual breakpoint token values from your token set:

```
[xs] [sm] [md] [lg] [xl]   📱  💻  🖥   1280 px
```

- Click a breakpoint label to set the preview to that exact width
- Use **📱 / 💻 / 🖥** as semantic Mobile / Tablet / Desktop shortcuts
- Type a number in the `px` field for arbitrary widths (320–3840)

---

## Troubleshooting

**Preview iframe shows a blank page or error**
- Check the URL is valid and publicly reachable
- Some sites block embedding with `X-Frame-Options` — the proxy strips this header, but some may still fail
- Try the bookmarklet method instead (Mode B)

**Share link doesn't restore my overrides**
- Links created before an encoding format change (from index-based to name-based keys) are not backwards-compatible — this was a one-time migration
- If a token was renamed since the link was created, that override is silently dropped

**Bookmarklet says "Connected" but nothing changes**
- Make sure you clicked **Open →** first (the customizer needs to hold a window reference before the bookmarklet ping arrives)
- If you navigated the popup window to a new URL, click the bookmarklet again to re-establish the listener
