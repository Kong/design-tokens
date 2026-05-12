/**
 * Template for the bookmarklet. `__CUSTOMIZER_URL__` is replaced at runtime in
 * `CustPreviewPanel.vue` with the absolute URL of the customizer in embedded mode,
 * derived from the deployment's own origin so it works in both dev and on GitHub Pages.
 *
 * When the designer clicks this on any target page it:
 *  1. Injects `<style id="kong-design-token-overrides">` into the page
 *  2. Shows a loading overlay, then injects a 560px fixed sidebar `<iframe>` pointing
 *     to the customizer (`/#/customize?embedded=1`). The loading overlay is removed on
 *     first CSS message; times out to an error state after 8 s.
 *  3. Persists the last-used customizer URL (with encoded overrides) in sessionStorage
 *     keyed by the target page's hostname, so re-clicking after navigation restores state.
 *  4. Re-clicking the bookmarklet toggles the sidebar. A `▶` / `◀` tab stays visible
 *     at the right edge so the user can always restore it.
 */
export const BOOKMARKLET_TEMPLATE = `(()=>{
  var STYLE_ID='kong-design-token-overrides';
  var FRAME_ID='kong-customizer-sidebar';
  var OVERLAY_ID='kong-customizer-overlay';
  var TAB_ID='kong-customizer-tab';
  var STORAGE_KEY='kong-customizer-url:'+location.hostname;
  var WIDTH='560px';

  // Ensure the override style tag exists
  if(!document.getElementById(STYLE_ID)){
    var s=document.createElement('style');
    s.id=STYLE_ID;
    document.head.appendChild(s);
  }

  // Register message listener only once (guard against bookmarklet re-clicks)
  if(!window.__kongCustListener){
    window.__kongCustListener=true;
    window.addEventListener('message',function(e){
      if(!e.data)return;
      if(e.data.type==='kui-token-override'){
        var el=document.getElementById(STYLE_ID);
        if(el)el.textContent=e.data.css||'';
        if(e.data.src)try{sessionStorage.setItem(STORAGE_KEY,e.data.src);}catch(x){}
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
  var src='__CUSTOMIZER_URL__';
  try{var saved=sessionStorage.getItem(STORAGE_KEY);if(saved)src=saved;}catch(x){}

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
  loadMsg.textContent='Loading token customizer…';
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
    errHint.textContent='The customizer may be blocked by mixed content (HTTP vs HTTPS), X-Frame-Options, or a network issue. Try re-dragging the bookmarklet from the deployed site.';
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
  tab.title='Toggle Kong Design Token Customizer';
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
