import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import store from '@/store'
import { useRouter } from 'vue-router'

const service = axios.create({
  // baseURL: 'http://10.4.150.27:8013',
  // baseURL: 'http://10.4.150.55:8013', // url = base url + request url 打包线上
  // baseURL: 'http://172.16.71.179:8013', // 华耀 打包线上
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: 200000
})

service.interceptors.request.use(
  config => {
    let token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = token
    }
    switch (config.urlType) {
      case 'NetDevOps':
        config.url = process.env.VUE_APP_DRAWER_URL + config.url
        break
      case 'NEWBASE':
        config.url = process.env.VUE_APP_NEWBASE_URL + config.url
        break
      case 'BASEUSER':
        config.url = process.env.VUE_APP_USER_URL + config.url
        break
      case 'LOGIN':
        config.url = process.env.VUE_APP_LOGIN_URL + config.url
        break
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

const router = useRouter()

service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 1000) {
      ElMessage({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        ElMessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.commit('app/clean_Toen')
          router.push('/login')
        })
      }
      // return Promise.reject(new Error(res.msg || "Error"));
    } else {
      return res
    }
  },
  error => {
    ElMessage({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    // return Promise.reject(error);
  }
)

export default service
