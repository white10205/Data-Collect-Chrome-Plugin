import { injectXHRAndFetchInterceptor } from '@/utils/injectScript';
import { showBtn } from '@/utils/showBtn';
import xhs from "@/entrypoints/xhs";
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    tabId: number;
  }
}
export default defineContentScript({
  matches: ['*://*.xiaohongshu.com/*'],
  async main() {
    //注入脚本
    injectXHRAndFetchInterceptor();

    // 展示按钮
    showBtn();

    let [tab] = await browser.tabs.query({
      active: true,
      url: `*://${new URL('https://www.xiaohongshu.com').hostname}/*`,
    });
    if (!tab) {
      tab = await new Promise(async (resolve) => {
        tab = await browser.tabs.create({ url: 'https://www.xiaohongshu.com' });
        const check = async () => {
          tab = await browser.tabs.get(tab.id!);
          if (tab.status === 'complete') {
            resolve(tab);
          } else {
            setTimeout(check, 500);
          }
        };
        check();
      });
    }

    const data = {
      source_note_id: '68464b91000000002002ab97',
      image_formats: ['jpg', 'webp', 'avif'],
      extra: {
        need_body_topic: '1',
      },
      xsec_source: 'pc_feed',
      xsec_token: 'ABacGEnAFYR2ZWgzS5_JkrNWTr2nP6SbqfToN47F8GJts=',
    };

    const res = await xhs({
      tabId: tab.id,
      ...data,
    })
    console.log(res);
    
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
