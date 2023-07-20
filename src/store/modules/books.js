/*
 * @Author: maxf
 * @Date: 2022-01-11 17:30:30
 * @LastEditTime: 2022-01-25 23:36:41
 * @LastEditors: Please set LastEditors
 * @Description: 论坛
 * @FilePath: \vue3-netforum\src\store\modules\forum.js
 */

export default {
  namespaced: true,
  state: {
    // 存储状态
    // 节点数据
    node: {},
    isRefresh: false,
    docTitle: ''
  },
  // 修改状态，且为同步
  mutations: {
    // 设置节点数据
    SET_NODE_DATA(state, data) {
      state.node = data
    },
    // 设置是否刷新
    SET_REFRESH(state, data) {
      state.isRefresh = data
    },
    // 设置文档标题
    SET_DOC_TITLE(state, data) {
      state.docTitle = data
    }
  },
  actions: {},
  modules: {}
}
