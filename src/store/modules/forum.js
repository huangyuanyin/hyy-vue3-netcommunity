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
    // 标签页名称
    tag: '',
  },
  // 修改状态，且为同步
  mutations: {
    // 设置标签页名称
    SET_TAG(state, data) {
      state.tag = data;
    }
  },
  actions: {
  },
  modules: {
  }
}
