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
              <el-icon class="el-input__icon">
                <Search />
              </el-icon>
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
      <el-tabs v-model="activeName" @tab-change="changeTab">
        <el-tab-pane label="共享知识库" name="public">
          <tablelist :data="pubooks"></tablelist>
        </el-tab-pane>
        <el-tab-pane label="个人知识库" name="my">
          <tablelist :data="mybooks"></tablelist>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 知识库对话框 -->
    <DialogBook :show="dialogBook" :edit="editForm" @input="getDialog"></DialogBook>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import tablelist from './components/table.vue'
import DialogBook from './components/dialog.vue'
import { getCategorys } from "@/api/category.js"
import { Search } from '@element-plus/icons-vue'

const search = ref('') // 搜索内容
const activeName = ref('public') // 便签页
const mybooks = ref([]) // 个人知识库数据
const pubooks = ref([]) // 协同知识库数据
const editForm = reactive({}) // 待编辑表单
const dialogBook = ref(false) // 对话框
const author = sessionStorage.getItem('username') || ''

const getMyBooks = (id, author) => {
  const params = {
    "public": id,
    "author": author
  }
  id === 1 ? delete params.author : ''
  getCategorys(params).then((res) => {
    id === 0 ? mybooks.value = res.data : pubooks.value = res.data
  })
}

const changeTab = (name) => {
  let id;
  name === 'my' ? id = 0 : id = 1
  getMyBooks(id, author)
}

const getDialog = (msg) => {
  dialogBook.value = msg
  getMyBooks(activeName.value === 'my' ? 0 : 1, author)
}

onMounted(() => {
  getMyBooks(1, author)
})


</script>

<style lang="scss" scoped>
.title {
  font-weight: 600;
  font-size: 17px;
}

.el-tabs {
  margin-top: 25px;
}
</style>