<template>
  <div class="sidebar">
    <el-row style="margin-top: 10px">
      <el-col :span="18" :offset="1">
        <span class="title">{{ spacename }}</span>
      </el-col>
      <el-col :span="3">
        <el-dropdown trigger="click" @command="handleCommand">
          <el-button text>
            <el-icon size="large">
              <CirclePlus />
            </el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="root">新建分组</el-dropdown-item>
              <el-dropdown-item command="word" disabled>新建文档</el-dropdown-item>
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
      <el-tree :data="treeData" ref="treeRef" class="filter-tree" highlight-current draggable accordion
        @current-change="handleNodeClick" @node-drop="handleDrop" node-key="id" :props="defaultProps"
        :default-expanded-keys="defaultExpandIds" :current-node-key="curTreeId">
        <template #default="{ node, data }">
          <div class="custom-tree-node">
            <div class="content">
              <el-icon class="is-Folder" v-if="data.type === 'l'">
                <Folder />
              </el-icon>
              <el-icon class="is-Folder" v-else>
                <Document />
              </el-icon>
              <span class="labelStyle" :title="node.label">{{ node.label }}</span>
            </div>
            <div class="buttonStyle">
              <!-- +号 -->
              <el-dropdown @command="handleNewInstruction" trigger="hover" @visible-change="showIcon">
                <span class="left-button" ref="leftButton">
                  <el-icon>
                    <Plus />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item :command="'add' + ',' + data.id">新建分组</el-dropdown-item>
                    <el-dropdown-item :command="'article' + ',' + data.id">新建文档</el-dropdown-item>
                    <el-dropdown-item :command="'excel' + ',' + data.id">新建Excel</el-dropdown-item>
                    <el-dropdown-item :command="'mindmap' + ',' + data.id">新建思维导图</el-dropdown-item>
                    <el-dropdown-item :command="'process' + ',' + data.id" disabled>新建流程图</el-dropdown-item>
                    <el-dropdown-item :command="'ppt' + ',' + data.id" disabled>新建PPT</el-dropdown-item>
                    <el-dropdown-item :command="'process' + ',' + data.id" disabled>新建白板</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <!-- 更多 -->
              <el-dropdown @command="handleRoot" trigger="click">
                <span>
                  <el-icon>
                    <more-filled />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <!-- <el-dropdown-item :command="'add' + ',' + data.id">新建子分组</el-dropdown-item> -->
                    <el-dropdown-item :command="'edit' + ',' + data.id + ',' + data.label">编辑</el-dropdown-item>
                    <el-dropdown-item :command="'remove' + ',' + data.id">删除</el-dropdown-item>
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
          <el-input v-model="form.name" maxlength="30" placeholder="分组名称" show-word-limit type="text" />
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
          <el-input v-model="form.name" maxlength="10" placeholder="分组名称" show-word-limit type="text" />
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
import { ref, computed, reactive, onMounted, watch, inject, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElMessageBox, ElLoading } from "element-plus";
import { getCategorysInfo, addCategorys, updateCategorys, deleteCategorys } from '@/api/category.js'
import { updateForum, getForumInfo } from '@/api/forum.js'
// import exampleData from 'simple-mind-map/example/exampleData';
import bus from "@/utils/bus.js"

const reload = inject('reload')
const store = useStore()
const route = useRoute()
const router = useRouter()
const loadingInstance = ref('')
const spacename = computed(() => sessionStorage.getItem('spacename'));
const spaceid = computed(() => sessionStorage.getItem('spaceid'));
const defaultExpandIds = ref([]) // 这里存放 要默认展开的节点 id
const curTreeId = ref(null) // 存放 高亮的节点ID
// 对话框
const dialogNode = ref(false)
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
const leftButton = ref(null)
const form = ref({
  name: ''
})
const formRef = ref(null);
// 表单校验
const formRules = reactive({
  name: [{ required: true, message: '请输入分组名称', trigger: 'blur' }]
})
// 思维导图初始化数据
const exampleData = ({ "root": { "data": { "text": "中心主题", "expand": true, "isActive": false }, "children": [] }, "theme": { "template": "classic4", "config": {} }, "layout": "logicalStructure", "view": { "transform": { "scaleX": 1, "scaleY": 1, "shear": 0, "rotate": 0, "translateX": 0, "translateY": 0, "originX": 0, "originY": 0, "a": 1, "b": 0, "c": 0, "d": 1, "e": 0, "f": 0 }, "state": { "scale": 1, "x": 0, "y": 0, "sx": -55, "sy": -65 } } })

