/**
 * Template for the single, unified bookmarklet. `__EMBED_URL__` is replaced at runtime in
 * `buildBookmarkletHref.ts` with the absolute URL of the embedded sandbox route
 * (`/#/embedded?embedded=1`), derived from the deployment's own origin so it works in both dev
 * and on GitHub Pages. There is only ever one bookmarklet/sidebar now — the sidebar itself hosts
 * a Customizer / Theme Builder tab switcher plus a separate live-preview on/off toggle
 * (`SandboxUnifiedEmbed.vue`), so the DOM
 * element ids (`kong-sidebar`, `kong-sidebar-overlay`, `kong-sidebar-tab`), the global listener
 * guard flag (`__kongListener`), and the localStorage restore key (`kong-sidebar-url:<hostname>`)
 * are all unnamespaced. `STYLE_ID` (`kong-design-token-overrides`) is the single override style
 * tag injected into the target page.
 *
 * When the designer clicks this on any target page it:
 *  1. Injects `<style id="kong-design-token-overrides">` into the page
 *  2. Shows a loading overlay, then injects a 560px fixed sidebar `<iframe>` pointing to the
 *     embedded sandbox (`/#/embedded?embedded=1`). The loading overlay is removed on first CSS
 *     message; times out to an error state after 8 s.
 *  3. Persists the last-used iframe URL (mode + encoded overrides included) in localStorage
 *     under `kong-sidebar-url:<hostname>`, so re-clicking on the same hostname restores whichever
 *     mode (Customizer / Theme Builder / Off) and state were last active there.
 *  4. Appends the target page's hostname to the iframe src as `&host=<hostname>` so the embedded
 *     app — which cannot read the parent's location cross-origin — can key its own (sandbox-
 *     origin) state storage per target site.
 *  5. Re-clicking the bookmarklet toggles the sidebar. A `▶` / `◀` tab stays visible at the right
 *     edge so the user can always restore it.
 *
 * The message listener validates both the sender's origin (`e.origin` must match the sidebar
 * iframe's own origin) and the sender's identity (`e.source` must be the sidebar iframe's own
 * `contentWindow`) before applying `e.data.css`/`e.data.src` or acting on `kui-close`. The
 * `e.source` check specifically guards against a legacy pre-unification bookmarklet (which used
 * per-tool namespacing) still being present in a user's bookmarks bar: two same-origin sidebars
 * open at once would otherwise let either one's listener accept the other's messages, which was
 * the root cause of the "clicking one bookmarklet opens the other tool" bug this replaces.
 */
