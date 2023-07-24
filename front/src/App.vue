<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { SystemStore } from '@/stores/modules/system'
import Header from '@/components/Header.vue'
const systemStore = SystemStore()
onMounted(() => {
  systemStore.getPlatForm()
  const primary = systemStore.themeConfig.primary
  document.body.style.setProperty('--el-color-primary', primary)
  document.body.style.setProperty('--el-color-primary-light-3', primary)
  document.body.style.setProperty('--el-color-primary-light-4', primary)
  document.body.style.setProperty('--el-color-primary-light-5', primary)
  document.body.style.setProperty('--el-color-primary-light-6', primary)
  document.body.style.setProperty('--el-color-primary-light-7', primary)
  document.body.style.setProperty('--el-color-primary-light-8', '#FFFFFF')
  document.body.style.setProperty('--el-color-primary-light-9', '#FFFFFF')
  document.body.style.setProperty('--el-border-radius-small', '10px')
})
</script>

<template>
  <Header></Header>
  <RouterView />
</template>

<style scoped></style>
