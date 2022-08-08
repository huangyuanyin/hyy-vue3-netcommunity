<template>
  <div>
    <el-card>
      <el-container>
        <el-header height="30px" style="width: 90%; margin-left: 5%">
          <span>{{ node.label }}</span>
          <el-button text style="float: right" @click="handleRefresh">
            <el-icon>
              <Refresh />
            </el-icon>
          </el-button>
          <el-dropdown trigger="click" @command="handleCommand" style="float: right">
            <el-button text>
              <el-icon size="large">
                <CirclePlus />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
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
          <el-button :icon="Search" style="float: right" @click="drawer = true">筛选</el-button>
        </el-header>
        <el-main style="width: 90%; margin-left: 5%">
          <!-- <el-table :data="datalist" fit border stripe v-loading="loading">
            <el-table-column type="index" width="50" />
            <el-table-column label="标题">
              <template #default="scope">
                <el-tag @click="handleOpen(scope.row.type, scope.row.id)">{{ scope.row.title }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="发布时间" prop="pub_time"></el-table-column>
            <el-table-column label="作者" prop="author"></el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button size="small" @click="handleEdit(scope.row.id)">Edit</el-button>
                <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">Delete</el-button>
              </template>
            </el-table-column>
          </el-table> -->
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
                      <el-icon :size="16">
                        <View />
                      </el-icon>
                    </el-button>
                    <span>{{ question.views }}</span>
                    <el-button text @click="answerHandle(question.id)">
                      <el-icon :size="16" color="#000000">
                        <chat-dot-round />
                      </el-icon>
                    </el-button>
                    <span>{{ question.s_comments.length }}</span>
                    <el-button text @click="handleEdit(question.type, question.id)">
                      <el-icon :size="16">
                        <Edit />
                      </el-icon>
                    </el-button>
                  </el-col>
                </el-row>
              </el-card>
            </li>
          </ul>
          <el-pagination style="margin-top: 10px" :total="total" :current-page="page" :page-size="size"
            :page-sizes="[10, 20, 50, 100]" @size-change="handleSizeChange" @current-change="handleCurrentChange"
            layout="total, sizes, prev, pager, next, jumper"></el-pagination>
        </el-main>
      </el-container>
    </el-card>
    <el-drawer v-model="drawer" title="快速筛选" direction="rtl">
      <el-form :model="form" label-width="80px" size="large">
        <el-form-item label="标题">
          <el-input v-model="form.title" placeholder="请输入标题关键字"></el-input>
        </el-form-item>
        <el-form-item label="知识库">
          <!-- <el-input v-model="form.body" placeholder="知识库内容"></el-input> -->
          <el-input v-model="form.body" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea"
            placeholder="请输入要检索的知识库内容" />
        </el-form-item>
        <el-form-item label="标签">
          <el-cascader :options="taglist" v-model="form.tags" clearable :props="{ value: 'id', label: 'name' }">
          </el-cascader>
        </el-form-item>
        <!-- <el-form-item label=""></el-form-item> -->
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="drawerClose">取 消</el-button>
          <el-button type="primary" @click="handleSearch">确 定</el-button>
        </span>
      </template>
    </el-drawer>
  </div>
</template>

<script>
import { ref, computed, watch, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router';
import { getForum } from '@/api/forum.js'
import { Search } from '@element-plus/icons-vue'
import { getTag } from "@/api/tag.js"
export default {
  setup() {
    // vuex
    const store = useStore()
    const route = useRoute();
    // 路由
    const router = useRouter()
    // 等待
    const loading = ref(false)
    // 数据列表
    const datalist = ref([])
    // 标签列表
    const taglist = ref([])
    // 搜索内容
    const keywords = ref('')
    // 条数/页
    const size = ref(10)
    // 总条数
    const total = ref(0)
    // 当前页码
    const page = ref(1)
    // 抽屉
    const drawer = ref(false)
    // 节点数据
    const node = computed(() => store.getters.node);
    // 筛选表单
    const form = reactive({
      title: '',
      tags: '',
      body: ''
    })

    // 获取数据列表
    const getDataList = () => {
      loading.value = true
      let tmpBody = encodeURIComponent(form.body)
      let tmpTitle = encodeURIComponent(form.title)
      let nodeid = ''
      if (node.value.id) {
        nodeid = node.value.id
      }
      let params = {
        category: nodeid,
        tags: form.tags,
        title: tmpTitle,
        body: tmpBody,
        page: page.value,
        pagesize: size.value
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
    // getDataList()

    // 监听
    watch(() => node.value.id, () => {
      // console.log(node.value)
      getDataList()
    })

    // 监听是否刷新
    watch(() => route.params.wRefresh, () => {
      if (route.params.wRefresh) {
        getDataList()
      }
    })

    const handleRefresh = () => {
      getDataList()
    }

    // 抽屉关闭事件
    const drawerClose = () => {
      form.title = ''
      form.body = ''
      form.tags = ''
      drawer.value = false

    }

    // 筛选事件
    const handleSearch = () => {
      if (form.tags == null) {
        form.tags = ''
      }
      getDataList()
      drawerClose()
    }

    // 
    const handleSizeChange = (value) => {
      console.log(value)
      size.value = value
      getDataList()
    }

    // 页码响应
    const handleCurrentChange = (value) => {
      page.value = value
      getDataList()
    }

    // 指令事件
    const handleCommand = (value) => {
      if (value == 'excel') {
        router.push({ name: 'excel', query: { isRight: "right", isAdd: "add" } })
      }
      if (value == 'article') {
        router.push({ name: 'tiny', query: { type: "right", isAdd: "add" } })
      }
      if (value == 'word') {
        router.push({ name: 'md', query: { type: "right", isAdd: "add" } })
      }
      if (value == 'mindmap') {
        router.push({ name: 'mindmap', query: { type: "right" } })
      }
    }

    // 跳转至数据展示
    const handleOpen = (type, id) => {
      if (type == 'a' || type == 'w') {
        router.push({ name: 'detail', params: { wid: id }, query: { isRight: "right" } })
      }
      if (type == 'e') {
        router.push({ name: 'excel', query: { eid: id, isRight: "right" } })
      }
    }

    // 数据编辑
    const handleEdit = (type, id) => {
      if (type == 'a') {
        router.push({ name: 'tiny', params: { tid: id }, query: { tid: id, type: "edit", isRight: "right" } })
      }
      if (type == 'w') {
        router.push({ name: 'md', params: { mid: id }, query: { type: "edit", isRight: "right" } })
      }
      if (type == 'e') {
        router.push({ name: 'excel', query: { eid: id, isRight: "right" } })
      }
    }

    // 回复响应
    const answerHandle = (id) => {
      router.push({ name: 'detail', params: { wid: id, status: 'answer' } })
    }

    // 移除
    const handleDelete = (id) => {

    }

    return {
      datalist,
      loading,
      node,
      keywords,
      taglist,
      size,
      total,
      page,
      drawer,
      form,
      Search,
      handleSizeChange,
      answerHandle,
      handleCurrentChange,
      drawerClose,
      getDataList,
      getTagList,
      handleSearch,
      handleRefresh,
      handleCommand,
      handleOpen,
      handleEdit,
      handleDelete
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