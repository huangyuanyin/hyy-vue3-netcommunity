<template>
  <div class="sidebar" v-if="!props.isFold">
    <el-row class="sidebar_row">
      <el-col :span="18" :offset="1" style="margin-left:0px">
        <span class="title">{{ spacename }}</span>
      </el-col>
      <el-col :span="3" style="text-align:end;max-width: none;">
        <el-dropdown trigger="click" @command="handleCommand">
          <el-button text>
            <el-icon size="large">
              <CirclePlus />
            </el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="root">
                <svg-icon iconName="icon-a-wenjianjiawenjian" className="is-Folder" />新建分组
              </el-dropdown-item>
              <el-dropdown-item command="word" disabled>
                新建文档
              </el-dropdown-item>
              <el-dropdown-item command="excel" disabled>新建Excel</el-dropdown-item>
              <el-dropdown-item command="excel" disabled>新建白板</el-dropdown-item>
              <el-dropdown-item command="mind" disabled>新建思维导图</el-dropdown-item>
              <el-dropdown-item command="ppt" disabled>新建PPT</el-dropdown-item>
              <el-dropdown-item command="process" disabled>新建流程图</el-dropdown-item>
              <el-dropdown-item command="template" disabled>从模板新建</el-dropdown-item>
              <el-dropdown-item command="upload" disabled>导入</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
    </el-row>
    <div>
      <el-tree
        :data="treeData"
        ref="treeRef"
        class="filter-tree"
        highlight-current
        draggable
        accordion
        @current-change="handleNodeClick"
        @node-drop="handleDrop"
        :allow-drop="allowDrop"
        node-key="id"
        :props="defaultProps"
        :default-expanded-keys="defaultExpandIds"
        :current-node-key="curTreeId"
        v-loading="loadTreeData"
        element-loading-text="数据加载中..."
      >
        <template #default="{ node, data }">
          <div class="custom-tree-node">
            <div class="content">
              <svg-icon iconName="icon-a-wenjianjiawenjian" v-if="data.type === 'l' && data.isFolder" className="is-Folder" />
              <svg-icon iconName="icon-Document" v-if="data.type === 'l' && !data.isFolder" className="is-Folder" />
              <svg-icon iconName="icon-word" v-if="data.type === 'a'" className="is-Folder"></svg-icon>
              <svg-icon iconName="icon-file-markdown-fill" v-if="data.type === 'w'" className="is-Folder"></svg-icon>
              <svg-icon iconName="icon-excel" v-if="data.type === 'e'" className="is-Folder"></svg-icon>
              <svg-icon iconName="icon-icon__liuchengtu" v-if="data.type === 'm'" className="is-Folder"></svg-icon>
              <svg-icon iconName="icon-ppt" v-if="data.type === 'p'" className="is-Folder"></svg-icon>
              <span class="labelStyle" :title="node.label">{{ node.label }}</span>
            </div>
            <div class="buttonStyle" ref="buttonStyle">
              <!-- +号 -->
              <el-dropdown @command="handleNewInstruction" trigger="hover" @visible-change="showIcon" v-if="data.type === 'l'">
                <span class="left-button">
                  <svg-icon iconName="icon-top"></svg-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item :command="'add' + ',' + data.id">
                      <svg-icon iconName="icon-Document" className="is-Folder" />新建分组
                    </el-dropdown-item>
                    <el-dropdown-item :command="'article' + ',' + data.id">
                      <svg-icon iconName="icon-word" className="is-Folder" />新建文档
                    </el-dropdown-item>
                    <el-dropdown-item :command="'excel' + ',' + data.id">
                      <svg-icon iconName="icon-excel" className="is-Folder" />新建Excel
                    </el-dropdown-item>
                    <el-dropdown-item :command="'mindmap' + ',' + data.id">
                      <svg-icon iconName="icon-icon__liuchengtu" className="is-Folder" />新建思维导图
                    </el-dropdown-item>
                    <el-dropdown-item :command="'ppt' + ',' + data.id">
                      <svg-icon iconName="icon-ppt" className="is-Folder" />新建PPT
                    </el-dropdown-item>
                    <el-dropdown-item :command="'process' + ',' + data.id" disabled>新建流程图</el-dropdown-item>
                    <el-dropdown-item :command="'process' + ',' + data.id" disabled>新建白板</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <!-- 更多 -->
              <el-dropdown @command="handleRoot" trigger="hover" @visible-change="showIcon">
                <span class="left-button_more">
                  <svg-icon iconName="icon-gengduo"></svg-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      :command="'edit' + ',' + data.id + ',' + data.label + ',' + data.type + ',' + data.articleId + ',' + data.author"
                    >
                      <svg-icon iconName="icon-bianpinghuatubiaosheji-" className="is-Folder" />编辑
                    </el-dropdown-item>
                    <el-dropdown-item :command="'share' + ',' + data.articleId + ',' + data.type" v-if="data.type !== 'l'">
                      <div class="copy" :data-clipboard-text="shareLink">
                        <svg-icon iconName="icon-fenxiang1" className="is-Folder" />分享
                      </div>
                    </el-dropdown-item>
                    <el-dropdown-item :command="'remove' + ',' + data.id + ',' + data.type + ',' + data.author">
                      <svg-icon iconName="icon-shanchu1" className="is-Folder" />删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </template>
      </el-tree>
    </div>
    <el-dialog title="新建分组/子分组" v-model="dialogNode" draggable width="600px">
      <el-form :model="form" ref="formRef" :rules="formRules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input @keydown.enter="handleAdd" v-model="form.name" maxlength="200" placeholder="分组名称" show-word-limit type="text" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogNode = false">取 消</el-button>
          <el-button type="primary" @click="handleAdd">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="编辑分组/子分组" v-model="dialogEdit" draggable width="600px">
      <el-form :model="form" ref="formRef" :rules="formRules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input @keydown.enter="handleEdit" v-model="form.name" maxlength="200" placeholder="分组名称" show-word-limit type="text" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogEdit = false">取 消</el-button>
          <el-button type="primary" @click="handleEdit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch, inject, nextTick, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { getCategorysInfo, addCategorys, updateCategorys, deleteCategorys } from '@/api/category.js'