export const BOOKMARKLET_TEMPLATE = `(()=>{
  var STYLE_ID='kong-design-token-overrides';
  var FRAME_ID='kong-sidebar';
  var OVERLAY_ID='kong-sidebar-overlay';
  var TAB_ID='kong-sidebar-tab';
  var STORAGE_KEY='kong-sidebar-url:'+location.hostname;
  var WIDTH='560px';

  // Ensure the override style tag exists
  if(!document.getElementById(STYLE_ID)){
    var s=document.createElement('style');
    s.id=STYLE_ID;
    document.head.appendChild(s);
  }

  // Register message listener only once (guard against bookmarklet re-clicks)
  if(!window.__kongListener){
    window.__kongListener=true;
    window.addEventListener('message',function(e){
      if(!e.data)return;
      // Only accept messages from the sidebar iframe we created — checks both its origin and
      // that the message actually came from that iframe's own window (not just same-origin),
      // so any other frame/script on the page (or a stale legacy bookmarklet's sidebar) can't
      // post a fake kui-token-override into this one.
      var f=document.getElementById(FRAME_ID);
      if(!f||!f.src)return;
      try{if(e.origin!==new URL(f.src).origin)return;}catch(x){return;}
      if(e.source!==f.contentWindow)return;
      if(e.data.type==='kui-token-override'){
        var el=document.getElementById(STYLE_ID);
        if(el)el.textContent=e.data.css||'';
        if(e.data.src)try{localStorage.setItem(STORAGE_KEY,e.data.src);}catch(x){console.warn('[Kong design tokens] Could not save sidebar state — storage full or unavailable; this bookmarklet will not restore where you left off next time.',x);}
        // First postMessage confirms the sidebar loaded — remove the loading overlay
        var ov=document.getElementById(OVERLAY_ID);if(ov)ov.remove();
      }
      if(e.data.type==='kui-close'){
        var f=document.getElementById(FRAME_ID);if(f)f.remove();
        var t=document.getElementById(TAB_ID);if(t)t.remove();
        var ov=document.getElementById(OVERLAY_ID);if(ov)ov.remove();
      }
    });
  }

  // Toggle sidebar if already injected
  var frame=document.getElementById(FRAME_ID);
  var tab=document.getElementById(TAB_ID);
  if(frame&&tab){
    var open=frame.style.display!=='none';
    frame.style.display=open?'none':'block';
    tab.style.right=open?'0':WIDTH;
    tab.textContent=open?'\\u25C0':'\\u25B6'; // ◀ = click to show; ▶ = click to hide
    var ov=document.getElementById(OVERLAY_ID);if(ov)ov.style.display=open?'none':'flex';
    return;
  }

  // Restore URL from last session for this hostname, else use the baked-in default
  var src='__EMBED_URL__';
  try{var saved=localStorage.getItem(STORAGE_KEY);if(saved)src=saved;}catch(x){console.warn('[Kong design tokens] Could not read saved sidebar state — storage unavailable; opening with defaults.',x);}
  // Pass the target page's hostname to the embedded app (both bookmarklet URLs already contain "?embedded=1", so "&host=" is always valid). Idempotent: only add it once.
  if(src.indexOf('host=')===-1){src+='&host='+encodeURIComponent(location.hostname);}

  // Inject animation keyframes for the loading spinner
  var spinStyle=document.createElement('style');
  spinStyle.textContent='@keyframes _kongSpin{to{transform:rotate(360deg)}}';
  document.head.appendChild(spinStyle);

  // Loading overlay — covers the sidebar area while the iframe loads
  var overlay=document.createElement('div');
  overlay.id=OVERLAY_ID;
  overlay.style.cssText='position:fixed;top:0;right:0;width:'+WIDTH+';height:100vh;z-index:2147483645;background:#f8f9fa;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;font-family:system-ui,sans-serif;font-size:13px;color:#666;box-shadow:-4px 0 24px rgba(0,0,0,0.18)';
  var spinner=document.createElement('div');
  spinner.style.cssText='width:22px;height:22px;border:2.5px solid #dde;border-top-color:#0044f4;border-radius:50%;animation:_kongSpin .8s linear infinite';
  var loadMsg=document.createElement('span');
  loadMsg.textContent='Loading Kong design tokens…';
  overlay.appendChild(spinner);
  overlay.appendChild(loadMsg);
  document.body.appendChild(overlay);

  // Replace overlay content with an error message if loading times out
  setTimeout(function(){
    var ov=document.getElementById(OVERLAY_ID);
    if(!ov)return; // already removed by a successful load
    ov.style.gap='8px';
    while(ov.firstChild)ov.removeChild(ov.firstChild);
    var errIcon=document.createElement('div');
    errIcon.style.cssText='width:22px;height:22px;border-radius:50%;background:#fef2f2;border:2px solid #e53e3e;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#e53e3e;line-height:1';
    errIcon.textContent='!';
    var errTitle=document.createElement('span');
    errTitle.style.cssText='font-weight:600;color:#e53e3e';
    errTitle.textContent='Failed to load';
    var errHint=document.createElement('span');
    errHint.style.cssText='font-size:11px;color:#999;text-align:center;max-width:300px;padding:0 24px';
    errHint.textContent='The sandbox may be blocked by mixed content (HTTP vs HTTPS), X-Frame-Options, or a network issue. Try re-dragging the bookmarklet from the deployed site.';
    ov.appendChild(errIcon);
    ov.appendChild(errTitle);
    ov.appendChild(errHint);
  },8000);

  // Sidebar iframe
  frame=document.createElement('iframe');
  frame.id=FRAME_ID;
  frame.src=src;
  frame.style.cssText='position:fixed;top:0;right:0;width:'+WIDTH+';height:100vh;border:none;z-index:2147483644;box-shadow:-4px 0 24px rgba(0,0,0,0.18)';
  document.body.appendChild(frame);

  // Persistent toggle tab: ▶ = sidebar visible (click to close), ◀ = hidden (click to open)
  tab=document.createElement('button');
  tab.id=TAB_ID;
  tab.title='Toggle Kong Design Token Sandbox';
  tab.textContent='\\u25B6';
  tab.style.cssText='position:fixed;top:16px;right:'+WIDTH+';z-index:2147483647;background:#0044f4;color:#fff;border:none;border-radius:4px 0 0 4px;width:20px;padding:12px 0;cursor:pointer;font-size:11px;box-shadow:-2px 0 8px rgba(0,0,0,0.15)';
  tab.onclick=function(){
    var open=frame.style.display!=='none';
    frame.style.display=open?'none':'block';
    tab.style.right=open?'0':WIDTH;
    tab.textContent=open?'\\u25C0':'\\u25B6'; // ◀ = click to show; ▶ = click to hide
    var ov=document.getElementById(OVERLAY_ID);if(ov)ov.style.display=open?'none':'flex';
  };
  document.body.appendChild(tab);
})()`
