<template>
  <div>
    <el-input v-model="username"></el-input>
    <el-input v-model="password"></el-input>
    <el-button @click="login">登录</el-button>
  </div>
</template>

<script setup lang="ts">
import { loginApi } from '@/api/modules/login'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
let redirectUrl = ref('')
onMounted(() => {
  redirectUrl.value = router.currentRoute.value.fullPath.split('?redirect=')[1]
})
let username = ref('')
let password = ref('')
const login = async () => {
  const { data } = await loginApi({
    username: username.value,
    password: password.value
  })
  localStorage.setItem('token', data.token)
  router.replace(redirectUrl.value)
}
</script>

<style scoped lang="scss"></style>
