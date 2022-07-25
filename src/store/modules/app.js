/*
 * @Author: maxf
 * @Date: 2022-01-11 17:30:30
 * @LastEditTime: 2022-01-25 23:36:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue3-netforum\src\store\modules\app.js
 */

export default {
  namespaced: true,
  state: {
    // 存储状态
    // 折叠栏
    collapse: false,
    // 侧边栏
    siderbar: false,
    // spaces数据
    spaces: {}
  },
  // 修改状态，且为同步
  mutations: {
    // 折叠栏状态改变
    handleCollapse(state, data) {
      state.collapse = data
    },
    // 侧边栏展示样式
    handleSiderbar(state, data) {
      state.siderbar = data
    },
    // 设置工作空间数据
    SET_SPACES(state, data) {
      state.spaces = data
    }
  },
  actions: {
  },
  modules: {
  }
}
