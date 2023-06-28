import http from '@/api'
import { type LiveRoom } from '@/api/interface/liveroom'
/**
 *获取直播间详情
 */
export const getLiveRoomDetailApi = (id: string) => {
  return http({
    url: `/liveroom/${id}`,
    method: 'get'
  })
}
/**
 *获取自己直播间
 */
export const getMyLiveRoomApi = (id = 1) => {
  return http({
    url: '/myLiveroom',
    method: 'get'
  })
}
/**
 * 获取直播间状态
 */
export const getLiveStatusApi = (id: string) => {
  return http({
    url: `/liveroom/status/${id}`,
    method: 'get'
  })
}
/**
 * 修改直播间标题
 */
export const updateLiveRoomTitleApi = (id: string, data: LiveRoom.updateLiveRoomTitleForm) => {
  return http({
    url: `/liveroom/updateTitle/${id}`,
    method: 'patch',
    data
  })
}
