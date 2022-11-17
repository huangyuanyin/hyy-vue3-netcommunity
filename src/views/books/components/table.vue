<template>
  <div>
    <el-table :data="datalist">
      <el-table-column label="名称" prop="name">
        <template #default="scope">
          <el-button type="primary" plain @click="handleOpen(scope.row)">{{ scope.row.name }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="简介" prop="description" align="center" width="500px">
        <template #default="scope">
          <el-tooltip :content="scope.row.description" placement="top-start" effect="light" popper-class="tooltipStyle"
            :show-arrow="false">
            <span class="descriptionStyle">{{ scope.row.description }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="last_mod_time" :formatter="dateFormat" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)"
            :disabled="role !== 'admin' && scope.row.public !== '0'">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <DialogBook :show="dialog" :edit="editForm" @input="getDialog" />
  </div>
</template>

<script setup>
import { reactive, ref, watch, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { deleteCategorys, getCategorys } from "@/api/category.js"
import DialogBook from './dialog.vue'
import { utc2beijing } from '@/utils/util.js'

const props = defineProps({
  data: Object
})

const store = useStore()
const router = useRouter()
const role = computed(() => store.getters.role);
const dialog = ref(false) // 对话框
const datalist = ref([]) // 数据列表
const editForm = reactive({}) // 待编辑表单

const getMyBooks = (id) => {
  const params = {
    "public": id,
    "author": sessionStorage.getItem("username")
  }
  id === 1 ? delete params.author : ''
  getCategorys(params).then((res) => {
    datalist.value = res.data
  })
}

const dateFormat = (row, column) => {
  let date = row[column.property]
  return utc2beijing(date)
}

watch(() => props.data, () => {
  datalist.value = props.data
})

// 知识库跳转
const handleOpen = (book) => {
  store.commit("app/handleSiderbar", true)
  sessionStorage.setItem("siderbar", '1')
  sessionStorage.setItem("spaceid", book.id)
  sessionStorage.setItem("spacename", book.name) // 知识库名称
  sessionStorage.setItem("spacePublic", Number(book.public))
  // store.commit("app/SET_SPACES", book);
  store.commit("changeCurTreeId", 0)
  router.push('/subbooks');
}

// 知识库编辑
const handleEdit = (value) => {
  editForm.value = value
  dialog.value = true
}

const getDialog = (msg) => {
  dialog.value = msg
  getMyBooks(Number(editForm.value.public))
}

// 删除
const handleDelete = (data) => {
  ElMessageBox.confirm("确定要删除吗？", "提示", {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: "warning",
    draggable: true,
  })
    .then(() => {
      deleteCategorys(data.id).then(res => {
        if (res.code === 1000) {
          ElMessage.success("删除成功");
          getMyBooks(Number(data.public))
        }
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    });
}
</script>

<style lang="scss" scoped>
.descriptionStyle {
  width: 500px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
}
</style>

<style lang="scss">
.tooltipStyle {
  max-width: 500px;
}
</style>