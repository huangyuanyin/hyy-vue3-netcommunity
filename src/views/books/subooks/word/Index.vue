<template>
  <div class="detail-wrap">
    <el-card :style="{ 'min-height': minHeight }">
      <!-- 帖子内容 -->
      <el-row>
        <el-col :span="1" :offset="1" style="margin-top: 10px">
          <div class="suspension">
            <el-row>
              <el-space direction="vertical" :size="12">
                <el-tooltip content="点赞" placement="left" :show-after="500">
                  <el-button text @click="likeHandle">
                    <img src="@/assets/img/1.png" />
                  </el-button>
                </el-tooltip>
                <span>{{ fourumdata.linknum }}</span>
              </el-space>
            </el-row>
            <el-row class="collect">
              <el-space direction="vertical" :size="12">
                <el-tooltip content="编辑" placement="left" :show-after="500">
                  <el-button text @click="handleEdit">
                    <i>
                      <el-icon :size="24" color="#000000">
                        <Edit />
                      </el-icon>
                    </i>
                  </el-button>
                </el-tooltip>
                <span>{{ fourumdata.collertnum }}</span>
              </el-space>
            </el-row>
            <el-row class="collect">
              <el-space direction="vertical" :size="12">
                <el-tooltip content="回复" placement="left" :show-after="500">
                  <el-button text>
                    <i>
                      <el-icon :size="24" color="#000000" @click="answerHandle">
                        <comment />
                      </el-icon>
                    </i>
                  </el-button>
                </el-tooltip>
                <span>{{ fourumdata.comment_num }}</span>
              </el-space>
            </el-row>
            <el-row class="collect">
              <el-space direction="vertical" :size="12">
                <el-tooltip content="返回" placement="left" :show-after="500">
                  <el-button text>
                    <i>
                      <el-icon :size="24" color="#000000" @click="goBack">
                        <Back />
                      </el-icon>
                    </i>
                  </el-button>
                </el-tooltip>
              </el-space>
            </el-row>
            <el-row>
              <el-tooltip content="更多操作" placement="left" :show-after="500">
                <el-dropdown @command="handleCommandMore" trigger="click">
                  <div class="more">
                    <img src="@/assets/img/more.png" />
                  </div>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="delete">
                        <el-icon> <delete /> </el-icon>删除
                      </el-dropdown-item>
                      <el-dropdown-item command="download">
                        <el-icon> <Download /> </el-icon>下载
                      </el-dropdown-item>
                      <el-dropdown-item command="update" disabled>
                        <el-icon> <Checked /> </el-icon>评审
                      </el-dropdown-item>
                      <!-- <el-dropdown-item command="update">
                        <el-icon><edit /></el-icon>编辑
                      </el-dropdown-item> -->
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </el-tooltip>
            </el-row>
          </div>
        </el-col>
        <el-col :span="18" :offset="1">
          <!-- <el-card shadow="never" :body-style="{ padding: '30px' }"> -->
          <el-row>
            <span class="title">{{ fourumdata.title }}</span>
          </el-row>
          <el-row class="topinfo">
            <el-col :span="8" class="user">
              <div>
                <img src="@/assets/img/img.jpg" />
              </div>
              <div>
                <span>{{ fourumdata.author }}</span>
                <time class="time" style="margin: 10px;">发布于</time>
                <time class="time">{{ utc2beijing(fourumdata.pub_time) }}</time>
              </div>
            </el-col>
          </el-row>
          <el-row style="margin-top: 30px">
            <Markdown :data="fourumdata.body" />
          </el-row>
          <!-- v-md-editor -->
          <!-- <el-row style="margin-top: 30px">
              <v-md-preview :text="fourumdata.body"></v-md-preview>
            </el-row> -->
          <el-row class="bottom">
            <el-col :span="6">
              <!-- <el-tag size="large" type="success">{{fourumdata.tags[0].name}}</el-tag> -->
            </el-col>
          </el-row>
          <!-- 回复列表 -->
          <AnswerList :refresh="isRefresh" id="answerlist" />
          <!-- </el-card> -->
        </el-col>
      </el-row>

      <!-- <el-col :span="20" :offset="2">
          <markdown-com :data="fourumdata.body"></markdown-com>
        </el-col> -->
      <!-- </el-row> -->
      <!-- 回复列表 -->
      <!-- <answer-list-com :refresh="isRefresh" id="answerlist"></answer-list-com> -->
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, inject } from 'vue'
import { getForumInfo, deleteForum, deleteTopics } from '@/api/forum.js'
import { downloadArticleFileApi } from '@/api/download.js'
import { downloadFile } from '@/utils/file.js'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import Markdown from '@/components/markdown/preview.vue'
import answerpost from './subdetail/AnswerPost.vue'
import AnswerList from './subdetail/AnswerList.vue'
import { utc2beijing } from '@/utils/util.js'

