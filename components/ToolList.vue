<template>
  <div class="tool-list">
    <div class="tool-item" v-for="tool in toolList" :key="tool.name">
      <span class="tool-name">{{ tool.name }}</span>
      <img class="btn" src="@/assets/start-btn.svg" alt="">
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const toolList = ref([
  { name: "搜索关键词笔记采集", description: "自动采集小红书的内容" },
  { name: "小红书自动发布", description: "自动发布小红书的内容" },
  { name: "小红书自动评论", description: "自动评论小红书的内容" },
]);
const feature = ref();
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
  padding: 0 10px;
  box-sizing: border-box;
  font-weight: 600;
}

.btn{
  cursor: pointer;
}
.btn:active{
  transform: scale(0.9);
}
</style>
