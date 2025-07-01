import { injectXHRAndFetchInterceptor } from '@/utils/injectScript';
import { showBtn } from '@/utils/showBtn';
export default defineContentScript({
  matches: ['*://*.xiaohongshu.com/*'],
  main() {
    injectXHRAndFetchInterceptor();

    showBtn();

    window.addEventListener('message', (event) => {
      if (
        event.source === window &&
        event.data &&
        event.data.source === 'inject-xhs'
      ) {
        // 发送到 background
        browser.runtime.sendMessage({
          type: 'XHS_NOTE_RESULT',
          data: event.data.payload,
        });
      }
    });


    
  },
});
