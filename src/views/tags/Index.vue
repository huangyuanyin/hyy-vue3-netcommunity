<template>
  <div>
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="text">文章标签</span>
          <el-button type="primary" @click="addHandle">新增标签</el-button>
        </div>
      </template>
      <el-table :data="dataList" border>
        <el-table-column label="标签名称" prop="name"></el-table-column>
        <el-table-column label="操作" width="250px">
          <template #default="scope">
            <el-button size="small" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="pagination-block">
        <el-pagination
          :currentPage="page"
          layout="total, prev, pager, next, jumper"
          :total="allTotal"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div> -->
    </el-card>
    <!-- 对话框 -->
    <dialog-com :show="showDialog" :edit="editForm" :status="status" @input="getDialog"></dialog-com>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getTag, deleteTag } from '@/api/tag.js'
import dialog from './components/Dialog.vue'
export default {
  components: {
    'dialog-com': dialog
  },
  setup() {
    const router = useRouter()
    // 页码
    const page = ref(1)
    // 条数
    const allTotal = ref(0)
    // 数据列表
    const dataList = ref([])
    // 对话框状态
    const showDialog = ref(false)
    // 状态
    const status = ref('')
    // 待编辑数据
    const editForm = reactive({})

    // 获取数据列表
    const getTableList = () => {
      getTag().then(res => {
        dataList.value = res.data
      })
    }

    getTableList()

    // 新增事件
    const addHandle = () => {
      showDialog.value = true
      status.value = 'add'
    }

    // 编辑事件
    const handleUpdate = row => {
      let index = dataList.value.indexOf(row)
      editForm.value = dataList.value[index]
      status.value = 'edit'
      showDialog.value = true
    }

    // 获取对话框反馈
    const getDialog = msg => {
      showDialog.value = msg
      editForm.value = {}
      getTableList()
    }

    // 页码响应事件
    const handleCurrentChange = newpage => {
      page.value = newpage
      getTableList()
    }

    // 项目移除
    const handleDelete = id => {
      // 二次确认删除
      ElMessageBox.confirm('确定要删除吗？', '提示', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
        draggable: true
      })
        .then(() => {
          deleteTag(id).then(res => {
            ElMessage.success('删除成功')
            console.log('sdada')
            getTableList()
            router.push({ name: 'subbooks', params: { wRefresh: true } })
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
      page,
      allTotal,
      showDialog,
      status,
      dataList,
      editForm,
      addHandle,
      handleUpdate,
      getTableList,
      handleDelete,
      getDialog,
      handleCurrentChange,
      router
    }
  }
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 16px;
  font-weight: 900;
}

.pagination-block {
  margin: 10px 10px;
  float: right;
}
</style>
