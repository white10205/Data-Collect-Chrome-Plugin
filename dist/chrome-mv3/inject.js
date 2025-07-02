// public/inject.js
(function () {
  const TARGET_URL = 'api/sns/web/v1/search/notes';
  const NOTE_DETAIL_URL = 'api/sns/web/v1/feed'
  function sendToContentScript(data) {
    window.postMessage(
      {
        source: 'inject-xhs',
        payload: data,
      },
      '*'
    );
  }

  // 拦截 XMLHttpRequest
  const origOpen = XMLHttpRequest.prototype.open;
  const origSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (method, url, ...args) {
    this._url = url;
    this._method = method;
    return origOpen.call(this, method, url, ...args);
  };
  XMLHttpRequest.prototype.send = function (...args) {
    this.addEventListener('load', function () {
      try {
        if (this._url && this._url.includes(TARGET_URL)) {
          let json = null;
          try {
            json = JSON.parse(this.response);
          } catch (e) {}
          sendToContentScript({
            type: 'XHS_NOTE_RESULT',
            method: this._method,
            url: this._url,
            data: json,
          });
        }
        if (this._url && this._url.includes(NOTE_DETAIL_URL)) {
          let json = null;
          try {
            json = JSON.parse(this.response);
          } catch (e) {}
          sendToContentScript({
            type: 'XHS_NOTE_RESULT',
            method: this._method,
            url: this._url,
            data: json,
          });
          console.log('@@@@@');
          
        }
      } catch (e) {}
    });
    return origSend.apply(this, args);
  };

  // 拦截 fetch
  const origFetch = window.fetch;
  window.fetch = function (input, init, ...args) {
    let url = typeof input === 'string' ? input : input.url;
    let method = (init && init.method) || 'GET';
    return origFetch.call(this, input, init, ...args).then(async (res) => {
      try {
        if (url && url.includes(TARGET_URL)) {
          const clone = res.clone();
          let json = null;
          try {
            json = await clone.json();
          } catch (e) {}
          sendToContentScript({
            type: 'XHS_NOTE_RESULT',
            method,
            url,
            data: json,
          });
        }
        if (this._url && this._url.includes(NOTE_DETAIL_URL)) {
          let json = null;
          try {
            json = JSON.parse(this.response);
          } catch (e) {}
          sendToContentScript({
            type: 'XHS_NOTE_RESULT',
            method: this._method,
            url: this._url,
            data: json,
          });
          
        }
      } catch (e) {}
      return res;
    });
  };
})();
