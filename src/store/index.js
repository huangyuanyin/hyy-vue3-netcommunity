let modules = {}
const files = require.context('./modules', false, /\.js$/)
files.keys().forEach(key => {
  const fileName = key.replace(/(\.\/|\.js)/g, '')
  modules[fileName] = files(key).default
})

import { createStore } from 'vuex'
import getters from './getters'
import exampleData from 'simple-mind-map/example/exampleData'
import { storeLocalConfig } from '@/api'
export default createStore({
  state: {
    mindMapData: null, // 思维导图数据
    isHandleLocalFile: false, // 是否操作的是本地文件
    localConfig: {
      // 本地配置
      isZenMode: false, // 是否是禅模式
      openNodeRichText: true // 是否开启节点富文本
    },
    activeSidebar: '', // 当前显示的侧边栏
    curTreeId: sessionStorage.getItem('curTreeId') || null, // 存放 高亮的节点ID
    defaultExpandIds: sessionStorage.getItem('defaultExpandIds') || [],
    curTreeName: sessionStorage.getItem('curTreeName')
  },
  mutations: {
    /**
     * @Author: 黄原寅
     * @Desc: 设置思维导图数据
     */
    setMindMapData(state, data) {
      state.mindMapData = data
    },
    /**
     * @Author: 黄原寅
     * @Desc: 设置操作本地文件标志位
     */
    setIsHandleLocalFile(state, data) {
      state.isHandleLocalFile = data
    },
    /**
     * @Author: 黄原寅
     * @Desc: 设置本地配置
     */
    setLocalConfig(state, data) {
      state.localConfig = {
        ...state.localConfig,
        ...data
      }
      storeLocalConfig(state.localConfig)
    },
    /**
     * @Author: 黄原寅
     * @Desc: 设置当前显示的侧边栏
     */
    setActiveSidebar(state, data) {
      state.activeSidebar = data
    },
    changeCurTreeId(state, data) {
      state.curTreeId = data
      sessionStorage.setItem('curTreeId', data)
      state.defaultExpandIds = []
      // 保存当前展开的节点
      state.defaultExpandIds.push(data)
      sessionStorage.setItem('defaultExpandIds', state.defaultExpandIds)
    },
    saveCurTreeName(state, data) {
      state.curTreeName = data
      sessionStorage.setItem('curTreeName', data)
    }
  },
  actions: {
    /**
     * @Author: 黄原寅
     * @Desc: 设置初始思维导图数据
     */
    getUserMindMapData(ctx) {
      try {
        let { data } = {
          data: {
            data: {
              mindMapData: exampleData
            }
          }
        }
        ctx.commit('setMindMapData', data.data)
      } catch (error) {
        console.log(error)
      }
    }
  },
  getters,
  modules
})
