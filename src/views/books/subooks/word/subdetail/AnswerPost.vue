<!--
  * @Description: 帖子回复组件
  * @Author: maxf
  * @Date: 2021-12-12 22:49:29
  * @LastEditors: maxf
  * @LastEditTime: 2022-03-25 18:54:07
  * @FilePath: \vue3-netforum\src\forum\components\AnswerPost.vue
-->
<template>
  <div>
    <el-row>
      <el-col :span="18" :offset="3">
        <tinymce-com v-model="value" placeholder="请输入回复信息(不少于10个字)"></tinymce-com>
        <el-button round color="#000000" @click="confirmHandle">发表</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useRoute } from "vue-router";
import { addAnswer } from '@/api/forum.js'
import { ElMessage } from "element-plus";
import Tinymce from '@/components/tinymce'
export default {
  components: {
    'tinymce-com': Tinymce
  },
  setup(props, ctx) {
    const route = useRoute();
    const state = reactive({
      value: ''
    })

    // 提交回复
    const confirmHandle = () => {
      if (state.value.length == 0) {
        ElMessage({
          type: 'warning',
          message: "内容不能为空！",
        })
        return
      }
      let params = {
        id: route.query.id,
        value: state.value
      }
      addAnswer(params).then(res => {
         ctx.emit('input', Math.random()+1)
         state.value = ''
      })
    }

    return {
      ...toRefs(state),
      confirmHandle
    }
  },
}
</script>

<style scoped>
.el-button {
  color:white;
  float: right;
  margin-top: 20px;
}
</style>