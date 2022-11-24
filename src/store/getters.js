/*
 * @Author: maxf
 * @Date: 2022-01-11 17:46:31
 * @LastEditTime: 2022-01-25 23:31:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue3-netforum\src\store\getters.js
 */
export default {
  collapse: state => state.app.collapse,
  siderbar: state => state.app.siderbar,
  token: state => state.user.token,
  username: state => state.user.username,
  nickname: state => state.user.nickname,
  role: state => state.user.role,
  spaces: state => state.app.spaces,
  tag: state => state.forum.tag,
  node: state => state.books.node
}
