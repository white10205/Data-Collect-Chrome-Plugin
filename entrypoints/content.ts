export default defineContentScript({
  matches: ['*://*.xiaohongshu.com/*'],
  main() {

    // 创建MutationObserver实例
    const observer = new MutationObserver((mutations) => {
      const isIframeAdded = mutations.some((mutation) =>
        Array.from(mutation.addedNodes).some(
          (node) => node.nodeName === 'IFRAME'
        )
      );

      if (isIframeAdded) return; // 忽略iframe添加导致的变动
      const noteItemArr = document.querySelectorAll('.note-item');
      if (noteItemArr.length > 0) {
        console.log('获取到的元素', noteItemArr);
        processItems(noteItemArr);
        observer.disconnect();
      }
    });

    // 开始观察document.body的子节点变化
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false,
    });

    function processItems(items: any) {
      for (let item of items) {
        const title = item.querySelector('.title')?.textContent?.trim();
        const nickName = item.querySelector('.name')?.textContent?.trim();
        const noteLink = item.querySelector('.cover')?.href;
        browser.runtime.sendMessage({
          type: 'NOTE_DETAILS',
          data: {
            title,
            nickName,
            noteLink,
          },
        });
      }
    }

    console.log('脚本加载完毕');
  },
});
