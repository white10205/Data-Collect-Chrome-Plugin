import * as XLSX from 'xlsx';

export function exportToExcel(
  data: any[],
  filename: string = '小红书笔记列表.xlsx'
): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      // 1. 转换数据
      const formattedData = data.map((item) => ({
        标题: item.title,
        作者: item.nickname,
        点赞数: item.liked_count,
        收藏数: item.collected_count,
        评论数: item.comment_count,
        分享数: item.shared_count,
        发布时间: item.publish_time,
        笔记链接: item.noteLink,
        博主链接: item.homeLink,
      }));

      // 2. 创建工作簿
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      XLSX.utils.book_append_sheet(workbook, worksheet, '小红书笔记');

      // 3. 生成Excel二进制数据
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });

      // 4. 将ArrayBuffer转换为Uint8Array
      const uint8Array = new Uint8Array(excelBuffer);

      // 5. 使用chrome.downloads.download的另一种方式
      chrome.downloads.download(
        {
          url: `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${arrayBufferToBase64(
            uint8Array
          )}`,
          filename: filename,
          saveAs: true,
        },
        (downloadId) => {
          resolve(downloadId !== undefined);
        }
      );
    } catch (error) {
      console.error('导出Excel失败:', error);
      resolve(false);
    }
  });
}

// 辅助函数：将ArrayBuffer转换为Base64
function arrayBufferToBase64(buffer: Uint8Array): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
