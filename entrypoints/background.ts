import { extractNotes } from '@/utils/extraKeyWord';
import { exportToExcel } from '@/utils/exportToExcel';
export default defineBackground(() => {
  let data: any = [];

  browser.runtime.onMessage.addListener(async (message) => {
    if (message.type === 'XHS_NOTE_RESULT') {
      const result = message.data;

      const exportData = extractNotes(result.data.data.items);

      data = [...data, ...exportData];

      await browser.storage.local.set({ xhsNotes: data });

      console.log('当前收集到的数据', data, data.length);
    }
    if (message.type === 'EXPORT_RESULT') {
      if (data.length === 0) return;
      exportToExcel(data, `小红书笔记${Date.now()}.xlsx`);
      clear();
    }
    if (message.type === 'CLEAR_RESULT') {
      clear();
    }
  });

  async function clear() {
    data = [];
    await browser.storage.local.set({ xhsNotes: [] });
  }

  console.log('Background script loaded');
});
