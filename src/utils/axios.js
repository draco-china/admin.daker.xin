import axios from 'axios'
import { MessageBox, Notification } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers.Authorization = getToken()
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (!res.success) {
      Notification({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject('error')
    } else {
      // Notification.success({
      //   message: res.message,
      //   duration: 1000
      // })
      return response.data
    }
  }, error => {
    console.log(error)
    // token 不存在; token验证失败; Token 过期了;
    if (error.response.status === 401) {
      MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('FedLogOut').then(() => {
          location.reload()// 为了重新实例化vue-router对象 避免bug
        })
      })
    } else {
      console.log('err' + error)// for debug
      Notification({
        message: error.response.data.message || error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
