<template>
  <div class="container">
    <template v-if="show">
      <Toolbar></Toolbar>
      <Edit></Edit>
    </template>
  </div>
</template>

<script>
import Toolbar from "./components/Toolbar";
import Edit from "./components/Edit";
import { mapState, mapActions } from "vuex";
import { ElMessage, ElMessageBox, ElLoading } from "element-plus";
import { getForum, updateForum, getForumInfo } from '@/api/forum.js'
import bus from "@/utils/bus.js"

export default {
  name: "Index",
  components: {
    Toolbar,
    Edit,
  },
  data() {
    return {
      show: false,
    };
  },
  async created() {
    const loading = this.$loading({
      lock: true,
      text: "正在加载，请稍后...",
    });
    await this.getUserMindMapData();
    this.show = true;
    loading.close();
    // 浏览器控制按钮前进后退触发函数
    window.addEventListener('popstate', this.popstate, false);
  },
  // 销毁vm组件
  destroyed() {
    // 避免堆栈溢出，多次创建、多次触发
    window.removeEventListener('popstate', this.popstate, false);
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
  methods: {
    ...mapActions(["getUserMindMapData"]),
    popstate(data) {
      // console.log("data", data.state.back);
      // if (data.state.back === '/subbooks') {
      //   return false
      // }
      // const loadingInstance = ElLoading.service({
      //   lock: true,
      //   text: '正在加载文件，请稍后...',
      //   spinner: 'el-icon-loading',
      //   background: 'rgba(0, 0, 0, 0.7)'
      // })
      // // 获取思维导图数据
      // getForumInfo(this.$route.query.mid).then(res => {
      //   setTimeout(() => {
      //     bus.emit('setData', JSON.parse(res.data.body));
      //     bus.emit("execCommand", ['UNEXPAND_TO_LEVEL', 1]) // 默认展开到第一层级
      //   }, 500)
      //   loadingInstance.close()
      // })
      this.$router.push({ name: 'subbooks' })
    }
  },
};
</script>

<style lang="less" scoped>
.container {}
</style>
