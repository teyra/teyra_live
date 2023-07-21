import { DEFAULT_PRIMARY } from '@/config/theme'
import { PlatFormEnum } from '@/enums/system'
import { defineStore } from 'pinia'
export const SystemStore = defineStore({
  id: 'SystemState',
  state: () => ({
    platForm: PlatFormEnum.PC,
    themeConfig: {
      primary: DEFAULT_PRIMARY
    }
  }),
  actions: {
    getPlatForm() {
      if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        this.platForm = PlatFormEnum.MOBILE
        console.log('sdad')
      } else {
        this.platForm = PlatFormEnum.PC
        console.log('sdad111')
      }
    }
  }
})
