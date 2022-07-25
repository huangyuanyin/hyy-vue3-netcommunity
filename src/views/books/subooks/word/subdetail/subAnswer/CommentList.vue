<!--
  * @Description: 帖子评论列表
  * @Author: maxf
  * @Date: 2021-12-12 22:49:29
  * @LastEditors: maxf
  * @LastEditTime: 2022-03-25 18:54:07
  * @FilePath: \vue3-netforum\src\forum\components\subdetail\subAnswer\CommentList.vue
-->
<template>
  <div>
    <el-dialog v-model="dialog" @close="dialogClose" :append-to-body="true"
      width="900px" :close-on-click-modal="false">
      <template #title>
        <span>共{{comments.length}}条评论</span>
      </template>
      <!-- <el-divider></el-divider> -->
      <div v-for="(comment, index) in comments" :key="index">
        <el-row>
          <el-col :span="2">
            <div class="user-avator">
              <img src="@/assets/img/img.jpg" />
            </div>
          </el-col>
          <el-col :span="22">
            <el-row>
              <el-col :span="2">
                <span class="comment-author">{{comment.author}}</span>
              </el-col>
              <el-col :span="5" :offset="17">
                <time class="time">{{ comment.last_mod_time }}</time>
              </el-col>
            </el-row>
            <el-row style="margin-top: 20px">
              <div v-html="comment.body"></div>
            </el-row>
            <!-- <el-row style="margin-top: 30px">
              <el-col :span="2" class="operate">
                <i><el-icon :size="20"><chat-dot-round /></el-icon></i>
                <i><el-icon :size="20"><delete /></el-icon></i>
              </el-col>
            </el-row> -->
          </el-col>
        </el-row>
        <el-divider></el-divider>
      </div>
      <el-row style="margin-top: 10px">
        <el-input
          v-model="content"
          :autosize="{ minRows: 5, maxRows: 8 }"
          type="textarea"
          placeholder="Please input"
        />
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogClose" round>取 消</el-button>
          <el-button round color="#000000" @click="confirmHandle" style="color: white">发表</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useRoute } from "vue-router";
import { getComments, addComment } from '@/api/comment.js'
import { ElMessage } from "element-plus";
export default {
  props: {
    show: Boolean,
    id: Number
  },
  setup(props, ctx) {
    const route = useRoute();
    // 对话框状态
    const dialog = ref(false)
    // 评论数据列表
    const comments = ref([])
    // 评论数据
    const content = ref('')

    // 监听
    watch(() => props.show, () => {
      dialog.value = props.show
      if (props.show) {
        getCommentList();
      }
    })

    // 获取评论数据列表
    const getCommentList = () => {
      let params = {
        article: route.params.wid,
        parent: props.id
      }
      getComments(params).then(res => {
        comments.value = res.data
      })
    }

    // 对话框关闭事件
    const dialogClose = () => {
      ctx.emit('input', false)
    }

    // 确认事件
    const confirmHandle = () => {
      if (content.value.length == 0) {
        ElMessage({
          type: 'warning',
          message: "内容不能为空！",
        })
        return
      }
      let params = {
        article: route.params.wid,
        parent_comment: props.id,
        body: content.value,
        author: sessionStorage.getItem('username')
      }
      addComment(params).then(res => {
        ElMessage({
          type: 'success',
          message: "发表成功！",
        })
        content.value = ''
        getCommentList()
      })
    }

    return {
      dialog,
      content,
      comments,
      dialogClose,
      confirmHandle
    }
  },
}
</script>

<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.comment-author {
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
  color: #303133
}
.time {
  font-size: 12px;
  color: #999;
}
.operate {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>