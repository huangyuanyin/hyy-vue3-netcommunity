<template>
  <div class="detail-wrap ignore_detail_wrap" v-loading.fullscreen.lock="fullscreenLoading">
    <el-card :style="{ 'min-height': minHeight }">
      <template #header style="height:52px">
        <div class="titleInput">
          <span v-if="flag" @click="edit()">{{ fourumdata.title }}</span>
          <el-input autofocus v-model="fourumdata.title" v-else @change="input()" @blur="editDocTitle" minlength="1" maxlength="30" />
        </div>
        <div class="md_button">
          <el-tooltip class="box-item" effect="dark" content="收藏" placement="bottom">
            <div class="xiezuo-icon" @click="handleCooperation">
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 256 256"
                xmlns="http://www.w3.org/2000/svg"
                class="larkui-icon larkui-icon-star-outlined icon-svg index-module_icon_hhi0u index-module_size_wVASz"
                data-name="StarOutlined"
                style="width: 20px; min-width: 20px; height: 20px;"
              >
                <path
                  d="m109.698 24.732-22.514 51.09-55.546 5.624a20 20 0 0 0-12.899 6.573c-7.36 8.236-6.649 20.88 1.587 28.24l41.632 37.2-11.815 54.565a20 20 0 0 0 2.265 14.298l.185.313c5.643 9.302 17.723 12.402 27.163 6.904L128 201.44l48.244 28.1a20 20 0 0 0 14.298 2.264c10.796-2.338 17.652-12.984 15.315-23.78l-11.815-54.566 41.632-37.2a20 20 0 0 0 6.572-12.898c1.113-10.99-6.894-20.8-17.884-21.914l-55.546-5.625-22.514-51.09a20 20 0 0 0-10.237-10.235c-10.107-4.455-21.912.128-26.367 10.236ZM128 32.798l22.515 51.089A20 20 0 0 0 166.8 95.719l55.546 5.626-41.631 37.2a20 20 0 0 0-6.22 19.146l11.814 54.566-48.244-28.099a20 20 0 0 0-20.132 0L69.69 212.257l11.815-54.566a20 20 0 0 0-6.221-19.146l-41.631-37.2 55.546-5.626a20 20 0 0 0 16.286-11.832L128 32.798Z"
                  fill="currentColor"
                  fill-rule="nonzero"
                ></path>
              </svg>
            </div>
          </el-tooltip>
          <el-tooltip class="box-item" effect="dark" content="协作" placement="bottom">
            <div data-testid="doc-action-collaborate" data-aspm-click="d225876" class="xiezuo-icon" @click="handleCooperation">
              <svg
                style="cursor: pointer;"
                width="20"
                height="20"
                viewBox="0 0 256 256"
                xmlns="http://www.w3.org/2000/svg"
                class="larkui-icon larkui-icon-nav-invite"
              >
                <path
                  d="M128 129c5.523 0 10 4.477 10 10s-4.477 10-10 10c-24.125 0-45.174 6.043-60.525 16.179-12.362 8.162-19.354 18.06-19.54 25.146l-.007.911-.001.397.005.747c.034 2.031.212 3.378.664 4.658.4 1.136.947 1.914 1.804 2.514l.203.135.294.186.28.207c.604.443 1.371.869 2.296 1.275l.475.201.501.198.527.195.274.096.565.19.591.187.305.092.628.181.654.178.678.175.703.171.726.168.751.164.775.16 1.207.235 1.26.226.869.147.891.142.915.14.937.134 1.447.196.993.126 1.015.122 1.563.176 1.61.167 1.101.107 1.69.153 1.153.096 1.173.093 1.798.132 1.842.122 1.888.113 1.93.104 1.312.064 1.33.06 2.031.082 2.073.073 1.886.057 2.338.061 3.948.08 1.803.027 3.794.04 3.624.02 5.876.008 9.344-.013L128 207c5.523 0 10 4.477 10 10 0 5.43-4.327 9.848-9.72 9.996l-.453.004-11.598.014-6.434-.014-3.11-.02-3.85-.043-2.294-.037-1.806-.036-2.476-.06-2.515-.07-2.478-.082-1.62-.061-1.598-.065-1.574-.071-1.55-.076-1.526-.08-2.244-.133-1.467-.095-1.444-.1-2.122-.163-1.386-.115-1.362-.122-1.34-.129-1.316-.134-1.293-.142-1.271-.148-1.248-.155-1.226-.162-1.202-.169-1.18-.176-1.159-.184-1.135-.19-1.114-.2c-.367-.067-.731-.136-1.091-.206l-1.07-.214a89.329 89.329 0 0 1-2.072-.453l-1.004-.238c-.33-.081-.658-.164-.981-.247l-.96-.256c-.317-.086-.63-.175-.94-.264l-.916-.273a55.46 55.46 0 0 1-2.623-.872l-.832-.309c-2.875-1.098-5.363-2.368-7.478-3.835l-.338-.238-.13-.084c-4.586-3.038-7.72-7.229-9.547-12.126l-.172-.476c-1.443-4.088-1.807-7.435-1.809-11.98l.004-1.096c0-14.848 10.912-30.497 28.525-42.126C75.15 136.145 100.04 129 128 129Zm58-12c5.523 0 10 4.477 10 10v35h35c5.523 0 10 4.477 10 10s-4.477 10-10 10h-35v35c0 5.523-4.477 10-10 10s-10-4.477-10-10v-35h-35c-5.523 0-10-4.477-10-10s4.477-10 10-10h35v-35c0-5.523 4.477-10 10-10Zm-58-93c25.405 0 46 20.595 46 46s-20.595 46-46 46-46-20.595-46-46 20.595-46 46-46Zm0 20c-14.36 0-26 11.64-26 26s11.64 26 26 26 26-11.64 26-26-11.64-26-26-26Z"
                  fill="currentColor"
                  fill-rule="nonzero"
                ></path>
              </svg>
            </div>
          </el-tooltip>
          <div class="copy" :data-clipboard-text="shareLink">
            <el-button type="default" @click="handleShare">分享</el-button>
          </div>
          <el-button type="success" @click="handleEdit">编辑</el-button>
          <div class="more-icon" :class="{ isMoreActive: moreDrawer }" @click="openMoreDrawer">
            <svg
              style="cursor: pointer;"
              width="1em"
              height="1em"
              viewBox="0 0 256 256"
              xmlns="http://www.w3.org/2000/svg"
              class="larkui-icon-rightboard icon-svg style-module_iconEditMode_55y65 index-module_size_wVASz"
              data-name="Rightboard"
            >
              <path
                d="M209 28c16.569 0 30 13.431 30 30v140c0 16.569-13.431 30-30 30H47c-16.569 0-30-13.431-30-30V58c0-16.569 13.431-30 30-30Zm-80 20H47c-5.523 0-10 4.477-10 10v140c0 5.523 4.477 10 10 10h82V48Zm80 0h-60v160h60c5.43 0 9.848-4.327 9.996-9.72L219 198V58c0-5.523-4.477-10-10-10Zm-15 114c5.523 0 10 4.477 10 10s-4.477 10-10 10h-20c-5.523 0-10-4.477-10-10s4.477-10 10-10h20Zm0-44c5.523 0 10 4.477 10 10s-4.477 10-10 10h-20c-5.523 0-10-4.477-10-10s4.477-10 10-10h20Zm0-44c5.523 0 10 4.477 10 10s-4.477 10-10 10h-20c-5.523 0-10-4.477-10-10s4.477-10 10-10h20Z"
                fill="currentColor"
                fill-rule="nonzero"
              ></path>
            </svg>
          </div>
        </div>
      </template>
      <el-row>
        <el-col>
          <Markdown :data="fourumdata.body" @fullScreen="fullScreen" />
          <MoreDrawer :moreDrawer="moreDrawer" :id="node.id" :title="fourumdata.title" />
        </el-col>
      </el-row>
      <div class="docInfo">
        <el-row style="justify-content: center;">
          <el-col :span="16">
            <div class="info">
              <el-tooltip class="box-item" effect="dark" :content="`作者：${fourumdata.author}`" placement="top">
                <div class="ignore-item">
                  <el-icon><User /></el-icon>
                  <span>{{ fourumdata.author }}</span>
                </div>
              </el-tooltip>
              <el-tooltip class="box-item" effect="dark" :content="`更新于${fourumdata.pub_time}`" placement="top">
                <div class="ignore-item">
                  <el-icon><Clock /></el-icon>
                  <span>{{ fourumdata.pub_time }}</span>
                </div>
              </el-tooltip>
              <el-tooltip class="box-item" effect="dark" :content="`浏览量：${fourumdata.views}`" placement="top">
                <div class="ignore-item">
                  <el-icon><Notebook /></el-icon>
                  <span>{{ fourumdata.views }}</span>
                </div>
              </el-tooltip>
              <el-tooltip class="box-item" effect="dark" :content="`评论次数：${fourumdata.comment_num}`" placement="top">
                <div class="ignore-item">
                  <el-icon><ChatDotSquare /></el-icon>
                  <span>{{ fourumdata.comment_num }}</span>
                </div>
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="answerList-wrap">
        <AnswerList :refresh="isRefresh" />
      </div>
      <!-- <el-row style="justify-content: center;">
        <el-col :span="22" class="row-title">
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
          <el-row class="bottom">
            <el-col :span="6"> </el-col>
          </el-row>
          <div style="height: 60px" id="answerlist"></div>
          <AnswerList :refresh="isRefresh" />
        </el-col>
      </el-row> -->
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, inject } from 'vue'
import { getForumInfo, deleteForum, deleteTopics, updateForum } from '@/api/forum.js'
import { updateCategorys } from '@/api/category.js'
import { downloadArticleFileApi } from '@/api/download.js'
import { downloadFile } from '@/utils/file.js'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { FullScreen } from '@element-plus/icons-vue'
import Markdown from '@/components/markdown/preview.vue'
import MoreDrawer from '@/views/books/subooks/md/components/MoreDrawer.vue'
import answerpost from './subdetail/AnswerPost.vue'
import AnswerList from './subdetail/AnswerList.vue'
import { utc2beijing } from '@/utils/util.js'
import Clipboard from 'clipboard'
import { useStore } from 'vuex'
import { ElLoading } from 'element-plus'

