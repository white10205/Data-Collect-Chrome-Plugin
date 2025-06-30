export default defineBackground(() => {
  const data = [];
  const baseURL = 'https://edith.xiaohongshu.com/api/sns/web/v1/feed'
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
  browser.runtime.onMessage.addListener(async (message) => {
    if (message.type === 'NOTE_DETAILS') {
      const { noteLink } = message.data;
      const id = noteLink.split('?')[0].split('/')[4];
      const token = noteLink.split('?')[1];
      const params = {
        source_note_id: id,
        image_formats: ['jpg', 'webp', 'avif'],
        extra: {
          need_body_topic: '1',
        },
        xsec_source: 'pc_feed',
        xsec_token: token,
      };
      console.log('构造的参数', params);
    }
  });
  console.log('Background script loaded1111');
});
