<template>
  <div class="AnswerList-wrap">
    <el-row>
      <el-col :span="24" class="pagination">
        <!-- <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            {{ commandData }}<el-icon><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="最新回复">最新回复</el-dropdown-item>
              <el-dropdown-item command="最早回复">最早回复</el-dropdown-item>
              <el-dropdown-item command="最多评论">最多评论</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown> -->
        <!-- <el-pagination
          v-model:currentPage="page"
          v-model:page-size="size"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination> -->
      </el-col>
    </el-row>
    <!-- 回复列表 -->
    <el-row style="justify-content: center;">
      <el-col :span="16">
        <div class="allAnswer" v-if="answersTotal">{{ `所有评论（${answersTotal}）` }}</div>
        <el-divider class="line" v-if="answersTotal"></el-divider>
        <div v-for="(answer, index) in answers" :key="index">
          <el-row>
            <el-col :span="1">
              <div class="answer-user">
                <img src="@/assets/img/img.jpg" />
              </div>
            </el-col>
            <el-col :span="20" style="display: flex;align-items: center;">
              <span class="answer-author">{{ answer.author }} 回复于 {{ answer.last_mod_time }}</span>
            </el-col>
            <el-col :span="3" class="answer-chat">
              <el-space>
                <el-tooltip effect="dark" content="查看评论" placement="top">
                  <el-button type="text" @click="commentHandle(answer.id)">
                    <i>
                      <el-icon style="margin-top: 3px" :size="16" color="#000000">
                        <chat-line-square />
                      </el-icon>
                    </i>
                  </el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="顶一下" placement="top">
                  <el-button type="text" @click="likeHandle(answer.id)">
                    <img src="@/assets/img/like.png" />
                  </el-button>
                </el-tooltip>
                <el-dropdown @command="answerHandleMore" trigger="hover">
                  <el-button type="text">
                    <el-icon color="#000000">
                      <more-filled />
                    </el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item :command="'delete' + ',' + answer.id">
                        <el-icon> <delete /></el-icon>删除
                      </el-dropdown-item>
                      <el-dropdown-item :command="'update' + ',' + answer.id">
                        <el-icon> <edit /> </el-icon>编辑
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </el-space>
            </el-col>
          </el-row>
          <el-row style="margin-top: 30px" class="answerBody">
            <el-col :span="16" :offset="1">
              <div v-html="answer.body"></div>
            </el-col>
          </el-row>
          <el-divider></el-divider>
        </div>
      </el-col>
    </el-row>
    <!-- 回复提交 -->
    <el-row class="answerSubmit" style="justify-content: center;">
      <el-col :span="1">
        <div class="answer-user">
          <img src="@/assets/img/img.jpg" />
        </div>
      </el-col>
      <el-col :span="15" style="height: 100%;">
        <!-- <tinymce-com v-model="value" placeholder="请输入回复信息(不少于10个字)"></tinymce-com> -->
        <markdown-com
          style="z-index: 99999;"
          :data="value"
          @input="getMd"
          @fullScreen="fullScreen"
          :toolbars="toolbars"
          :noSlot="false"
          :subfield="false"
        ></markdown-com>
      </el-col>
    </el-row>
    <el-row style="justify-content: center;margin-top: 20px;">
      <el-col :span="1"></el-col>
      <el-col :span="15"><el-button class="confirm" round color="#000000" @click="confirmHandle">发表</el-button></el-col>
    </el-row>
    <!-- 回复评论 -->
    <comment-list-com :show="commentDialog" :id="answerid" @input="getComment"></comment-list-com>
  </div>
</template>