const router = useRouter()
const route = useRoute()
const store = useStore()
const reload = inject('reload')
const shareLink = ref('')
const isShow = ref(true)
// 是否刷新回复列表
const isRefresh = ref(0)
// 数据
const fourumdata = ref({})
const node = computed(() => store.getters.node)
const moreDrawer = ref(false)
const moreDrawerTab = ref('first')
const flag = ref(true)
const fullscreenLoading = ref(false)

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
  console.log(`output->shareLink.value`, shareLink.value)
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
  const loading = ElLoading.service({
    lock: true,
    text: '精彩内容加载中，请耐心等待一下呢......',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  getForumInfo(route.query.wid).then(res => {
    loading.close()
    fourumdata.value = res.data
  })
}

const fullScreen = val => {
  console.log(`output->11`, 11)
  isShow.value = !val
}

getForumData()

watch(
  () => route.query,
  () => {
    if (route.query.wid) {
      getForumData()
      const editor = document.getElementById('editor')
      // 在内容加载完成后，获取子元素
      if (editor && editor.childNodes.length > 0) {
        // 使用setTimeout在DOM更新后获取元素并判断是否含有子元素
        setTimeout(() => {
          const noteNavigationContent = document.querySelector('.v-note-navigation-content')
          const noteNavigationWrapper = document.querySelector('.v-note-navigation-wrapper')
          if (noteNavigationContent && noteNavigationContent.innerHTML.trim().length > 0) {
            const hasHeaderElement = Array.from(noteNavigationContent.children).some(child => {
              return child.nodeName.toLowerCase().startsWith('h') // 检查子元素是否是标题元素
            })
            if (hasHeaderElement) {
              noteNavigationWrapper.style.display = 'flex'
            } else {
              if (noteNavigationWrapper) {
                noteNavigationWrapper.style.display = 'none'
              }
            }
          } else {
            if (noteNavigationWrapper) {
              noteNavigationWrapper.style.display = 'none'
            }
          }
        }, 500) // 1秒后获取元素
      }
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
  const editor = document.getElementById('editor')
  // 在内容加载完成后，获取子元素
  if (editor && editor.childNodes.length > 0) {
    // 使用setTimeout在DOM更新后获取元素并判断是否含有子元素
    setTimeout(() => {
      const noteNavigationContent = document.querySelector('.v-note-navigation-content')
      const noteNavigationWrapper = document.querySelector('.v-note-navigation-wrapper')
      if (noteNavigationContent && noteNavigationContent.innerHTML.trim().length > 0) {
        const hasHeaderElement = Array.from(noteNavigationContent.children).some(child => {
          return child.nodeName.toLowerCase().startsWith('h') // 检查子元素是否是标题元素
        })
        if (hasHeaderElement) {
          noteNavigationWrapper.style.display = 'flex'
        } else {
          if (noteNavigationWrapper) {
            noteNavigationWrapper.style.display = 'none'
          }
        }
      } else {
        if (noteNavigationWrapper) {
          noteNavigationWrapper.style.display = 'none'
        }
      }
    }, 500) // 1秒后获取元素
  }
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

const openMoreDrawer = () => {
  moreDrawer.value = !moreDrawer.value
  if (!moreDrawer.value) {
    moreDrawerTab.value = 'first'
  }
}

const edit = () => {
  flag.value = false
}

const input = () => {
  flag.value = true
  if (fourumdata.value.title === '') {
    fourumdata.value.title = '无标题'
  }
  const params = {
    title: fourumdata.value.title,
    body: fourumdata.value.body,
    type: fourumdata.value.type,
    category: fourumdata.value.category,
    author: sessionStorage.getItem('username')
  }
  updateForum(route.query.wid, params).then(res => {
    if (res.code === 1000) {
      getUpdateCategorysApi()
    }
    reload()
  })
}

// 更新节点 API
const getUpdateCategorysApi = () => {
  const title = { name: fourumdata.value.title }
  console.log(`output->fourumdata.value.category`, fourumdata.value.category, title)
  updateCategorys(fourumdata.value.category, title).then(res => {
    store.commit('changeCurTreeId', res.data) // 定位
    ElMessage({
      message: '更新成功！',
      type: 'success'
    })
  })
}

const editDocTitle = () => {
  flag.value = true
}

const handleCooperation = () => {
  ElMessage.warning('暂不支持')
}
</script>

<style lang="scss" scoped>
.ignore_detail_wrap {
  :deep(.el-card__header) {
    height: 52px;
    padding: 0 32px 0 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.04) !important;
    display: flex;
    align-items: center;
    border-bottom: none;
  }
  :deep(.el-card__body) {
    margin-top: 52px;
    padding: 0px;
  }
  .md_button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    .xiezuo-icon {
      width: 26px;
      height: 26px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 16px;
      cursor: pointer;
      &:hover {
        background-color: #eff0f0;
      }
    }
    .el-button {
      margin-left: 16px;
    }
    .more-icon {
      margin-left: 16px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 26px;
      height: 26px;
      svg {
        width: 18px;
        height: 18px;
      }
      &:hover {
        background-color: #eff0f0;
      }
    }
    .isMoreActive {
      background-color: #eff0f0;
    }
  }
}
.detail-wrap {
  margin-bottom: 40px;
  :deep(.el-card__body) {
    overflow: -moz-scrollbars-none;
    padding-top: 0px;
  }
  :deep(.el-card__header) {
    position: fixed;
    top: 50px;
    width: -webkit-fill-available;
    backdrop-filter: blur(10px);
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    padding-right: 40px;
    padding-left: 40px;
    z-index: 2;
    .titleInput {
      width: max-content;
      span {
        cursor: pointer;
      }
    }
  }
  :deep(.el-card__body) {
    max-height: 100vh;
    overflow: scroll;
  }
  :deep(.md) {
    border: none;
    border-top: 1px solid hsla(0, 0%, 0%, 0.04);
  }
  .answerList-wrap {
    margin-bottom: 7%;
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
  .docInfo {
    margin: 3% 0;
    width: calc(100% - 15.152vw);
    .info {
      display: flex;
      align-items: center;
      .ignore-item {
        display: flex;
        align-items: center;
        margin-right: 28px;
        cursor: default;
        color: #8a8f8d;
        font-size: 16px;
        font-family: Chinese Quote, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, PingFang SC, Hiragino Sans GB, Microsoft YaHei,
          Helvetica Neue, Helvetica, Arial, sans-serif;
        .el-icon {
          margin-right: 8px;
        }
      }
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

:deep(.moreDrawer-modal) {
  position: absolute !important;
  z-index: auto !important;
}
:deep(.moreDrawer) {
  z-index: 2013 !important;
  box-shadow: none;
  border: 1px solid rgba(0, 0, 0, 0.04);
  min-height: 130vh;
}
:deep(.v-note-navigation-wrapper) {
  position: fixed !important;
  top: 105px !important;
  right: 18px !important;
  height: auto !important;
}
:deep(.v-note-navigation-close) {
  display: none !important;
}
:deep(.v-show-content) {
  width: calc(100% - 250px) !important;
  &::-webkit-scrollbar {
    width: 0px !important;
  }
}
:deep(.v-note-navigation-content) {
  &::-webkit-scrollbar {
    width: 0px !important;
  }
  h1 {
    color: #585a5a !important;
    font-size: 16px !important;
    line-height: 26px !important;
    padding-left: 12px !important;
    span {
      font-size: 16px !important;
    }
  }
  h2 {
    color: #585a5a !important;
    font-size: 16px !important;
    line-height: 26px !important;
    padding-left: 34px !important;
    span {
      font-size: 16px !important;
    }
  }
  h3 {
    color: #585a5a !important;
    font-size: 14px !important;
    line-height: 26px !important;
    padding-left: 56px !important;
    span {
      font-size: 14px !important;
    }
  }
  h4 {
    color: #585a5a !important;
    font-size: 14px !important;
    line-height: 26px !important;
    padding-left: 68px !important;
    span {
      font-size: 14px !important;
    }
  }
  h5 {
    color: #585a5a !important;
    font-size: 12px !important;
    line-height: 26px !important;
    padding-left: 80px !important;
    span {
      font-size: 12px !important;
    }
  }
  h1:hover,
  h2:hover,
  h3:hover,
  h4:hover,
  h5:hover {
    font-weight: bold !important;
    color: #262626 !important;
  }
}
:deep(.v-note-navigation-title) {
  padding: 0 12px 0 12px !important;
}
:deep(.md) {
  max-height: 100vh;
  height: 100%;
  border-top: none !important;
}
</style>
<style lang="scss">
.detail-wrap {
  .fa-mavon-eye-slash {
    display: none;
  }
}
</style>
