<template>
  <div class="header-container" v-if="!centerDialogVisible">
    <div class="username">{{ userStore.userInfoGet }}</div>
    <div class="right">
      <el-button @click="webWatch" type="primary">web端观看</el-button>
      <el-button @click="mobileScanWatch" type="primary">手机扫码观看</el-button>
      <el-dropdown trigger="click">
        <div class="avatar">
          <img src="@/assets/image/avatar.jpg" class="round-50 avatar" alt="" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout" divided>
              <el-icon :size="20">
                <i-ep-SwitchButton />
              </el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  <van-dialog v-model:show="mobileCenterDialogVisible" :showConfirmButton="false">
    <div style="padding: 2rem 1rem 1rem 1rem">
      <van-form @submit="login">
        <van-cell-group inset>
          <van-field v-model="form.username" name="账号" label="账号" placeholder="请输入账号" />
          <van-field
            v-model="form.password"
            type="password"
            name="密码"
            label="密码"
            placeholder="请输入密码"
          />
        </van-cell-group>
        <div style="padding-top: 2rem; display: flex; justify-content: center">
          <van-button
            round
            block
            native-type="submit"
            size="small"
            :color="systemStore.themeConfig.primary"
            style="width: 50%"
          >
            登录
          </van-button>
        </div>
      </van-form>
    </div>
  </van-dialog>
  <el-dialog v-model="codeVisible" :show-close="false" width="30%" center append-to-body>
    <div class="code-container">
      <canvas ref="canvasRef"></canvas>
    </div>
  </el-dialog>
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
          <img
            src="@/assets/image/login1.png"
            width="100"
            height="100"
            style="border-radius: 10px"
            alt=""
          />
          <el-button @click="login" type="primary">登录</el-button>
          <img
            src="@/assets/image/login2.png"
            width="100"
            height="100"
            style="border-radius: 10px"
            alt=""
          />
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import QRcode from 'qrcode'
import { getMyLiveRoomApi } from '@/api/modules/liveroom'
import { loginApi } from '@/api/modules/login'
import { UserStore } from '@/stores/modules/user'
import { SystemStore } from '@/stores/modules/system'
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { PlatFormEnum } from '@/enums/system'
const userStore = UserStore()
const systemStore = SystemStore()
let form = reactive({
  username: '',
  password: ''
})
let userInfo = reactive({
  username: ''
})
let mobileCenterDialogVisible = ref(false)
let centerDialogVisible = ref(false)
let codeVisible = ref(false)
let canvasRef = ref<HTMLCanvasElement>()
onMounted(() => {
  console.log(userStore.userInfoGet)
  if (systemStore.platForm === PlatFormEnum.PC) {
  }
  if (systemStore.platForm === PlatFormEnum.MOBILE) {
  }
})
const token = computed(() => {
  return localStorage.getItem('token')
})
watch(
  token,
  (val) => {
    if (!val) {
      nextTick(() => {
        if (systemStore.platForm === PlatFormEnum.PC) {
          centerDialogVisible.value = true
        }
        if (systemStore.platForm === PlatFormEnum.MOBILE) {
          mobileCenterDialogVisible.value = true
        }
      })
    }
  },
  {
    deep: true,
    immediate: true
  }
)
const login = async () => {
  const { data } = await loginApi({
    username: form.username,
    password: form.password
  })
  localStorage.setItem('token', data.token)
  centerDialogVisible.value = false
  mobileCenterDialogVisible.value = false
  await userStore.getUserInfo()
  form.username = ''
  form.password = ''
}
const logout = async () => {
  await userStore.logout()
  centerDialogVisible.value = true
}
const webWatch = async () => {
  const { data } = await getMyLiveRoomApi()
  window.open('/live-pull?id=' + data._id)
}
const mobileScanWatch = async () => {
  codeVisible.value = true
  const { data } = await getMyLiveRoomApi()
  nextTick(() => {
    const url = import.meta.env.VITE_MOBILE_URL + '/mobile/live-pull' + data._id
    QRcode.toCanvas(canvasRef.value, url, {
      width: 200
    })
  })
}
</script>
<style lang="scss">
.el-dialog--center .el-dialog__footer {
  padding: unset;
}
</style>
<style scoped lang="scss">
.header-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .username {
    font-size: 20px;
    font-weight: 500;
    color: #ffffff;
    margin-right: 10px;
  }
  .right {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .avatar {
      width: 40px;
      height: 40px;
      margin-left: 10px;
      cursor: pointer;
    }
  }
}

.code-container {
  text-align: center;
}
</style>
