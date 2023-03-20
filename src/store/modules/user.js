import jwtDecode from 'jwt-decode'

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
    token: ''
  },
  // 修改状态，且为同步
  mutations: {
    // 设置Token
    SET_TOKEN(state, data) {
      let decoded = jwtDecode(data)
      state.token = data
      localStorage.setItem('token', state.token)
      sessionStorage.setItem('nickname', decoded.nickname || '')
      sessionStorage.setItem('username', decoded.username || '')
      state.username = decoded.username || ''
      state.nickname = decoded.nickname || ''
      state.role = decoded.role || ''
    },
    clean_Toen(state) {
      localStorage.removeItem('token')
      sessionStorage.setItem('nickname', '')
      sessionStorage.setItem('username', '')
      sessionStorage.setItem('siderbar', '2')
      state.token = ''
      state.username = ''
      state.nickname = ''
      state.role = ''
    }
  },
  actions: {},
  modules: {}
}
