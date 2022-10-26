<template>
  <div>
    <el-table :data="datalist">
      <el-table-column label="名称" prop="name">
        <template #default="scope">
          <el-button type="primary" plain @click="handleOpen(scope.row)">{{ scope.row.name }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="last_mod_time" :formatter="dateFormat" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.id)" :disabled="role !== 'admin'">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <dialog-com :show="dialog" :edit="editForm" @input="getDialog"></dialog-com>
  </div>
</template>

<script>
import { reactive, ref, watch, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { deleteCategorys, getCategorys } from "@/api/category.js"
import dialogBook from './dialog.vue'
import { utc2beijing } from '@/utils/util.js'
export default {
  props: {
    data: Object
  },
  components: {
    'dialog-com': dialogBook
  },
  setup(props, ctx) {
    const store = useStore()
    const router = useRouter()
    const role = computed(() => store.getters.role);
    // 对话框
    const dialog = ref(false)
    // 数据列表
    const datalist = ref([])
    // 待编辑表单
    const editForm = reactive({})

    const getMyBooks = () => {
      getCategorys().then((res) => {
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
      // store.commit("app/SET_SPACES", book);
      router.push('/subbooks');
    }

    // 知识库编辑
    const handleEdit = (value) => {
      editForm.value = value
      dialog.value = true
    }

    const getDialog = (msg) => {
      dialog.value = msg
      getMyBooks()
    }

    // 删除
    const handleDelete = (id) => {
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: "warning",
        draggable: true,
      })
        .then(() => {
          deleteCategorys(id).then(res => {
            ElMessage.success("删除成功");
            getMyBooks()
          })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: 'Delete canceled',
          })
        });
    }


    return {
      role,
      datalist,
      dialog,
      editForm,
      getDialog,
      handleOpen,
      handleEdit,
      handleDelete,
      dateFormat
    }
  },
}
</script>