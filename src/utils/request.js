/*
 * @Description: 请求封装
 * @Author: maxf
 * @Date: 2021-12-05 11:41:32
 * @LastEditors: maxf
 * @LastEditTime: 2022-03-15 11:41:32
 * @FilePath: \vue3-netforum\src\utils\request.js
 */
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
import store from "@/store";
import { useRouter } from "vue-router";

// create an axios instance
const service = axios.create({
  // baseURL: 'http://172.16.71.179:8013',  sessionStorage.setItem("COMMUNITY_URL", res.data.FORM_URL)
  baseURL: sessionStorage.getItem('COMMUNITY_URL'),
  // baseURL: axios.defaults.baseURL,
  // baseURL: "http://10.20.86.27:8013",
  // baseURL: 'http://10.20.84.55:8013', // url = base url + request url 打包线上
  // baseURL: 'http://172.16.71.179:8013', // 华耀 打包线上
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
});
console.log("axios", axios.defaults.baseURL);
// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent
    let token = sessionStorage.getItem("token");
    if (token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers["Authorization"] = token;
    }
    return config;
  },
  (error) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);
const router = useRouter();
// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const res = response.data;

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 1000) {
      ElMessage({
        message: res.msg || "Error",
        type: "error",
        duration: 5 * 1000,
      });

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        ElMessageBox.confirm(
          "You have been logged out, you can cancel to stay on this page, or log in again",
          "Confirm logout",
          {
            confirmButtonText: "Re-Login",
            cancelButtonText: "Cancel",
            type: "warning",
          }
        ).then(() => {
          store.commit("app/clean_Toen");
          router.push("/login");
        });
      }
      return Promise.reject(new Error(res.msg || "Error"));
    } else {
      return res;
    }
  },
  (error) => {
    console.log("err" + error); // for debug
    ElMessage({
      message: error.message,
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

export default service;
