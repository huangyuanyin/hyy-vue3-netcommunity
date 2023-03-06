import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import store from '@/store'
import { useRouter } from 'vue-router'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  // baseURL: 'http://10.4.150.27:8013',
  // baseURL: 'http://10.4.150.55:8013', // url = base url + request url 打包线上
  // baseURL: 'http://172.16.71.179:8013', // 华耀 打包线上
  timeout: 200000
})

service.interceptors.request.use(
  config => {
    // do something before request is sent
    let token = sessionStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = token
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
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 1000) {
      ElMessage({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
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
