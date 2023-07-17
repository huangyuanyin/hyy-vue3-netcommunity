<template>
  <div class="detail-wrap">
    <el-card :style="{ 'min-height': minHeight }">
      <!-- 帖子内容 -->
      <el-row style="justify-content: center;">
        <!-- <el-col :span="1" :offset="1" style="margin-top: 10px">
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
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </el-tooltip>
            </el-row>
          </div>
        </el-col> -->
        <el-col :span="22" class="row-title">
          <!-- <el-card shadow="never" :body-style="{ padding: '30px' }"> -->
          <div class="button-row" v-show="isShow">
            <el-row>
              <el-col :span="24">
                <div class="is-editIcon">
                  <span class="title">{{ fourumdata.title }}</span>
                </div>
              </el-col>
            </el-row>
            <el-row class="topinfo">
              <el-col :span="24" class="user" style="display:flex">
                <div style="display: flex;align-items: center;">
                  <img src="@/assets/img/img.jpg" />
                  <div style="display: inline;">
                    <span>{{ fourumdata.author }}</span>
                    <time class="time" style="margin: 10px;">发布于</time>
                    <time class="time">{{ utc2beijing(fourumdata.pub_time) }}</time>
                  </div>
                </div>
                <div>
                  <el-tooltip content="编辑" placement="bottom" :show-after="300">
                    <svg-icon iconName="icon-bianji1" className="is-editIcon-item" @click="handleEdit" />
                  </el-tooltip>
                  <el-tooltip content="分享" placement="bottom" :show-after="300">
                    <div class="copy" :data-clipboard-text="shareLink" style="display:inline">
                      <svg-icon iconName="icon-fenxiang" className="is-editIcon-item" @click="handleShare" />
                    </div>
                  </el-tooltip>
                  <el-tooltip content="下载" placement="bottom" :show-after="300">
                    <svg-icon iconName="icon-_xiazai" className="is-editIcon-item" @click="handleDownload(route.query.wid)" />
                  </el-tooltip>
                  <el-tooltip content="评论" placement="bottom" :show-after="300">
                    <div class="aa" style="display: inline;">
                      <svg-icon iconName="icon-pinglun" className="is-editIcon-item" @click="answerHandle" />
                      <div v-if="fourumdata.comment_num" class="tips">{{ fourumdata.comment_num }}</div>
                    </div>
                  </el-tooltip>
                  <el-tooltip content="删除" placement="bottom" :show-after="300">
                    <svg-icon iconName="icon-shanchu2" className="is-editIcon-item" @click="deleteApi()" />
                  </el-tooltip>
                </div>
              </el-col>
            </el-row>
          </div>
          <el-row style="z-index: 300;">
            <Markdown :data="fourumdata.body" @fullScreen="fullScreen" />
          </el-row>
          <!-- <el-row style="margin-top: 13vh;z-index: 300;">
            <Markdown :data="fourumdata.body" @fullScreen="fullScreen" />
          </el-row> -->
          <!-- v-md-editor -->
          <!-- <el-row style="margin-top: 30px">
              <v-md-preview :text="fourumdata.body"></v-md-preview>
            </el-row> -->
          <el-row class="bottom">
            <el-col :span="6">
              <!-- <el-tag size="large" type="success">{{fourumdata.tags[0].name}}</el-tag> -->
            </el-col>
          </el-row>
          <div style="height: 60px" id="answerlist"></div>
          <!-- 回复列表 -->
          <AnswerList :refresh="isRefresh" />
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
import Clipboard from 'clipboard'

const router = useRouter()
const route = useRoute()
const reload = inject('reload')
const shareLink = ref('')
const isShow = ref(true)
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
    inline: 'start'
  })
}

const handleShare = () => {
  shareLink.value = window.location.href
  let clipboard = new Clipboard('.copy')
  clipboard.on('success', e => {
    ElMessage.success('分享链接已复制到剪贴板')
    // 释放内存
    clipboard.destroy()
  })
  clipboard.on('error', e => {
    // 不支持复制
    ElMessage.error('该浏览器不支持自动复制')
    // 释放内存
    clipboard.destroy()
  })
}

// 获取帖子数据
const getForumData = () => {
  getForumInfo(route.query.wid).then(res => {
    fourumdata.value = res.data
  })
}

const fullScreen = val => {
  isShow.value = !val
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
  // setTimeout(() => {
  //   if (route.query.status == 'answer') {
  //     document.querySelector('#answerlist').scrollIntoView({
  //       behavior: 'smooth',
  //       block: 'start'
  //     })
  //   }
  // }, 100)
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
    confirmButtonText: '确定',
    cancelButtonText: '取消',
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
        console.log(`output->`, fourumdata.value.category)
        deleteTopics(fourumdata.value.category).then(res => {
          ElMessage.success('删除成功')
          router.push({ name: 'subbooks', params: { wRefresh: false, notGetNodeList: true } })
        })
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消操作'
      })
    })
}
</script>

<style lang="scss" scoped>
.detail-wrap {
  margin-bottom: 40px;
  :deep(.el-card__body) {
    overflow: -moz-scrollbars-none;
    padding-top: 0px;
  }

  .row-title {
    .button-row {
      // position: fixed;
      top: 50px;
      z-index: 301;
      padding: 20px 0;
      background-color: #fff;
      // width: 80%;
      // margin-left: -20px;
    }
  }
}

.title {
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  font-family: '宋体';
  color: black;
}

.topinfo {
  margin-top: 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  .is-editIcon-item {
    margin-left: 20px;
    font-size: 24px;
    cursor: pointer;
    &:hover {
      background: #f5f5f5;
    }
  }
  .aa {
    position: relative;
  }
  .tips {
    width: 20px;
    height: 20px;
    line-height: 20px;
    font-size: 10px;
    color: #fff;
    text-align: center;
    background-color: #f00;
    border-radius: 50%;
    position: absolute;
    right: -10px;
    top: -18px;
  }
}

.topinfo .user {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.topinfo .user img {
  display: inline;
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
.is-editIcon {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  .is-editIcon-item {
    margin-left: 20px;
    font-size: 28px;
    cursor: pointer;
    &:hover {
      background: #409eff;
    }
  }
}
</style>
<style lang="scss">
.detail-wrap {
  .fa-mavon-eye-slash {
    display: none;
  }
}
</style>
