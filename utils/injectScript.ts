export function injectXHRAndFetchInterceptor() {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('inject.js');
  script.onload = function (ev) {
    (ev.target as HTMLScriptElement).parentNode?.removeChild(
      ev.target as HTMLScriptElement
    );
  };
  (document.head || document.documentElement).appendChild(script);
}