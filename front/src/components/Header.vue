<template>
  <div class="header-container">
    <div class="username">{{ userInfo.username }}</div>
    <div>
      <el-button @click="createLiveRoom" type="primary">创建直播间</el-button>
      <el-button @click="startLive" type="primary">我要开播</el-button>
      <el-button @click="logout" type="info">退出登录</el-button>
    </div>
    <el-dialog
      v-model="centerDialogVisible"
      :close-on-click-modal="false"
      :show-close="false"
      width="30%"
      center
      append-to-body
    >
      <el-form label-position="top" label-width="100px" :model="form" style="max-width: 460px">
        <el-form-item label="账号">
          <el-input v-model="form.username" placeholder="请输入账号" size="large" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" placeholder="请输入密码" size="large" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div>
          <div style="display: flex; justify-content: space-between">
            <img src="@/assets/image/login1.png" width="100" height="100" alt="" />
            <img src="@/assets/image/login2.png" width="100" height="100" alt="" />
          </div>
          <el-button @click="login" type="primary">登录</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { createLiveRoomApi } from '@/api/modules/liveroom'
import { loginApi } from '@/api/modules/login'
import { UserStore } from '@/stores/modules/user'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
const userStore = UserStore()
const router = useRouter()
let form = reactive({
  username: '',
  password: ''
})
let userInfo = reactive({
  username: ''
})
let centerDialogVisible = ref(true)
onMounted(() => {
  userInfo.username = userStore.userInfoGet.username
})
const login = async () => {
  const { data } = await loginApi({
    username: form.username,
    password: form.password
  })
  localStorage.setItem('token', data.token)
}
const logout = async () => {
  await userStore.logout()
  userInfo.username = userStore.userInfoGet.username
  router.push('/login')
}
const startLive = async () => {
  window.open('/live-push')
}
const createLiveRoom = async () => {
  await createLiveRoomApi({
    name: 'teyra',
    description: '周末训练赛'
  })
}
</script>

<style scoped lang="scss">
.header-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: #bbc6a1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .username {
    font-size: 20px;
    font-weight: 500;
    color: #ffffff;
    margin-right: 10px;
  }
}
</style>
