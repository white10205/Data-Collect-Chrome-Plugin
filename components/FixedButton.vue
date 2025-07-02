<template>
  <div class="container">
    <div class="span">
      当前已收集 <span class="num">{{ totalNote }}</span> 条笔记
    </div>
    <div class="btn-container">
      <div class="export" @click="handleExport">导出</div>
      <div class="export" @click="handleClear">清除</div>
    </div>
    <div class="rank-list">
      <span class="title">爆款排行</span>
      <div class="rank-item" v-for="(item,index) in rank" :key="item.id">
        <span class="rank-num">{{ index + 1}}</span>
        <span class="text">{{ item.title }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
const totalNote = ref(0);
const xhsNotes = ref<any[]>([]);
const rank = computed(() => {
  return xhsNotes.value.sort((a: any, b: any) => b.liked_count - a.liked_count).slice(0,10);
});
// 更新数据条数
const handleStorageChange = (
  changes: Record<string, chrome.storage.StorageChange>
) => {
  if (changes.xhsNotes) {
    totalNote.value = changes.xhsNotes.newValue?.length || 0;
    xhsNotes.value = changes.xhsNotes.newValue;
  }
};

const handleClear = () => {
  browser.runtime.sendMessage({
    type: 'CLEAR_RESULT',
  });
};
// 处理导出
const handleExport = () => {
  browser.runtime.sendMessage({
    type: 'EXPORT_RESULT',
  });
};

onMounted(() => {
  chrome.storage.onChanged.addListener(handleStorageChange);
});
onUnmounted(() => {
  chrome.storage.onChanged.removeListener(handleStorageChange);
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
.num {
  color: red;
}
.span {
  font-size: 20px;
  background-color: #378ae9;
  padding: 20px;
  border-radius: 10px;
}
.export {
  font-size: 20px;
  border-radius: 10px;
  padding: 10px;
  background-color: red;
  text-align: center;
  color: white;
  cursor: pointer;
  user-select: none;
}
.export:active {
  transform: scale(0.85);
}

.btn-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 50px;
}
.rank-list{
  width: 200px;
  background-color: #fff;
  border-radius: 30%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
}
.rank-item{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
