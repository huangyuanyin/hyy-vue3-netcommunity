<template>
  <div class="container">
    <template v-if="show">
      <Toolbar v-if="!isZenMode"></Toolbar>
      <Edit></Edit>
    </template>
  </div>
</template>

<script>
import Toolbar from './components/Toolbar'
import Edit from './components/Edit'
import { mapState, mapActions, mapMutations } from 'vuex'
import { getLocalConfig } from '@/api'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { getForum, updateForum, getForumInfo } from '@/api/forum.js'
import bus from '@/utils/bus.js'

export default {
  name: 'Index',
  components: {
    Toolbar,
    Edit
  },
  data() {
    return {
      show: false,
      rawData: {}
    }
  },
  computed: {
    ...mapState({
      isZenMode: state => state.localConfig.isZenMode
    })
  },
  async created() {
    this.initLocalConfig()
    const loading = this.$loading({
      lock: true,
      text: '正在加载，请稍后...'
    })
    await this.getUserMindMapData()
    this.show = true
    loading.close()
    this.rawData = localStorage.getItem('SIMPLE_MIND_MAP_DATA')
    // 浏览器控制按钮前进后退触发函数
    // window.addEventListener('popstate', this.popstate, false)
    // window.addEventListener('beforeunload', this.beforeUnloadHandler, false)
  },
  // 销毁vm组件
  destroyed() {
    // 避免堆栈溢出，多次创建、多次触发
    // window.removeEventListener('popstate', this.popstate, false)
  },
  // 组件销毁时调用
  beforeDestroy() {
    // 避免堆栈溢出，多次创建、多次触发
    // window.removeEventListener('beforeunload', this.beforeUnloadHandler, false)
  },
  // watch: {
  //   $route: {
  //     handler(to, from) {
  //       if (to.name === 'mindMap' && from && from.name === 'mindMap') {
  //         // 获取思维导图数据
  //         getForumInfo(this.$route.query.mid).then(res => {
  //           setTimeout(() => {
  //             bus.emit('setData', JSON.parse(res.data.body));
  //             bus.emit("execCommand", ['UNEXPAND_TO_LEVEL', 1]) // 默认展开到第一层级
  //           }, 500)
  //         })
  //         console.log("to", to, from);
  //       }
  //     },
  //     immediate: true,//第一次就执行
  //   }
  // },
  // 路由守卫-离开之前

  beforeRouteLeave(to, from, next) {
    this.checkUnsavedContent(() => {
      next()
    })
  },
  methods: {
    ...mapActions(['getUserMindMapData']),
    ...mapMutations(['setLocalConfig']),
    /**
     * @Author: 黄原寅
     * @Desc: 初始化本地配置
     */
    initLocalConfig() {
      let config = getLocalConfig()
      if (config) {
        this.setLocalConfig({
          ...this.$store.state.localConfig,
          ...config
        })
      }
    },
    // popstate(data) {
    //   // console.log("data", data.state.back);
    //   // if (data.state.back === '/subbooks') {
    //   //   return false
    //   // }
    //   // const loadingInstance = ElLoading.service({
    //   //   lock: true,
    //   //   text: '正在加载文件，请稍后...',
    //   //   spinner: 'el-icon-loading',
    //   //   background: 'rgba(0, 0, 0, 0.7)'
    //   // })
    //   // // 获取思维导图数据
    //   // getForumInfo(this.$route.query.mid).then(res => {
    //   //   setTimeout(() => {
    //   //     bus.emit('setData', JSON.parse(res.data.body));
    //   //     bus.emit("execCommand", ['UNEXPAND_TO_LEVEL', 1]) // 默认展开到第一层级
    //   //   }, 500)
    //   //   loadingInstance.close()
    //   // })
    //   this.$router.push({ name: 'subbooks' })
    // },
    beforeUnloadHandler(e) {
      e.returnValue = '离开此页面？'
    },
    checkUnsavedContent(callback) {
      console.log('SIMPLE_MIND_MAP_DATA1', String(localStorage.getItem('SIMPLE_MIND_MAP_DATA')))
      console.log('SIMPLE_MIND_MAP_DATA2', String(this.rawData))
      if (String(localStorage.getItem('SIMPLE_MIND_MAP_DATA')) == String(this.rawData)) {
        callback()
        return
      } else {
        ElMessageBox.confirm('当前有未保存的内容，是否离开？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            callback()
            this.rawData = ''
          })
          .catch(() => {
            // callback()
          })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  padding: 0;
  position: relative;
}
</style>
