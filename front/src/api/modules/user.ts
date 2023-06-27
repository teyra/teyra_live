import http from '@/api'
export const getUserInfoApi = () => {
  return http({
    url: `/getUserInfo`,
    method: 'get'
  })
}
export const logoutApi = () => {
  return http({
    url: `/logout`,
    method: 'get'
  })
}
