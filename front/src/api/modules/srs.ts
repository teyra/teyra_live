import http from '@/api'
export const webRtcSrsPublishApi = (data: any) => {
  return http({
    baseURL: import.meta.env.VITE_HTTPS_API_URL,
    url: `/rtc/v1/publish/`,
    method: 'post',
    data
  })
}
export const webRtcSrsPullApi = (data: any) => {
  return http({
    baseURL: import.meta.env.VITE_HTTPS_API_URL,
    url: `/rtc/v1/play/`,
    method: 'post',
    data
  })
}