// 获取节点数据
const getNodeList = () => {
  getCategorysInfo(spaceid.value).then((res) => {
    treeData.value = res.data
  })
}

// 树节点展开
const handleNodeExpand = (data) => {
  defaultExpandIds.value = []
  // 保存当前展开的节点
  defaultExpandIds.value.push(data)
}

onMounted(() => {
  judgeGetNodeList()
})

watch(() => route.params.notGetNodeList, () => {
  judgeGetNodeList()
})

// 监听整个tree数据 来调用节点高亮方法
watch(() => treeData.value, () => {
  nextTick(() => {
    treeRef.value.setCurrentKey(curTreeId.value)
  })
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
const handleCommand = (value) => {
  if (value == 'root') {
    form.value.name = ''
    parent_id.value = spaceid.value
    dialogNode.value = true
  }
}

// 分组指令
const handleRoot = (command) => {
  let tmp = command.split(',')
  if (tmp[0] === 'add') {
    parent_id.value = tmp[1]
    dialogNode.value = true
  }
  if (tmp[0] === 'edit') {
    edit_id.value = tmp[1]
    form.value.name = tmp[2]
    dialogEdit.value = true
  }
  if (tmp[0] === 'remove') {
    deleteApi(tmp[1])
  }
}

// 新建指令 => +号按钮
const handleNewInstruction = (value) => {
  let tmp = value.split(',')
  if (tmp[0] === 'add') {
    form.value.name = ''
    parent_id.value = tmp[1]
    dialogNode.value = true
  }
  if (tmp[0] == 'article') {
    router.push({
      path: '/md',
      query: {
        category: tmp[1],
        isAdd: "add"
      }
    })
  }
  if (tmp[0] == 'excel') {
    router.push({
      path: '/excel',
      query: {
        category: tmp[1],
        isAdd: "add"
      }
    })
  }
  if (tmp[0] == 'word') {
    router.push({
      path: '/md',
      query: {
        category: tmp[1],
        isAdd: "add"
      }
    })
  }
  if (tmp[0] == 'mindmap') {
    bus.emit('setData', exampleData); // 初始化思维导图数据
    router.push({
      path: '/mindMap',
      query: {
        category: tmp[1],
        isAdd: "add"
      }
    })
  }
}

// 监听下拉菜单的显示/隐藏
const showIcon = (hidden) => {
  if (hidden === true) {
    leftButton.value.style.display = "block"
    return
  }
  leftButton.value.style.display = ""
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
  formRef.value.validate((valid) => {
    if (!valid) return
    let params = {
      name: form.value.name,
      parent_category: parent_id.value
    }
    addCategorys(params).then((res) => {
      ElMessage({
        message: '新增成功！',
        type: 'success',
      })
      dialogClose()
      getNodeList()
      curTreeId.value = res.data
      handleNodeExpand(res.data)
    })
  })
}

// 节点编辑 - 保存
const handleEdit = () => {
  formRef.value.validate((valid) => {
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
        let nodeForm = {}
        nodeForm.type = nodeData.value.type
        nodeForm.title = form.value.name
        nodeForm.category = res.data.category
        nodeForm.tags = res.data.tags
        nodeForm.body = res.data.body
        updateForum(nodeData.value.articleId, nodeForm).then(res => {
          if (res.code === 1000) {
            dialogClose()
            const title = { name: nodeForm.title }
            getUpdateCategorysApi(edit_id.value, title)
            getNodeList()

          }
          reload()
        })
      }

    })
  }
}

// 调用 更新节点API
const getUpdateCategorysApi = (id, name) => {
  updateCategorys(id, name).then((res) => {
    ElMessage({
      message: '编辑成功！',
      type: 'success',
    })
    dialogClose()
    getNodeList()
    handleNodeExpand(res.data)
  })
}