const router = useRouter()
const route = useRoute()
const reload = inject('reload')
// 是否刷新回复列表
const isRefresh = ref(0)
// 数据
const fourumdata = ref({})

// 最小高度
const minHeight = computed(() => {
  return window.innerHeight - 55 + 'px'
})

// 回复按钮事件
const answerHandle = () => {
  document.querySelector('#answerlist').scrollIntoView({
    behavior: 'smooth',
    block: 'end'
  })
}

// 获取帖子数据
const getForumData = () => {
  getForumInfo(route.query.wid).then(res => {
    fourumdata.value = res.data
  })
}

getForumData()

watch(
  () => route.query,
  () => {
    if (route.query.wid) {
      getForumData()
    }
    if (route.query.aricleName) {
      fourumdata.value.title = route.query.aricleName
      console.log('dada', fourumdata.value.title)
    }
  }
)

onMounted(() => {
  setTimeout(() => {
    if (route.query.status == 'answer') {
      document.querySelector('#answerlist').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }, 100)
})

// 点赞事件
const likeHandle = () => {
  ElMessage({
    message: '暂不支持',
    type: 'warning'
  })
}

// 收藏事件
const collectHandle = () => {
  ElMessage({
    message: '暂不支持',
    type: 'warning'
  })
}

// 编辑按钮
const handleEdit = () => {
  if (fourumdata.value.type == 'a') {
    router.push({
      name: 'md',
      query: { tid: route.query.wid, category: fourumdata.value.category, type: 'edit', isRight: route.query.isRight, typeof: 'a' }
    })
  } else {
    router.push({
      name: 'md',
      query: { mid: route.query.wid, category: fourumdata.value.category, type: 'edit', isRight: route.query.isRight, typeof: 'w' }
    })
  }
}

// 返回
const goBack = () => {
  router.go(-1)
}

// 是否刷新
const getAnswerPostMsg = msg => {
  isRefresh.value = msg
}

// 更多操作按钮帖子
const handleCommandMore = command => {
  switch (command) {
    case 'delete':
      deleteApi()
      break
    case 'download':
      handleDownload(route.query.wid)
      break
    default:
      break
  }
}

// 下载预览文件
const handleDownload = async id => {
  downloadFile.judgeType(id)
}

// 删除接口
const deleteApi = () => {
  // 二次确认删除
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning',
    draggable: true
  })
    .then(() => {
      if (route.query && route.query.isRight) {
        // 删除帖子
        deleteForum(route.query.wid).then(res => {
          ElMessage.success('删除成功')
          router.push({ name: 'subbooks', params: { wRefresh: true } })
        })
      } else {
        // 删除分类
        deleteTopics(fourumdata.value.category).then(res => {
          ElMessage.success('删除成功')
          router.push({ name: 'subbooks', params: { wRefresh: false, notGetNodeList: true } })
        })
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled'
      })
    })
}
</script>

<style lang="scss" scoped>
.detail-wrap {
  // margin-bottom: 40px;
}

.title {
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  font-family: '宋体';
  color: black;
}

.topinfo {
  margin-top: 30px;
}

.topinfo .user {
  display: flex;
  align-items: center;
}

.topinfo .user img {
  display: block;
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.topinfo .user span {
  font-size: 16px;
  line-height: 20px;
  font-weight: 500;
  margin-left: 15px;
  color: #606266;
}

.topinfo .time {
  line-height: 20px;
  font-size: 14px;
  color: #999;
}

.suspension {
  position: fixed;
}

.suspension img {
  display: block;
  width: 35px;
  height: 35px;
  border-radius: 50%;
}

.collect {
  margin-top: 25px;
  margin-left: 5px;
}

.more {
  margin-top: 15px;
}

.more img {
  display: block;
  margin-left: 14px;
  // width: 40px;
  height: 40px;
  border-radius: 50%;
}

.bottom {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
<style lang="scss">
.detail-wrap {
  .fa-mavon-eye-slash {
    display: none;
  }
}
</style>