<script>
import { ref, reactive, toRefs, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import 'mavon-editor/dist/css/index.css'
import markdown from '@/components/markdown/Index.vue'
import { getComments, addComment, deleteComment } from '@/api/comment.js'
import commentlist from './subAnswer/CommentList.vue'
import Tinymce from '@/components/tinymce'
export default {
  props: {
    refresh: Number
  },
  name: 'editor',
  components: {
    'comment-list-com': commentlist,
    'tinymce-com': Tinymce,
    'markdown-com': markdown
  },
  setup(props, ctx) {
    const route = useRoute()
    const router = useRouter()
    // 总评论数
    const total = ref(100)
    // 页码
    const page = ref(1)
    // 当前页码条数
    const size = ref(10)
    // 回复列表
    const answers = ref([])
    // 回复评论对话框
    const commentDialog = ref(false)
    // 回复id
    const answerid = ref(0)
    // 菜单
    const commandData = ref('最新回复')
    const state = reactive({
      value: '',
      answersTotal: 0
    })
    const toolbars = ref({
      bold: true, // 粗体
      italic: true, // 斜体
      header: true, // 标题
      // underline: true, // 下划线
      // strikethrough: true, // 中划线
      mark: false, // 标记
      superscript: false, // 上角标
      subscript: false, // 下角标
      quote: true, // 引用
      ol: true, // 有序列表
      ul: true, // 无序列表
      link: true, // 链接
      imagelink: false, // 图片链接
      code: true, // code
      table: true, // 表格
      fullscreen: true, // 全屏编辑
      readmodel: false, // 沉浸式阅读
      // htmlcode: true, // 展示html源码
      help: true, // 帮助
      /* 1.3.5 */
      undo: true, // 上一步
      redo: true, // 下一步
      trash: true, // 清空
      save: false, // 保存（触发events中的save事件）
      /* 1.4.2 */
      navigation: false, // 导航目录
      /* 2.1.8 */
      alignleft: true, // 左对齐
      aligncenter: true, // 居中
      alignright: true, // 右对齐
      /* 2.2.1 */
      subfield: false, // 单双栏模式
      preview: true // 预览
    })

    // 监听
    // watch(() => props.refresh, () => {
    //   if (props.refresh > 0) {
    //     getAnswerList()
    //   }
    // })

    watch(
      () => route.query.wid,
      () => {
        if (route.query.wid) {
          getAnswerList()
        }
      }
    )

    // 获取回复列表
    const getAnswerList = () => {
      let params = {
        article: route.query.wid
      }
      getComments(params).then(res => {
        answers.value = res.data
        state.answersTotal = res.data.length || 0
      })
    }

    // 获取md数据
    const getMd = evt => {
      if (typeof evt == 'string') {
        state.value = evt
      }
    }

    getAnswerList()

    // 下拉菜单
    const handleCommand = value => {
      commandData.value = value
      getAnswerList()
    }

    // 页码响应
    const handleCurrentChange = () => {
      getAnswerList()
    }

    // 条数/页 响应
    const handleSizeChange = () => {
      page.value = 1
      getAnswerList()
    }

    // 点赞
    const likeHandle = id => {
      console.log(id)
      ElMessage({
        message: '暂不支持',
        type: 'warning'
      })
    }

    // 更多操作 回复
    const answerHandleMore = command => {
      let tmp = command.split(',')
      if (tmp[0] == 'delete') {
        deleteApi(tmp[1])
      } else {
        ElMessage({
          message: '暂不支持',
          type: 'warning'
        })
      }
    }

    // 提交回复
    const confirmHandle = () => {
      if (state.value.length == 0) {
        ElMessage({
          type: 'warning',
          message: '内容不能为空！'
        })
        return
      }
      let params = {
        article: route.query.wid,
        body: state.value,
        author: sessionStorage.getItem('username')
      }
      addComment(params).then(res => {
        ElMessage({
          message: '评论成功',
          type: 'success'
        })
        getAnswerList()
        state.value = ''
      })
    }

    // 查看回复的评论
    const commentHandle = id => {
      commentDialog.value = true
      answerid.value = id
    }

    // 评论对话框子组件回调
    const getComment = msg => {
      commentDialog.value = msg
    }

    // 删除接口
    const deleteApi = id => {
      // 二次确认删除
      ElMessageBox.confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        draggable: true
      })
        .then(() => {
          deleteComment(id).then(res => {
            ElMessage.success('删除成功')
            getAnswerList()
            // router.push({ name: 'subbooks', params: { wRefresh: true } })
          })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: 'Delete canceled'
          })
        })
    }

    return {
      total,
      page,
      size,
      answers,
      commentDialog,
      answerid,
      commandData,
      ...toRefs(state),
      commentHandle,
      getComment,
      handleSizeChange,
      likeHandle,
      handleCurrentChange,
      handleCommand,
      confirmHandle,
      answerHandleMore,
      router,
      toolbars,
      getMd
    }
  }
}
</script>

<style scoped>
.AnswerList-wrap {
  width: calc(100% - 300px);
}
.bottom {
  /* margin-top: 30px; */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
}
.answer-chat {
  text-align: end;
}

.answer-chat img {
  display: block;
  width: 25px;
  height: 25px;
  border-radius: 50%;
}

.answer-user img {
  display: block;
  width: 35px;
  height: 35px;
  border-radius: 50%;
}

.answer-author {
  margin-left: 12px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  color: #303133;
}

.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 700;
  font-family: '宋体';
}

.confirm {
  color: white;
  margin-top: 20px;
}

.allAnswer {
  color: #262626;
  font-size: 14px;
  font-weight: 700;
}

.answerBody {
  margin-left: 12px;
}

.answerSubmit {
  height: 300px;
  min-height: 300px;
}

:deep(.v-left-item) {
  padding-left: 0px !important;
}

:deep(.el-divider--horizontal) {
  border-top: 1px solid hsla(0, 0%, 0%, 0.04);
}

:deep(#editor .v-note-wrapper) {
  border: 1px solid #e7e9e8;
  min-height: auto;
}

:deep(.v-note-wrapper .v-note-panel) {
  min-height: auto !important;
}

:deep(.v-right-item) {
  max-width: 24% !important;
}
</style>
