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
  export interface LiveroomMessageResult {
    text: string
    username: string
    roleName: string
  }
}
