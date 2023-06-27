<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
onMounted(() => {
  document.body.style.setProperty('--el-color-primary', '#FF6699')
  document.body.style.setProperty('--el-color-primary-light-3', '#FF6699')
  document.body.style.setProperty('--el-color-primary-light-4', '#FF6699')
  document.body.style.setProperty('--el-color-primary-light-5', '#FF6699')
  document.body.style.setProperty('--el-color-primary-light-6', '#FF6699')
  document.body.style.setProperty('--el-color-primary-light-7', '#FF6699')
  document.body.style.setProperty('--el-color-primary-light-8', '#FFFFFF')
  document.body.style.setProperty('--el-color-primary-light-9', '#FFFFFF')
  document.body.style.setProperty('--el-border-radius-small', '10px')
})
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
