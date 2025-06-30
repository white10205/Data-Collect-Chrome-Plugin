export default defineContentScript({
  matches: ['*://*.xiaohongshu.com/*'],
  main() {
    const result: any[] = [];

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

    async function processItems(items: any) {
      for (let item of items) {
        const title = item.querySelector('.title')?.textContent?.trim();
        const nickName = item.querySelector('.name')?.textContent?.trim();
        const noteLink = item.querySelector('.cover')?.href;
        if (noteLink) {
          const detailContent = await getNoteContentViaIframe(noteLink);
          result.push({
            title,
            nickName,
            noteLink,
            ...detailContent,
          });
        }
      }
      console.log('处理完成', result);
    }

    function getNoteContentViaIframe(url: string): Promise<object | null> {
      return new Promise((resolve) => {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.addEventListener('load', () => {
          const iframeDoc = iframe.contentDocument;
          if (iframeDoc?.URL.includes('login')) {
            // 触发二次加载
            iframe.srcdoc = `<script>location.href="${url}"</script>`;
          }
        });
        document.body.appendChild(iframe);

        // 设置超时防止无限等待
        const timeout = setTimeout(() => {
          cleanup();
          resolve(null);
        }, 10000); // 10秒超时

        const cleanup = () => {
          clearTimeout(timeout);
          document.body.removeChild(iframe);
        };

        // 监听iframe加载完成
        iframe.onload = function () {
          try {
            // 尝试访问iframe内容
            const iframeDoc =
              iframe.contentDocument || iframe.contentWindow?.document;
            if (!iframeDoc) {
              cleanup();
              return resolve(null);
            }

            // 尝试获取笔记内容
            const content = extractNoteContent(iframeDoc);
            cleanup();
            resolve(content);
          } catch (e) {
            console.log('iframe内容访问受限:', e);
            cleanup();
            resolve(null);
          }
        };

        iframe.src = url;
      });
    }

    function extractNoteContent(doc: Document): any {
      try {

        const likeCount = doc
          .querySelector('.like-wrapper')
          ?.querySelector('.count')
          ?.textContent?.trim();
        const collectCount = doc
          .querySelector('.collect-wrapper')
          ?.querySelector('.count')
          ?.textContent?.trim();
        const commentCount = doc
          .querySelector('.chat-wrapper')
          ?.querySelector('.count')
          ?.textContent?.trim();

        // console.log('-----', likeCount, collectCount, commentCount);
        return {
          likeCount: likeCount === '点赞' ? 0 : likeCount,
          collectCount: collectCount === '收藏' ? 0 : collectCount,
          commentCount: commentCount === '评论' ? 0 : commentCount,
        };
      } catch (e) {
        console.error('解析内容失败:', e);
        return null;
      }
    }

    console.log('脚本加载完毕');
  },
});
