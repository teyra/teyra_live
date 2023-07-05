/**
 * 直播间模块
 */
export namespace LiveRoom {
  export interface updateLiveRoomTitleForm {
    title: string
  }
  export interface LiveroomMessageForm {
    text: string
    roomId: string
    user: string
  }
  export enum MESSAGE_TYPE {
    DANMU = 1, //弹幕
    NOTICE = 2, //系统通知
    WELCOME = 3 //欢迎语
  }
  export interface LiveroomMessageResult {
    text: string
    username?: string
    userId?: string
    role?: number
    type: MESSAGE_TYPE
  }
  export interface MaterialItem {
    name: string
  }
  export enum ROLE_TYPE {
    VISITOR = 1, //游客
    FANS = 2, //粉丝
    MANAGER = 3, //管理员
    HOST = 4 //房主
  }
  export interface UserRoleListResult {
    user: string
    role: ROLE_TYPE
  }
  export interface BarrageTrack {
    offset: number
    disabled: boolean
  }
  export enum BarrageStatusEnum {
    INIT = 'init',
    ACTIVE = 'active',
    END = 'end'
  }
  export interface BarrageItem {
    text: string
    status: BarrageStatusEnum
    offsetHeight: number
  }
}
