<template>
  <div>
    <el-card>
      <el-row>
        <el-col :span="3">
          <span class="title">我的知识库</span>
        </el-col>
        <el-col :span="4" :offset="15">
          <el-input v-model="search" placeholder="搜索">
            <template #prefix>
              <el-icon class="el-input__icon"><search /></el-icon>
            </template>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button style="margin-left: 10px" @click="dialogBook = true">新建知识库</el-button>
        </el-col>
      </el-row>
      <el-tabs>
        <el-tab-pane label="常用">
            
        </el-tab-pane>
      </el-tabs>
      <el-tabs v-model="activeName">
        <el-tab-pane label="个人知识库" name="my">
          <table-list-com :data="mybooks"></table-list-com>
        </el-tab-pane>
        <el-tab-pane label="协作知识库" name="public">
          <table-list-com :data="pubooks"></table-list-com>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 知识库对话框 -->
    <dialog-com :show="dialogBook" :edit="editForm" @input="getDialog"></dialog-com>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import tablelist from './components/table.vue'
import { getCategorys } from "@/api/category.js"
import dialogBook from './components/dialog.vue'
export default {
  components: {
    'table-list-com': tablelist,
    'dialog-com':dialogBook
  },
  setup() {
    // 搜索内容
    const search = ref('')
    // 便签页
    const activeName = ref('my')
    // 个人知识库数据
    const mybooks = ref([])
    // 协同知识库数据
    const pubooks = ref([])
    // 待编辑表单
    const editForm = reactive({})
    // 对话框
    const dialogBook = ref(false)

    const getMyBooks = () => {
      getCategorys().then((res) => {
        mybooks.value = res.data
        pubooks.value = res.data
      })
    }

    getMyBooks()

    onMounted(() => {
      getMyBooks()
    })

    const getDialog = (msg) => {
      dialogBook.value = msg
      getMyBooks()
    }

    return {
      dialogBook,
      search,
      activeName,
      mybooks,
      pubooks,
      editForm,
      getMyBooks,
      getDialog
    }
  },
}
</script>

<style scoped>
.title {
  font-weight: 600;
  font-size: 17px;
}
.el-tabs {
  margin-top: 25px;
}
</style>