import http from '@/api'
export const loginApi = (data: any) => {
  return http({
    url: `/login`,
    method: 'post',
    data
  })
}