import { addForum, updateForum, getForumInfo } from '@/api/forum.js'
// import exampleData from 'simple-mind-map/example/exampleData';
import bus from '@/utils/bus.js'
import Clipboard from 'clipboard'

const props = defineProps({
  isFold: {
    type: Boolean,
    default: false
  }
})

const reload = inject('reload')
const store = useStore()
const route = useRoute()
const router = useRouter()
const loadingInstance = ref('')
const shareLink = ref('') // 分享链接
const spacename = computed(() => route.query.spacename || sessionStorage.getItem('spacename'))
const spaceid = computed(() => route.query.spaceid || sessionStorage.getItem('spaceid'))
const spacePublic = computed(() => sessionStorage.getItem('spacePublic'))
const isRefresh = computed(() => store.getters.isRefresh)
// const defaultExpandIds = ref([]) // 这里存放 要默认展开的节点 id
const defaultExpandIds = computed(() => {
  // 这里存放 要默认展开的节点 id
  return store.state.defaultExpandIds
})
// const curTreeId = ref(null) // 存放 高亮的节点ID
const curTreeId = computed(() => {
  // 存放 高亮的节点ID
  return store.state.curTreeId
})
const curTreeData = ref({}) // 存放 已点击的节点ID
// 对话框
const dialogNode = ref(false)
const loadTreeData = ref(false)
// 对话框 编辑
const dialogEdit = ref(false)
// 节点数据 - 全部
const treeData = ref([])
const treeRef = ref(null)
// 节点数据 - 单个
const nodeData = ref({})
// 父节点ID
const parent_id = ref('')
// 编辑节点
const edit_id = ref('')
// 配置选项
const defaultProps = {
  children: 'children',
  label: 'label',
  value: 'id'
}
const form = ref({
  name: ''
})
const formRef = ref(null)
// 表单校验
const formRules = reactive({
  name: [{ required: true, message: '请输入分组名称', trigger: 'blur' }]
})
// 思维导图初始化数据
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

// 获取节点数据
const getNodeList = async () => {
  loadTreeData.value = true
  let res = await getCategorysInfo(spaceid.value)
  loadTreeData.value = false
  if (res.code === 1000) {
    res.data.forEach(item => {
      item.isFolder = true
    })
  }
  treeData.value = res.data
}