// 删除接口
const deleteApi = (id) => {
  // 二次确认删除
  ElMessageBox.confirm("确定要删除吗？", "提示", {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: "warning",
    draggable: true,
  })
    .then(() => {
      deleteCategorys(id).then(res => {
        ElMessage.success("删除成功");
        getNodeList()
        router.push({ name: 'subbooks', params: { wRefresh: true } })
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled',
      })
    });
}

// 节点点击事件
const handleNodeClick = async (node) => {
  let nodedata = {
    'label': node.label,
    'id': node.id
  }
  nodeData.value = node
  store.commit("books/SET_NODE_DATA", node);
  sessionStorage.setItem('node', JSON.stringify(nodedata))
  // 判断节点类型,跳转不同路径 ('a', '文章'),('w', 'Word'), ('e', 'Excel'),('m', '思维导图'), ('f', '流程图'), ('p', 'PPT'),('l', '分组'),
  switch (node.type) {
    case "l":
      router.push({ name: 'subbooks', params: { wRefresh: true } })
      break;
    case 'w':
      router.push({ name: 'detail', query: { wid: node.articleId } })
      break;
    case 'e':
      router.push({ path: '/excel', query: { eid: node.articleId } })
      break;
    case 'a':
      router.push({ name: 'detail', query: { wid: node.articleId } })
      break;
    case 'm':
      if (node.articleId == route.query.mid) { return true }
      loadingInstance.value = ElLoading.service({
        lock: true,
        text: '正在加载文件，请稍后...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      await getMindMapDataApi(node.articleId)
      router.push({ name: 'mindMap', query: { mid: node.articleId } })
      break;
  }
}

// 获取思维导图数据
const getMindMapDataApi = (id) => {
  getForumInfo(id).then(res => {
    bus.emit('setData', JSON.parse(res.data.body));
    bus.emit("execCommand", ['UNEXPAND_TO_LEVEL', 2]) // 默认展开到第二层级
    ElMessage({
      message: "获取成功",
      type: "success",
      duration: 1000
    });
    loadingInstance.value.close()
  })
}

// 节点拖拽
// 拖拽完成时触发的事件  参数依次为：被拖拽节点、结束拖拽时最后进入的节点、被拖拽节点的放置位置（before、after、inner）、event
// 注意：目标节点是已经移动完之后的节点
const handleDrop = (draggingNode, dropNode, dropType, ev) => {
  // 定义一个空数组用于存放需要持久化到数据库的节点
  var paramData = {};
  // 当拖拽类型不为inner,说明只是在现有的节点间移动，只需要寻找目标节点的父ID，获取其对象以及所有的子节点,data为目标节点的父节点;
  // 否则，当拖拽类型为inner,说明拖拽节点成为了目标节点的子节点,只需要获取目标节点对象即可
  // 目标节点的ID
  var dropNodeId = dropNode.level == 1 && dropType != "inner" ? Number(spaceid.value) : dropNode.data.id

  // 被拖拽节点的ID
  var draggingNodeId = draggingNode.data.id;
  // 被拖拽节点的name
  var draggingNodeName = draggingNode.data.label

  paramData = {
    name: draggingNodeName, // 被拖拽节点的name
    parent_category: dropNodeId // 目标节点的ID
  };

  updateCategorys(draggingNodeId, paramData).then((res) => {
    console.log(res);
    if (res.code == 1000) {
      ElMessage.success("更新成功");
      dialogClose()
      getNodeList()
      paramData = {}
    } else {
      ElMessage.error("更新失败");
    }
  })

}
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 60px;
  bottom: 0;
  overflow-y: scroll;
  width: 270px;
}

.title {
  font-weight: 700;
  font-size: 17px;
}

.filter-tree {
  margin-top: 15px;
  width: 100%;
}

.left-button {
  margin-right: 15px;
  display: none;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 18px;
  overflow: hidden;
}

.custom-tree-node:hover .labelStyle {
  max-width: 146px;
}

.content {
  display: flex;
  align-items: center;
  overflow: hidden;
  margin-right: 1px;
}

.labelStyle {
  max-width: 170px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}

.is-Folder {
  margin-right: 5px;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

/* .sidebar-el-menu:not(.el-menu--collapse) {
    width: 280px;
} */
.sidebar>ul {
  height: 100%;
}

.custom-tree-node:hover .left-button {
  display: block;
}

.buttonStyle {
  display: flex;
}
</style>