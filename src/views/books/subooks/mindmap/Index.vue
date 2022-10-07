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
  },
  watch: {
    $route: {
      handler(to, from) {
        if (to.name === 'mindMap') {
          // 获取思维导图数据
          getForumInfo(this.$route.query.mid).then(res => {
            bus.emit('setData', JSON.parse(res.data.body));
            bus.emit("execCommand", ['UNEXPAND_TO_LEVEL', 1]) // 默认展开到第一层级
          })
          console.log("to", to, from);
        }
      },
      immediate: true,//第一次就执行
    }
  },
  methods: {
    ...mapActions(["getUserMindMapData"]),
  },
};
</script>

<style lang="less" scoped>
.container {}
</style>
