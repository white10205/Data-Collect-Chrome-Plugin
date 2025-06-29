<template>
  <div class="container">
    <Header />
    <ToolList />
  </div>
</template>

<script lang="ts" setup>
import Header from "@/components/Header.vue";
import ToolList from "@/components/ToolList.vue";
</script>

<style scoped>

.container {
  box-sizing: border-box;
  height: 250px;
  width: 250px;
}
</style>
