<template>
  <div>
    <el-card class="list-wrap">
      <el-container>
        <el-header height="30px" style="width: 90%; margin-left: 5%">
          <span>{{ route.query.groupname || node.label }}</span>
          <el-button text style="float: right" @click="handleRefresh" v-if="!isTrash">
            <el-icon>
              <Refresh />
            </el-icon>
          </el-button>
          <el-dropdown trigger="click" @command="handleCommand" style="float: right" v-if="!isTrash">
            <el-button text>
              <el-icon size="large">
                <CirclePlus />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="documentManage">
                  <svg-icon iconName="icon-shangchuanwenjian" className="is-Folder" />文档管理
                </el-dropdown-item>
                <!-- <el-dropdown-item command="article"> <svg-icon iconName="icon-word" className="is-Folder" />新建文档 </el-dropdown-item>
                <el-dropdown-item command="excel"> <svg-icon iconName="icon-excel" className="is-Folder" />新建Excel </el-dropdown-item>
                <el-dropdown-item command="mindmap">
                  <svg-icon iconName="icon-icon__liuchengtu" className="is-Folder" />新建思维导图
                </el-dropdown-item>
                <el-dropdown-item command="ppt"> <svg-icon iconName="icon-ppt" className="is-Folder" />新建PPT</el-dropdown-item>
                <el-dropdown-item command="process" disabled>新建流程图</el-dropdown-item>
                <el-dropdown-item command="process" disabled>新建白板</el-dropdown-item> -->
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button :icon="Search" style="float: right" @click="drawer = true" v-if="!isTrash">筛选</el-button>
        </el-header>
        <el-main style="width: 90%; margin-left: 5%">
          <!-- <el-table :data="datalist" fit border stripe v-loading="loading">
            <el-table-column type="index" width="50" />
            <el-table-column label="标题">
              <template #default="scope">
                <el-tag @click="handleOpen(scope.row.type, scope.row.id)">{{ scope.row.title }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="发布时间" prop="pub_time"></el-table-column>
            <el-table-column label="作者" prop="author"></el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button size="small" @click="handleEdit(scope.row.id)">Edit</el-button>
                <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">Delete</el-button>
              </template>
            </el-table-column>
          </el-table> -->
          <ul class="infinite-list" style="overflow: auto">
            <li v-for="(question, index) in datalist" :key="index">
              <el-card shadow="never" :body-style="{ padding: '0px' }" class="itemCard">
                <div class="ribbon" v-if="question.type === 'd'">
                  <span>仅预览</span>
                </div>
                <div class="title-wrap" style="" @click="handleOpen(question.type, question.id, question)">
                  <h3 style="margin-bottom: 10px;">
                    {{ question.title }}
                  </h3>
                  <p v-if="question.description">{{ question.description }}</p>
                </div>
                <el-row class="subscript">
                  <el-col :span="1">
                    <div class="user-avator">
                      <img src="@/assets/img/img.jpg" />
                    </div>
                  </el-col>
                  <el-col :span="2" class="user-name">
                    <span>{{ question.author }}</span>
                  </el-col>
                  <el-col :span="5">
                    <time class="time">{{ utc2beijing(question.pub_time) }}</time>
                  </el-col>
                  <el-col :span="5" :offset="11" class="statistics">
                    <el-button text @click="handleOpen(question.type, question.id, question)">
                      <el-icon :size="16">
                        <View />
                      </el-icon>
                      <span>{{ question.views }}</span>
                    </el-button>
                    <el-button text @click="answerHandle(question.type, question.id)" v-if="!['d', 'm', 'e'].includes(question.type)">
                      <el-icon :size="16" color="#000000">
                        <chat-dot-round />
                      </el-icon>
                      <span v-if="question.type !== 'd'">{{ question.s_comments.length }}</span>
                    </el-button>
                    <el-button text @click="handleEdit(question.type, question)" v-if="!['d', 'a', 'w'].includes(question.type)">
                      <el-icon :size="16">
                        <Edit />
                      </el-icon>
                    </el-button>
                    <el-button text @click="handleDelete(question.title, question.id)" v-if="!['a', 'w'].includes(question.type)">
                      <el-icon :size="16">
                        <Delete />
                      </el-icon>
                    </el-button>
                    <el-button
                      text
                      class="copy"
                      :data-clipboard-text="shareLink"
                      @click="handleShare(question.type, question.id, question)"
                    >
                      <el-icon :size="16"><Share /></el-icon>
                    </el-button>
                    <el-button text v-if="['d', 'a', 'w'].includes(question.type)" @click="handleDownload(question.id, question.type)">
                      <el-icon :size="16">
                        <Download />
                      </el-icon>
                    </el-button>
                  </el-col>
                </el-row>
              </el-card>
            </li>
          </ul>
          <el-pagination
            v-if="datalist.length != 0"
            style="margin: 10px 0 50px 0;justify-content: flex-end"
            :total="total"
            :current-page="page"
            :page-size="size"
            :page-sizes="[10, 20, 50, 100]"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            layout="total, sizes, prev, pager, next, jumper"
          ></el-pagination>
        </el-main>
      </el-container>
    </el-card>
    <el-drawer v-model="drawer" title="快速筛选" direction="rtl">
      <el-form :model="form" label-width="80px" size="large">
        <el-form-item label="标题">
          <el-input v-model="form.title" placeholder="请输入标题关键字"></el-input>
        </el-form-item>
        <el-form-item label="知识库">
          <el-input v-model="form.body" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" placeholder="请输入要检索的知识库内容" />
        </el-form-item>
        <el-form-item label="标签">
          <el-cascader :options="taglist" v-model="form.tags" clearable :props="{ value: 'id', label: 'name' }"> </el-cascader>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="drawerClose">取 消</el-button>
          <el-button type="primary" @click="handleSearch">确 定</el-button>
        </span>
      </template>
    </el-drawer>
    <SaveDialog
      :isShowDialog="isShowDialog"
      v-on:closeSaveDialog="closeSaveDialog(res)"
      v-on:goRefresh="goRefresh()"
      :treeData="treeData"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, watchEffect, reactive, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
import SaveDialog from '@/components/SaveDialog.vue'
import { getForum, updateForum, getForumInfo, deleteForum } from '@/api/forum.js'
import { downloadArticleFileApi } from '@/api/download.js'
import { downloadFile } from '@/utils/file.js'
import { Search } from '@element-plus/icons-vue'
import { getTag } from '@/api/tag.js'
import { ElMessage, ElLoading, ElMessageBox } from 'element-plus'
// import exampleData from 'simple-mind-map/example/exampleData';
import bus from '@/utils/bus.js'
import { Base64 } from 'js-base64'
import { utc2beijing } from '@/utils/util.js'
import { getCategorysInfo } from '@/api/category.js'
import { judgeNodeType } from '@/utils/methods.js'
import Clipboard from 'clipboard'

const clipboard = ref(null) // 创建一个ref来存储Clipboard实例

const store = useStore()
const route = useRoute()
const router = useRouter()
const spaceid = ref(route.query.spaceid || sessionStorage.getItem('spaceid')) // 工作空间标题名
const spacename = ref(route.query.spacename || sessionStorage.getItem('spacename'))
const shareLink = ref('') // 分享链接
const treeData = ref([])
const isTrash = ref(false) // 是否是回收站
// 等待
let loadingInstance
const loading = ref(false)
const isShowDialog = ref(false)
// 数据列表
const datalist = ref([])
// 标签列表
const taglist = ref([])
// 搜索内容
const keywords = ref('')
// 条数/页
const size = ref(10)
// 总条数
const total = ref(0)
// 当前页码
const page = ref(1)
// 抽屉
const drawer = ref(false)
// 节点数据
const node = computed(() => store.getters.node)
// 筛选表单
const form = reactive({
  title: '',
  tags: '',
  body: ''
})
// 初始化思维导图数据
const exampleData = {
  root: { data: { text: '中心主题', expand: true, isActive: false }, children: [] },
  theme: { template: 'classic4', config: {} },
  layout: 'logicalStructure',
  view: {
    transform: {
      scaleX: 1,
      scaleY: 1,
      shear: 0,
      rotate: 0,
      translateX: 0,
      translateY: 0,
      originX: 0,
      originY: 0,
      a: 1,
      b: 0,
      c: 0,
      d: 1,
      e: 0,
      f: 0
    },
    state: { scale: 1, x: 0, y: 0, sx: -55, sy: -65 }
  }
}

// 获取数据列表
const getDataList = () => {
  loading.value = true
  let tmpBody = encodeURIComponent(form.body)
  let tmpTitle = encodeURIComponent(form.title)
  let nodeid = ''
  if (node.value.id) {
    nodeid = node.value.id
  }
  let params = {
    category: nodeid,
    tags: form.tags,
    title: tmpTitle,
    body: tmpBody,
    page: page.value,
    pagesize: size.value
  }
  getForum(params).then(res => {
    // res.data = res.data.filter(item => (isTrash.value ? item.is_delete === true : item.is_delete === false))
    datalist.value = res.data
    total.value = res.total
    loading.value = false
  })
}

const goRefresh = () => {
  getDataList()
}

// 获取标签列表
const getTagList = () => {
  getTag().then(res => {
    taglist.value = res.data
  })
}

getTagList()

// 监听是否刷新
watchEffect(() => {
  // if (route.params.wRefresh || node.value.id) {
  //   getDataList()
  // }
  if (route.query && route.query.type) {
    route.query.type == 'trash' ? (isTrash.value = true) : (isTrash.value = false)
  }
})

watchEffect(() => {
  if (route.query.groupid) {
    let params = {
      category: route.query.groupid,
      tags: '',
      title: '',
      body: '',
      page: page.value,
      pagesize: size.value
    }
    getForum(params).then(res => {
      // res.data = res.data.filter(item => (isTrash.value ? item.is_delete === true : item.is_delete === false))
      datalist.value = res.data
      total.value = res.total
      loading.value = false
    })
  }
})

const handleRefresh = () => {
  getDataList()
}

// 抽屉关闭事件
const drawerClose = () => {
  form.title = ''
  form.body = ''
  form.tags = ''
  drawer.value = false
}

// 筛选事件
const handleSearch = () => {
  if (form.tags == null) {
    form.tags = ''
  }
  getDataList()
  drawerClose()
}

//
const handleSizeChange = value => {
  console.log(value)
  size.value = value
  getDataList()
}

// 页码响应
const handleCurrentChange = value => {
  page.value = value
  getDataList()
}

// 指令事件
const handleCommand = value => {
  if (value == 'excel') {
    router.push({ name: 'excel', query: { isRight: 'right', isAdd: 'add' } })
  }
  if (value == 'article') {
    router.push({ name: 'md', query: { isRight: 'right', isAdd: 'add' } })
  }
  // if (value == 'word') {
  //   router.push({ name: 'md', query: { type: "right", isAdd: "add" } })
  // }
  if (value == 'mindmap') {
    bus.emit('setData', exampleData) // 初始化思维导图数据
    router.push({ name: 'mindMap', query: { isRight: 'right', isAdd: 'add' } })
  }
  if (value == 'ppt') {
    router.push({ path: '/ppt', query: { isRight: 'right', isAdd: 'add', category: node.value.id } })
  }
  if (value == 'documentManage') {
    isShowDialog.value = true
  }
}

// 分享链接
const handleShare = async (type, id) => {
  let suffix = `&spaceid=${spaceid.value}&spacename=${spacename.value}&isRight=right`

  if (type == 'd') {
    await getForumInfo(id).then(async res => {
      if (res.code === 1000) {
        let url = 'http://10.4.150.55:8013' + '/' + res.data.body
        shareLink.value = 'http://192.168.94.89:8012/onlinePreview?url=' + encodeURIComponent(Base64.encode(url))
      }
    })
  }
  if (type === 'w') {
    shareLink.value = process.env.VUE_APP_SHARE_URL + '/#/detail?wid=' + id + suffix
  }
  if (type === 'e') {
    shareLink.value = process.env.VUE_APP_SHARE_URL + '/#/excel?eid=' + id + suffix
  }
  if (type === 'a') {
    shareLink.value = process.env.VUE_APP_SHARE_URL + '/#/detail?wid=' + id + suffix
  }
  if (type === 'm') {
    shareLink.value = process.env.VUE_APP_SHARE_URL + '/#/mindMap?mid=' + id + suffix
  }
  if (type === 'p') {
    shareLink.value = process.env.VUE_APP_SHARE_URL + '/#/FramePPT?pid=' + id + '&isRight=right'
  }

  // 在nextTick内创建Clipboard对象和绑定事件
  await nextTick(() => {
    if (clipboard.value) {
      clipboard.value.destroy() // 销毁之前的Clipboard对象
    }
    clipboard.value = new Clipboard('.copy')
    clipboard.value.on('success', e => {
      ElMessage.success('分享链接已复制到剪贴板')
      clipboard.value.destroy() // 在事件处理之后销毁Clipboard对象
    })
    clipboard.value.on('error', e => {
      ElMessage.error('该浏览器不支持自动复制')
      clipboard.value.destroy() // 在事件处理之后销毁Clipboard对象
    })
  })
}

// 跳转至文章详情页
const handleOpen = async (type, id) => {
  if (type == 'a' || type == 'w') {
    router.push({ name: 'detail', query: { wid: id, spaceid: spaceid.value, spacename: spacename.value, isRight: 'right' } })
  }
  if (type == 'e') {
    router.push({ name: 'excel', query: { eid: id, spaceid: spaceid.value, spacename: spacename.value, isRight: 'right' } })
  }
  if (type == 'm') {
    loadingInstance = ElLoading.service({
      lock: true,
      text: '正在加载文件，请稍后...',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    await getMindMapDataApi(id)
    router.push({ name: 'mindMap', query: { mid: id, spaceid: spaceid.value, spacename: spacename.value, isRight: 'right' } })
  }
  if (type == 'p') {
    router.push({ path: 'ppt', query: { pid: id, spaceid: spaceid.value, spacename: spacename.value, isRight: 'right' } })
  }
  if (type == 'd') {
    getPreview(id)
  }
}

// 文章编辑
const handleEdit = async (type, qs) => {
  if (type == 'a') {
    router.push({ name: 'md', query: { tid: qs.id, type: 'edit', isRight: 'right', typeof: qs.type, category: qs.category } })
  }
  if (type == 'w') {
    router.push({ name: 'md', query: { mid: qs.id, type: 'edit', isRight: 'right', typeof: qs.type, category: qs.category } })
  }
  if (type == 'e') {
    router.push({ name: 'excel', query: { eid: qs.id, isRight: 'right' } })
  }
  if (type == 'm') {
    loadingInstance = ElLoading.service({
      lock: true,
      text: '正在加载文件，请稍后...',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    await getMindMapDataApi(qs.id)
    router.push({ name: 'mindMap', query: { mid: qs.id, isRight: 'right' } })
  }
  if (type == 'd') {
    ElMessage.warning('预览文件，不支持编辑！')
    return false
  }
}

// 回复响应
const answerHandle = (type, id) => {
  if (type == 'd') {
    ElMessage.warning('预览文件，不支持评论！')
    return false
  }
  if (type === 'e') {
    ElMessage.warning('表格类型文件，不支持评论！')
    return false
  }
  router.push({ name: 'detail', query: { wid: id, status: 'answer' } })
}

// 下载文件
const handleDownload = async (id, type) => {
  downloadFile.judgeType(id, type)
}

// 查看预览文件
const getPreview = async id => {
  await getForumInfo(id).then(res => {
    // let url = sessionStorage.getItem('COMMUNITY_URL') + '/' + res.data.body
    let url = 'http://10.4.150.55:8013' + '/' + res.data.body
    window.open('http://192.168.94.89:8012/onlinePreview?url=' + encodeURIComponent(Base64.encode(url)))
  })
}

const handleDelete = (title, id) => {
  // 二次确认删除
  ElMessageBox.confirm(`确定要删除【${title}】这个文件吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true
  })
    .then(() => {
      deleteForum(id).then(res => {
        if (res.code === 1000) {
          ElMessage.success('删除成功')
          router.push({ name: 'subbooks', params: { wRefresh: true } })
          goRefresh()
        } else {
          ElMessage.error(res.msg || '删除失败')
        }
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      })
    })
}

// 获取思维导图数据
const getMindMapDataApi = id => {
  getForumInfo(id).then(res => {
    ElMessage({
      message: '获取成功',
      type: 'success',
      duration: 1000
    })
    bus.emit('setData', JSON.parse(res.data.body))
    bus.emit('execCommand', ['UNEXPAND_TO_LEVEL', 2]) // 默认展开到第二层级
    loadingInstance.close()
  })
}

const closeSaveDialog = res => {
  isShowDialog.value = res
}

onBeforeRouteLeave((to, from, next) => {
  if (to.path === '/books') {
    datalist.value = []
    node.value.label = ''
  }
  if (from.name === 'subbooks' && !to.query.isRight) {
    sessionStorage.removeItem('node')
  }
  next()
})

watch(
  () => isShowDialog.value,
  () => {
    getNodeList()
  }
)

// 获取分类列表
const getNodeList = () => {
  getCategorysInfo(spaceid.value).then(res => {
    treeData.value = judgeNodeType(res.data)
  })
}

onMounted(() => {})
onBeforeUnmount(() => {})
</script>

<style lang="scss" scoped>
.list-wrap {
  min-height: 99vh;
}
.is-Folder {
  margin-right: 3px;
}

.el-container {
  padding: 0px;
}

.dialog-footer {
  float: left;
}

.infinite-list {
  padding: 0;
  margin: 0;
  list-style: none;
  max-height: 80vh;
  &::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }

  li {
    margin: 10px 0 !important;
  }
  .title-wrap {
    cursor: pointer;
    padding: 14px;
    padding-bottom: 0px;
    width: 50%;
    h3 {
      margin-bottom: 10px;
    }
    p {
      color: #8a919f;
      font-size: 13px;
      line-height: 22px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      // display: -webkit-box; /* 将元素显示为一个弹性盒子 */
      // -webkit-line-clamp: 2; /* 限制显示的行数为2行 */
      // -webkit-box-orient: vertical; /* 将元素中的文本竖向排列 */
      // overflow: hidden; /* 隐藏超出部分 */
      // text-overflow: ellipsis; /* 超出部分用省略号表示 */
    }
  }

  .itemCard {
    position: relative;

    .ribbon {
      background-color: #1890ff;
      overflow: hidden;
      white-space: nowrap;
      position: absolute;
      right: -50px; // 根据实际调整即可
      top: 10px; // 根据实际调整即可
      transform: rotate(45deg);
      box-shadow: 0 0 10px #888;
      opacity: 0.8;

      span {
        color: #fff;
        padding: 3px 50px;
        display: block;
      }
    }
  }

  h3:hover {
    cursor: pointer;
  }
}

.title {
  color: #2c3e50;
}

.title:hover {
  cursor: pointer;
}

.subscript {
  margin-top: 13px;
  margin-bottom: 10px;
  line-height: 15px;
  display: flex;
  align-items: center;

  .el-button {
    width: 50px;
    margin-right: 25px;
  }
}

.user-avator {
  margin-left: 14px;
}

.user-avator img {
  display: block;
  width: 25px;
  height: 25px;
  border-radius: 50%;
}

.user-name {
  font-size: 14px;
  color: #999;
}

.time {
  font-size: 12px;
  color: #999;
}

.statistics {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.statistics span {
  // margin-right: 5px;
  font-size: 14px;
  color: #999;
}
</style>