// 树节点展开
const handleNodeExpand = data => {
  store.state.defaultExpandIds = []
  // 保存当前展开的节点
  store.state.defaultExpandIds.push(data)
}

onMounted(async () => {
  await judgeGetNodeList()
  if (curTreeId.value) {
    await handleNodeClick({
      label: store.state.curTreeName || '',
      id: curTreeId.value
    })
  }
})

watch(
  () => route.params.notGetNodeList,
  () => {
    judgeGetNodeList()
  }
)

// 监听整个tree数据 来调用节点高亮方法
watch(
  () => treeData.value,
  () => {
    nextTick(() => {
      treeRef.value.setCurrentKey(curTreeId.value)
    })
  }
)

watchEffect(() => {
  if (isRefresh.value) {
    getNodeList()
    const params = {
      public: 1
    }
    getCategorys(params).then(res => {
      id === 0 ? (mybooks.value = res.data) : (pubooks.value = res.data)
    })
    store.commit('books/SET_REFRESH', false)
    let deleteNode = JSON.parse(sessionStorage.getItem('deleteNode'))
    store.commit('changeCurTreeId', deleteNode)
    store.state.defaultExpandIds = []
    // 保存当前展开的节点
    store.state.defaultExpandIds.push(deleteNode.id)
    handleNodeClick({
      label: deleteNode.label,
      id: deleteNode.id
    })
  }
})

watchEffect(async () => {
  const forumId = ref(route.query.wid || route.query.eid || route.query.mid || route.query.pid)
  const groupid = ref(route.query.groupid)
  if (forumId.value && !route.params.isNoClick && !route.query.isRight) {
    await sessionStorage.setItem('spaceid', route.query.spaceid)
    await sessionStorage.setItem('spacename', route.query.spacename)
    let res = await getForumInfo(forumId.value)
    if (res.code === 1000) {
      await sessionStorage.setItem('category', res.data.category)
      await store.commit('changeCurTreeId', res.data.category)
      await handleNodeClick({
        label: res.data.title,
        id: res.data.category
      })
      await getNodeList()
    }
  } else if (groupid.value && !route.params.isNoClick && !route.query.isRight) {
    await sessionStorage.setItem('spaceid', route.query.spaceid)
    await sessionStorage.setItem('spacename', route.query.spacename)
    await store.commit('changeCurTreeId', groupid.value)
    await handleNodeClick({
      label: route.query.groupname,
      id: groupid.value
    })
    await getNodeList()
  }
})

// 根据参数判断是否调用获取节点数据API
const judgeGetNodeList = () => {
  if (route.params && route.params.notGetNodeList) {
    return
  } else {
    getNodeList()
  }
}

// 指令事件
const handleCommand = value => {
  if (value == 'root') {
    form.value.name = ''
    parent_id.value = spaceid.value
    dialogNode.value = true
  }
}

