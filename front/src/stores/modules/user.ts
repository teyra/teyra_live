import { defineStore } from 'pinia'
import { getUserInfoApi, logoutApi } from '@/api/modules/user'

export const UserStore = defineStore({
  id: 'UserState',
  state: () => ({
    userInfo: {}
  }),
  getters: {
    userInfoGet: (state: any) => state.userInfo
  },
  actions: {
    async getUserInfo() {
      const { data } = await getUserInfoApi()
      this.userInfo = data
    },
    async logout() {
      await logoutApi()
      this.userInfo = {}
      localStorage.clear()
    }
  }
})
