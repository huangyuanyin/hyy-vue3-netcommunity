<!--
 * @Author: maxf
 * @Date: 2022-03-25 22:49:29
 * @Description: Home组件Sidebar页面
 * @FilePath: \vue3-netforum\src\components\Sidebar.vue
-->
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
      <el-tree :data="treeData" ref="treeRef" class="filter-tree" highlight-current accordion
        @current-change="handleNodeClick" node-key="id" :props="defaultProps">
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span :title="node.label">{{ node.label }}</span>
            <div>
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
                    <el-dropdown-item command="article">新建文章(富文本)</el-dropdown-item>
                    <el-dropdown-item command="excel">新建Excel</el-dropdown-item>
                    <el-dropdown-item command="word">新建文档(markdown)</el-dropdown-item>
                    <el-dropdown-item command="mindmap" disabled>新建思维导图</el-dropdown-item>
                    <el-dropdown-item command="process" disabled>新建流程图</el-dropdown-item>
                    <el-dropdown-item command="ppt" disabled>新建PPT</el-dropdown-item>
                    <el-dropdown-item command="process" disabled>新建白板</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <!-- 更多 -->
              <el-dropdown @command="handleRoot">
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
          </span>
        </template>
      </el-tree>
    </div>
    <el-dialog title="新建分组/子分组" v-model="dialogNode" draggable width="600px">
      <el-form :model="form" ref="formRef" :rules="formRules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" maxlength="10" placeholder="分组名称" show-word-limit type="text" />
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

<script>
import { ref, computed, reactive, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { getCategorysInfo, addCategorys, updateCategorys, deleteCategorys } from '@/api/category.js'
export default {
  setup() {
    const store = useStore()
    const router = useRouter()
    const spacename = computed(() => sessionStorage.getItem('spacename'));
    const spaceid = computed(() => sessionStorage.getItem('spaceid'));
    // 对话框
    const dialogNode = ref(false)
    // 对话框 编辑
    const dialogEdit = ref(false)
    // 节点数据
    const treeData = ref([])
    const treeRef = ref({})
    // 父节点ID
    const parent_id = ref('')
    // 编辑节点
    const edit_id = ref('')
    // 配置选项
    const defaultProps = {
      children: 'children',
      label: 'label',
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

    // 获取节点数据
    const getNodeList = () => {
      getCategorysInfo(spaceid.value).then((res) => {
        treeData.value = res.data
      })
    }

    getNodeList()

    // 指令事件
    const handleCommand = (value) => {
      if (value == 'root') {
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

    // 新建指令
    const handleNewInstruction = (value) => {
      let tmp = value.split(',')
      if (tmp[0] === 'add') {
        parent_id.value = tmp[1]
        dialogNode.value = true
      }
      if (value == 'excel') {
        router.push('/excel')
        // router.push({name: 'excel'} );
        // parent_id.value = space.value.id  
        // dialogNode.value = true
      }
      if (value == 'article') {
        router.push({
          path: '/tiny',
          query: {
            type: "notShow"
          }
        })
      }
      if (value == 'word') {
        router.push('/md')
      }
      if (value == 'mindmap') {
        router.push('/mindmap')
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
      formRef.value.resetFields()
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
        })
      })
    }

    // 节点编辑
    const handleEdit = () => {
      formRef.value.validate((valid) => {
        if (!valid) return
        updateCategorys(edit_id.value, form.value).then((res) => {
          ElMessage({
            message: '编辑成功！',
            type: 'success',
          })
          dialogClose()
          getNodeList()
        })
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
    const handleNodeClick = (node) => {

      let nodedata = {
        'label': node.label,
        'id': node.id
      }
      console.log(nodedata)
      store.commit("books/SET_NODE_DATA", node);
      sessionStorage.setItem('node', nodedata)
      router.push({ path: '/subbooks' });
    }

    return {
      spacename,
      spaceid,
      form,
      parent_id,
      edit_id,
      formRef,
      formRules,
      treeData,
      dialogNode,
      dialogEdit,
      treeRef,
      defaultProps,
      dialogClose,
      handleRoot,
      handleNodeClick,
      handleCommand,
      handleAdd,
      handleNewInstruction,
      handleEdit,
      showIcon,
      leftButton
    }
  },
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
</style>