// 分组指令
const handleRoot = command => {
  let tmp = command.split(',')
  if (tmp[0] === 'add') {
    parent_id.value = tmp[1]
    dialogNode.value = true
  }
  if (tmp[0] === 'edit') {
    if (tmp[3] !== 'l' && tmp[5] !== sessionStorage.getItem('username')) {
      return ElMessage.error('非作者本人无修改权限')
    }
    edit_id.value = tmp[1]
    form.value.name = tmp[2]
    nodeData.value = {
      type: tmp[3],
      articleId: tmp[4]
    }
    dialogEdit.value = true
  }
  if (tmp[0] === 'share') {
    switch (tmp[2]) {
      case 'w':
        nextTick(() => {
          shareLink.value =
            process.env.VUE_APP_SHARE_URL + '/#/detail?spaceid=' + spaceid.value + '&spacename=' + spacename.value + '&wid=' + tmp[1]
        })
        break
      case 'e':
        nextTick(() => {
          shareLink.value =
            process.env.VUE_APP_SHARE_URL + '/#/excel?spaceid=' + spaceid.value + '&spacename=' + spacename.value + '&eid=' + tmp[1]
        })
        break
      case 'a':
        nextTick(() => {
          shareLink.value =
            process.env.VUE_APP_SHARE_URL + '/#/detail?spaceid=' + spaceid.value + '&spacename=' + spacename.value + '&wid=' + tmp[1]
        })
        break
      case 'm':
        nextTick(() => {
          shareLink.value =
            process.env.VUE_APP_SHARE_URL + '/#/mindMap?spaceid=' + spaceid.value + '&spacename=' + spacename.value + '&mid=' + tmp[1]
        })
        break
      case 'p':
        nextTick(() => {
          shareLink.value =
            process.env.VUE_APP_SHARE_URL + '/#/FramePPT?spaceid=' + spaceid.value + '&spacename=' + spacename.value + '&pid=' + tmp[1]
        })
        break
    }
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
  if (tmp[0] === 'remove') {
    console.log(`output->tmp`, tmp)
    if (tmp[2] !== 'l' && tmp[3] !== sessionStorage.getItem('username')) {
      return ElMessage.error('非作者本人无删除权限')
    }
    nodeData.value = tmp[2]
    deleteApi(tmp[1])
  }
}

// 新建指令 => +号按钮
const handleNewInstruction = value => {
  let [type, categoryId] = value.split(',')
  if (type === 'add') {
    form.value.name = ''
    parent_id.value = categoryId
    dialogNode.value = true
  }
  if (type == 'article') {
    addDoc(categoryId) // 新建文档操作
  }
  if (type == 'excel') {
    router.push({
      path: '/excel',
      query: {
        category: categoryId,
        isAdd: 'add'
      }
    })
  }
  if (type == 'word') {
    router.push({
      path: '/md',
      query: {
        category: categoryId,
        isAdd: 'add'
      }
    })
  }
  if (type == 'mindmap') {
    bus.emit('setData', exampleData) // 初始化思维导图数据
    router.push({
      path: '/mindMap',
      query: {
        category: categoryId,
        isAdd: 'add'
      }
    })
  }
  if (type == 'ppt') {
    router.push({
      path: '/ppt',
      query: {
        category: categoryId,
        isAdd: 'add'
      }
    })
  }
}

const addDoc = categoryId => {
  let params = {
    name: '无标题文档',
    parent_category: categoryId,
    type: 'a',
    description: '',
    author: sessionStorage.getItem('username'),
    public: spacePublic.value
  }
  sessionStorage.setItem('userAuthor', sessionStorage.getItem('username'))
  // 新增节点
  addCategorys(params).then(res => {
    if (res.code == 1000) {
      store.commit('changeCurTreeId', res.data) // 定位
      reload()
      // 新增文档
      const docForm = {
        category: res.data,
        title: '无标题文档',
        description: '',
        tags: [],
        type: 'a',
        body: '',
        author: sessionStorage.getItem('username')
      }
      addForum(docForm).then(res => {
        if (res.code === 1000) {
          router.push({
            path: '/md',
            query: {
              category: categoryId,
              isAdd: 'add',
              tid: res.data
            }
          })
        }
      })
    }
  })
}

// 监听下拉菜单的显示/隐藏
const showIcon = hidden => {
  if (hidden === true) {
    // 给document.getElementById('buttonStyle')添加样式
    return
  }
}

// 对话框关闭事件
const dialogClose = () => {
  // formRef.value.resetFields()
  form.name = ''
  dialogNode.value = false
  dialogEdit.value = false
}

// 新增分组
const handleAdd = () => {
  formRef.value.validate(valid => {
    if (!valid) return
    let params = {
      name: form.value.name,
      parent_category: parent_id.value,
      author: sessionStorage.getItem('username'),
      public: sessionStorage.getItem('spacePublic')
    }
    addCategorys(params).then(res => {
      ElMessage({
        message: '新增成功！',
        type: 'success'
      })
      dialogClose()
      getNodeList()
      curTreeId.value = res.data
      store.commit('changeCurTreeId', res.data)
      // handleNodeExpand(res.data)
      handleNodeClick({
        label: form.value.name,
        id: res.data
      })
    })
  })
}

// 节点编辑 - 保存
const handleEdit = () => {
  formRef.value.validate(valid => {
    if (!valid) return
    judegeGetCategory()
  })
}

// 判断节点类型走 不同编辑流程
const judegeGetCategory = () => {
  if (nodeData.value.type === 'l') {
    getUpdateCategorysApi(edit_id.value, form.value)
  } else {
    getForumInfo(nodeData.value.articleId).then(res => {
      if (res.code === 1000) {
        const nodeForm = {
          type: nodeData.value.type,
          title: form.value.name,
          category: res.data.category,
          tags: res.data.tags,
          body: res.data.body,
          modifier: sessionStorage.getItem('username')
        }
        updateForum(nodeData.value.articleId, nodeForm).then(res => {
          if (res.code === 1000) {
            dialogClose()
            const title = { name: nodeForm.title }
            getUpdateCategorysApi(edit_id.value, title)
          }
        })
      }
    })
  }
}

// 调用 更新节点API
const getUpdateCategorysApi = (id, name) => {
  updateCategorys(id, name).then(async res => {
    await store.commit('books/SET_DOC_TITLE', name.name)
    ElMessage({
      message: '更新成功！',
      type: 'success'
    })
    dialogClose()
    getNodeList()
    curTreeId.value = curTreeData.value.id
    store.commit('changeCurTreeId', curTreeData.value.id)
    if (curTreeData.value.id == id) {
      // reload() 刷新页面用来更新title，此处需优化
      if (['a', 'w', 'p'].includes(curTreeData.value.type)) {
        reload()
      }
      handleNodeClick({
        label: name.name,
        id: id
      })
    }
    handleNodeExpand(curTreeData.value.id) // 依旧展开点击的节点
  })
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
      deleteCategorys(id).then(res => {
        if (res.code === 1000) {
          ElMessage.success('删除成功')
          getNodeList()
          if (id == curTreeData.value.id) {
            store.commit('changeCurTreeId', res.data)
            store.state.defaultExpandIds = []
            // 保存当前展开的节点
            store.state.defaultExpandIds.push(res.data.id)
            router.push({ name: 'subbooks', params: { wRefresh: true } })
            handleNodeClick({
              label: res.data.label,
              id: res.data.id
            })
          } else {
            store.commit('changeCurTreeId', { label: curTreeData.value.label, id: curTreeData.value.id })
            store.state.defaultExpandIds = []
            store.state.defaultExpandIds.push(curTreeData.value.id)
            handleNodeClick({
              label: curTreeData.value.label,
              id: curTreeData.value.id
            })
          }
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

// 节点点击事件
const handleNodeClick = async node => {
  console.log(`output->node`, node)
  curTreeData.value = node
  let nodedata = {
    label: node.label,
    id: node.id
  }
  nodeData.value = node
  await sessionStorage.setItem('node', JSON.stringify(nodedata))
  await store.commit('books/SET_NODE_DATA', node)
  await sessionStorage.setItem('curTreeId', node.id)
  await sessionStorage.setItem('defaultExpandIds', [node.id])
  store.commit('saveCurTreeName', node.label)
  // 判断节点类型,跳转不同路径 ('a', '文章'),('w', 'Word'), ('e', 'Excel'),('m', '思维导图'), ('f', '流程图'), ('p', 'PPT'),('l', '分组'),
  switch (node.type) {
    case 'l':
      router.push({
        name: 'subbooks',
        query: { spaceid: spaceid.value, spacename: spacename.value, groupid: node.id, groupname: node.label },
        params: { wRefresh: true, isNoClick: true }
      })
      break
    case 'w':
      router.push({
        name: 'detail',
        query: { spaceid: spaceid.value, spacename: spacename.value, wid: node.articleId },
        params: { isNoClick: true }
      })
      break
    case 'e':
      router.push({
        path: '/excel',
        query: { spaceid: spaceid.value, spacename: spacename.value, eid: node.articleId },
        params: { isNoClick: true }
      })
      break
    case 'a':
      router.push({
        name: 'detail',
        query: { spaceid: spaceid.value, spacename: spacename.value, wid: node.articleId },
        params: { isNoClick: true }
      })
      break
    case 'm':
      if (node.articleId == route.query.mid) {
        return true
      }
      loadingInstance.value = ElLoading.service({
        lock: true,
        text: '正在加载文件，请稍后...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      await getMindMapDataApi(node.articleId)
      router.push({
        name: 'mindMap',
        query: { spaceid: spaceid.value, spacename: spacename.value, mid: node.articleId },
        params: { isNoClick: true }
      })
      break
    case 'p':
      router.push({
        name: 'FramePPT',
        query: { spaceid: spaceid.value, spacename: spacename.value, pid: node.articleId },
        params: { isNoClick: true }
      })
      break
  }
}

// 获取思维导图数据
const getMindMapDataApi = id => {
  getForumInfo(id).then(res => {
    bus.emit('setData', JSON.parse(res.data.body))
    bus.emit('execCommand', ['UNEXPAND_TO_LEVEL', 2]) // 默认展开到第二层级
    ElMessage({
      message: '获取成功',
      type: 'success',
      duration: 1000
    })
    loadingInstance.value.close()
  })
}

const allowDrop = (draggingNode, dropNode, type) => {
  if (dropNode.data.type !== 'l') {
    return false
  } else {
    return true
  }
}

// 节点拖拽
// 拖拽完成时触发的事件  参数依次为：被拖拽节点、结束拖拽时最后进入的节点、被拖拽节点的放置位置（before、after、inner）、event
// 注意：目标节点是已经移动完之后的节点
const handleDrop = (draggingNode, dropNode, dropType, ev) => {
  // 定义一个空数组用于存放需要持久化到数据库的节点
  var paramData = {}
  // 当拖拽类型不为inner,说明只是在现有的节点间移动，只需要寻找目标节点的父ID，获取其对象以及所有的子节点,data为目标节点的父节点;
  // 否则，当拖拽类型为inner,说明拖拽节点成为了目标节点的子节点,只需要获取目标节点对象即可
  // 目标节点的ID
  var dropNodeId = dropNode.level == 1 && dropType != 'inner' ? Number(spaceid.value) : dropNode.data.id
  // 被拖拽节点的ID
  var draggingNodeId = draggingNode.data.id
  // 被拖拽节点的name
  var draggingNodeName = draggingNode.data.label
  paramData = {
    name: draggingNodeName, // 被拖拽节点的name
    parent_category: dropNodeId // 目标节点的ID
  }
  updateCategorys(draggingNodeId, paramData).then(res => {
    console.log(res)
    if (res.code == 1000) {
      ElMessage.success('更新成功')
      dialogClose()
      getNodeList()
      paramData = {}
    } else {
      ElMessage.error('更新失败')
    }
  })
}

watch(
  () => dialogNode.value,
  () => {
    if (dialogNode.value == true) {
      bus.emit('startTextEdit')
    } else {
      bus.emit('endTextEdit')
    }
  }
)
watch(
  () => dialogEdit.value,
  () => {
    if (dialogEdit.value == true) {
      bus.emit('startTextEdit')
    } else {
      bus.emit('endTextEdit')
    }
  }
)
</script>

<style lang="scss" scoped>
.sidebar {
  display: block;
  /* position: absolute; */
  left: 0;
  top: 3%;
  bottom: 0;
  overflow-y: scroll;
  min-width: 270px;
  width: 100%;
  background-color: #ffffff;
  .sidebar_row {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0px 0 10px;
  }
}

.title {
  font-weight: 700;
  font-size: 17px;
  color: #262626;
}

.filter-tree {
  margin-top: 15px;
  width: 100%;
}

.left-button {
  margin-right: 15px;
  /* display: none; */
}

.left-button_more {
  /* display: none; */
}

.buttonStyle {
  display: none;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 15px;
  padding-right: 18px;
  overflow: hidden;
  font-family: '思源宋体 Medium';
  position: relative;
  height: 100%;
}

.custom-tree-node:hover .labelStyle {
  max-width: 65%;
}

.custom-tree-node:hover .buttonStyle {
  display: flex;
}

.content {
  display: flex;
  align-items: center;
  overflow: hidden;
  margin-right: 1px;
}
.labelStyle {
  max-width: 72%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  position: absolute;
  left: 20px;
  line-height: 24px;
}

.is-Folder {
  margin-right: 3px;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

/* .sidebar-el-menu:not(.el-menu--collapse) {
    width: 280px;
} */
.sidebar > ul {
  height: 100%;
}
</style>
