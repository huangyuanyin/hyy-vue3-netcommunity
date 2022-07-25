/*
 * @Author: maxf
 * @Date: 2022-01-11 17:30:30
 * @LastEditTime: 2022-01-25 23:36:41
 * @LastEditors: Please set LastEditors
 * @Description: 用户信息
 * @FilePath: \vue3-netforum\src\store\modules\user.js
 */

import jwtDecode from "jwt-decode";

export default {
  namespaced: true,
  state: {
    // 用户名
    username: '',
    // 用户昵称
    nickname: '',
    // 用户角色
    role: '',
    // token
    token: '',
  },
  // 修改状态，且为同步
  mutations: {
    // 设置Token
    SET_TOKEN(state, data) {
      let decoded = jwtDecode(data)
      state.token = data;
      sessionStorage.setItem("token", state.token)
      sessionStorage.setItem("nickname", decoded.nickname || '')
      sessionStorage.setItem("username", decoded.username || '')
      state.username = decoded.username || ''
      state.nickname = decoded.nickname || ''
      state.role = decoded.role || ''
    },
    clean_Toen(state) {
      sessionStorage.setItem('token', '')
      sessionStorage.setItem('nickname', '')
      sessionStorage.setItem('username', '')
      state.token = ''
      state.username = ''
      state.nickname = ''
      state.role = ''
    }
  },
  actions: {
  },
  modules: {
  }
}
