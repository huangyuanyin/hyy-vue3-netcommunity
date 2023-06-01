<template>
  <div class="trash-wrap">
    <el-card>
      <div class="card-header">
        <span class="text">已回收知识库</span>
      </div>
      <el-tabs v-model="activeName" @tab-change="changeTab" class="booksStyle">
        <el-tab-pane label="共享知识库" name="public">
          <tablelist :data="pubooks"></tablelist>
        </el-tab-pane>
        <el-tab-pane label="个人知识库" name="my">
          <tablelist :data="mybooks"></tablelist>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import tablelist from './components/table.vue'
import { getCategorys } from '@/api/category.js'

const activeName = ref('public') // 便签页
const mybooks = ref([]) // 个人知识库数据
const pubooks = ref([]) // 协同知识库数据
const author = sessionStorage.getItem('username') || ''

const changeTab = name => {
  let id
  name === 'my' ? (id = 0) : (id = 1)
  getMyBooks(id, author)
}

const getMyBooks = (id, author) => {
  const params = {
    public: id,
    author: author
  }
  id === 1 ? delete params.author : ''
  getCategorys(params).then(res => {
    id === 0 ? (mybooks.value = res.data) : (pubooks.value = res.data)
  })
}

onMounted(() => {
  getMyBooks(1, author)
})
</script>

<style lang="scss" scoped>
.trash-wrap {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    :deep(.el-input) {
      width: 300px;
    }
    .text {
      font-size: 16px;
      font-weight: 900;
    }
  }
}
</style>
