/**
 * Source of the live-preview bookmarklet.
 *
 * When the designer clicks this on any target page, it:
 *  1. Injects an empty `<style id="tb-token-overrides">` into the page's <head>
 *  2. Adds a `message` listener that writes the style tag's content on every
 *     `kui-token-override` postMessage from our customizer window
 *  3. Pings `window.opener` (the customizer window that called window.open) with
 *     a `kui-preview-ready` message so the customizer knows the bridge is live
 *
 * The bookmarklet only works when the target page was opened by our customizer via
 * `window.open(url, 'kui-preview-target')` — that's what gives us `window.opener`.
 */
const BOOKMARKLET_SOURCE = `(()=>{
  var s=document.getElementById('tb-token-overrides');
  if(!s){s=document.createElement('style');s.id='tb-token-overrides';document.head.appendChild(s);}
  window.addEventListener('message',function(e){
    if(e.data&&e.data.type==='kui-token-override')s.textContent=e.data.css;
  });
  if(window.opener)window.opener.postMessage({type:'kui-preview-ready',origin:location.origin},'*');
})()`

/** The bookmarklet as a `javascript:` URI — use as the `href` of a drag-to-bookmark link. */
export const BOOKMARKLET_HREF = `javascript:${encodeURIComponent(BOOKMARKLET_SOURCE)}`
