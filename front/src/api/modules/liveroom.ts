import http from '@/api'
import { type LiveRoom } from '@/api/interface/liveroom'
export const createLiveRoomApi = (data: LiveRoom.createLiveRoomForm) => {
  return http({
    url: `/liveroom/add`,
    method: 'post',
    data
  })
}
export const getLiveRoomDetailApi = (id: string) => {
  return http({
    url: `/liveroom/detail/${id}`,
    method: 'get'
  })
}
export const getMyLiveRoomApi = (id = 1) => {
  return http({
    url: `/liveroom/my/${id}`,
    method: 'get'
  })
}
export const getLiveStatusApi = (id: string) => {
  return http({
    url: `/liveroom/status/${id}`,
    method: 'get'
  })
}
