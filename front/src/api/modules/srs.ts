import http from '@/api'
export const webRtcSrsPublishApi = (data: any) => {
  return http({
    baseURL: 'http://localhost:1985',
    url: `/rtc/v1/publish/`,
    method: 'post',
    data
  })
}
export const webRtcSrsPullApi = (data: any) => {
  return http({
    baseURL: 'http://localhost:1985',
    url: `/rtc/v1/play/`,
    method: 'post',
    data
  })
}
