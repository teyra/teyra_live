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
    url: `/liveroom/${id}`,
    method: 'get'
  })
}
export const getLiveStatusApi = (id: string) => {
  return http({
    url: `/liveroom/status/${id}`,
    method: 'get'
  })
}
