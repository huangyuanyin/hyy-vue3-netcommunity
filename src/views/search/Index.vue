<template>
  <div>
    <el-card>
      <el-container>
        <el-header height="60px" style="width: 90%; margin-left: 5%">
          <el-row>
            <el-col :span="8">
              <el-input v-model="keywords" placeholder="搜索知识库" size="default" @keyup.enter="handleSearch"
                style="width: 400px">
                <template #prefix>
                  <el-icon><search /></el-icon>
                </template>
                <template #append>
                  <el-select v-model="filterTag" placeholder="Select" 
                    style="width: 90px" @change="handleSearch">
                    <el-option label="内容" value="body" />
                    <el-option label="标题" value="title" />
                  </el-select>
                </template>
              </el-input>
            </el-col>
            <el-col :span="7" :offset="9">
              <el-dropdown @command="handleCommand" style="width: 100px; margin-top: 5px">
                <span class="el-dropdown-link">
                  {{ commandData }} <el-icon><caret-bottom /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="类型不限">类型不限</el-dropdown-item>
                    <el-dropdown-item command="文档">文档</el-dropdown-item>
                    <el-dropdown-item command="表格">表格</el-dropdown-item>
                    <el-dropdown-item command="思维导图" disabled>思维导图</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <el-cascader :options="taglist" v-model="tags" @change="handleTag"
                clearable placeholder="请选择标签" style="width: 180px"
                :props="{ value:'id', label: 'name' }">
              </el-cascader>
            </el-col>
          </el-row>
        </el-header>
        <el-main style="width: 90%; margin-left: 5%">
          <ul class="infinite-list" style="overflow: auto">
            <li v-for="(question, index) in datalist" :key="index">
              <el-card shadow="never" :body-style="{ padding: '0px' }">
                <div style="padding: 14px">
                  <h3 class="title" @click="handleOpen(question.type, question.id)">{{ question.title }}</h3>
                </div>
                <el-row class="subscript">
                  <el-col :span="2">
                    <div class="user-avator">
                      <img src="@/assets/img/img.jpg" />
                    </div>
                  </el-col>
                  <el-col :span="2" class="user-name">
                    <span>{{ question.author }}</span>
                  </el-col>
                  <el-col :span="5">
                    <time class="time">{{ question.pub_time }}</time>
                  </el-col>
                  <el-col :span="4" :offset="11" class="statistics">
                    <el-button text @click="handleOpen(question.type, question.id)">
                      <el-icon :size="16"><View /></el-icon></el-button>
                    <span>{{ question.views }}</span>
                    <el-button text @click="answerHandle(question.id)">
                      <el-icon :size="16" color="#000000"><chat-dot-round /></el-icon>
                    </el-button>
                    <span>{{ question.s_comments.length }}</span>
                    <el-button text @click="handleEdit(question.type, question.id)"><el-icon :size="16"><Edit /></el-icon></el-button>
                  </el-col>
                </el-row>
              </el-card>
            </li>
          </ul>
          <el-pagination style="margin-top: 10px"
            :total="total" 
            :current-page="page" 
            :page-size="size"
            :page-sizes="[10, 20, 50, 100]"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange" 
            layout="total, sizes, prev, pager, next, jumper"></el-pagination>
        </el-main>
      </el-container>
    </el-card>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import { getForum } from '@/api/forum.js'
import { Search } from '@element-plus/icons-vue'
import { getTag } from "@/api/tag.js"
export default {
  setup() {
    // 路由
    const router = useRouter()
    const route = useRoute();
    // 等待
    const loading = ref(false)
    // 数据列表
    const datalist = ref([])
    // 标签列表
    const taglist = ref([])
    // 搜索内容
    const keywords = ref('')
    // 文档类型
    const wtype = ref('')
    // 条数/页
    const size = ref(10)
    // 总条数
    const total = ref(0)
    // 当前页码
    const page = ref(1)
    // 知识库类型
    const commandData = ref('类型不限')
    // 筛选标记
    const filterTag = ref('body')
    // 标签
    const tags = ref('')


    // 获取数据列表
    const getDataList = () => {
      loading.value = true
      let tmpBody = ''
      let tmpTitle = ''
      if (filterTag.value == 'body') {
        tmpBody = encodeURIComponent(keywords.value)
      } else {
        tmpTitle = encodeURIComponent(keywords.value)
      }
      console.log(tmpBody, tmpTitle)
      let params = {
        tags: tags.value,
        title: tmpTitle,
        body: tmpBody,
        page: page.value,
        pagesize: size.value,
        type: wtype.value
      }
      getForum(params).then(res => {
        datalist.value = res.data
        total.value = res.total
        loading.value = false
      })
    };

    // 获取标签列表
    const getTagList = () => {
      getTag().then(res => {
        taglist.value = res.data
      })
    }
    getTagList()

    keywords.value = route.query.content
    getDataList()
    // 监听
    watch(() => route.query.content, ()=> {
      if (route.query.content) {
        keywords.value = route.query.content
        getDataList()
      }
    })

    // 筛选事件
    const handleSearch = () => {
      getDataList()
    }

    // 标签响应
    const handleTag = (value) => {
      console.log(value)
      if (value == null) {
        tags.value = ''
      }
      getDataList()
    }

    // 
    const handleSizeChange = (value) => {
      size.value = value
      getDataList()
    }

    const handleCommand = (value) => {
      commandData.value = value;
      if (value == '文档') {
        wtype.value = 'w'
      }
      if (value == '表格') {
        wtype.value = 'e'
      }
      if (value == '类型不限') {
        wtype.value = ''
      }
      getDataList()
    }

    // 页码响应
    const handleCurrentChange = (value) => {
      page.value = value
      getDataList()
    }

    // 跳转至数据展示
    const handleOpen = (type, id) => {
      if (type == 'a' || type == 'w') {
        router.push({name: 'detail', params: {wid: id}})
      }
      if (type == 'e') {
        router.push({name: 'excel', query: {eid: id}})
      }
    }

    // 数据编辑
    const handleEdit = (type, id) => {
      if (type == 'a' ) {
        router.push({name: 'tiny', query: {tid: id}})
      } 
      if (type == 'w' ) {
        router.push({name: 'md', query: {mid: id}})
      }
      if (type == 'e' ) {
        router.push({name: 'excel', query: {eid: id}})
      }
    }

    // 回复响应
    const answerHandle = (id) => {
      router.push({name: 'detail', params: {wid: id, status: 'answer'}})
    }

    return {
      datalist,
      loading,
      filterTag,
      tags,
      keywords,
      taglist,
      size,
      total,
      wtype,
      page,
      commandData,
      Search,
      handleTag,
      handleSizeChange,
      answerHandle,
      handleCurrentChange,
      getDataList,
      getTagList,
      handleSearch,
      handleCommand,
      handleOpen,
      handleEdit
    }
  },
}
</script>

<style scoped>
.el-container {
  padding: 0px;
}
.dialog-footer {
  float: left;
}
.infinite-list {
  padding: 0;
  margin: 0;
  list-style: none
}
.title {
  color: #2c3e50;
}
.subscript {
  margin-top: 13px;
  margin-bottom: 10px;
  line-height: 15px;
  display: flex;
  align-items: center;
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
  justify-content: space-evenly;
  align-items: center;
}
.statistics span {
  margin-right: 5px;
  font-size: 14px;
  color: #999;
}
</style>