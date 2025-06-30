<template>
  <div class="tool-list">
    <div class="tool-item" v-for="tool in toolList" :key="tool.name">
      <span class="tool-name">{{ tool.name }}</span>
      <!-- <van-switch v-model="tool.isOpen" size="20px" @click="handleSwitch(tool)" /> -->
      <img class="btn" src="@/assets/start-btn.svg" alt="" @click="startCollection">
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const toolList = ref([
  {
    type: 'keyword_note_collection',
    name: '搜索关键词笔记采集',
    isOpen: false,
  },
]);

const startCollection = (type) => {
  browser.runtime.sendMessage({
    type,
  });
};
</script>

<style scoped>
.tool-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 5px;
}

.tool-item {
  background-color: #f0eded;
  border-radius: 5px;
  height: 50px;
  font-size: 12px;
  line-height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  box-sizing: border-box;
  font-weight: 600;
}

.btn {
  cursor: pointer;
}
.btn:active {
  transform: scale(0.9);
}
</style>
