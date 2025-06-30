export default defineBackground(() => {
  const data = [];
  browser.webRequest.onCompleted.addListener(
    (details) => {
      if (details.url.includes('/api/sns/web/v1/search/notes')) {
        chrome.tabs.sendMessage(details.tabId, {
          type: 'INTERCEPT_RED_API',
          url: details.url,
        });
      }
    },
    { urls: ['https://*.xiaohongshu.com/*'] }
  );

  // background.ts
  browser.runtime.onMessage.addListener((message) => {
    if (message.type === '') {
      console.log('小红书接口数据:', message.data);
      // 存储或处理数据...
    }
  });
  console.log('Background script loaded1111');
});
