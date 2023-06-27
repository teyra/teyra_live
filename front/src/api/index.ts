import { HttpCodeEnum } from '@/enums/httpCode'
import axios from 'axios'

import { ElMessage } from 'element-plus'
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 1000
})
// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    if (config.baseURL === import.meta.env.VITE_API_URL) {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.authorization = `Bearer ${token}`
      }
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    return response.data
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    if (error.response.data.code === HttpCodeEnum.OVERDUE) {
      localStorage.clear()
      // const path = '/login?redirect=' + window.location.pathname
      // return router.replace(path)
    }
    ElMessage.error(error.response.data.message)
    return Promise.reject(error)
  }
)
export default instance
