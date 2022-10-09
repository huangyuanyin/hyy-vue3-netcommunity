<template>
  <el-dialog v-model="isShowDialog" custom-class="saveDialog" title="新建/编辑 思维导图" @close="closeSaveDialog">
    <el-form :model="saveForm" ref="saveFormRef" :rules="saveFormRules" label-width="80px">
      <el-form-item label="分类" prop="category" v-if="isRight == 'right'">
        <el-space>
          <el-cascader :options="treeData" v-model="saveForm.category" @change="handleChange"
            :props="{ value: 'id', checkStrictly: true }" clearable :show-all-levels="false" />
          <span style="margin-left: 30px">标签</span>
          <el-cascader :options="taglist" v-model="saveForm.tags" :props="{ value: 'id', label: 'name' }">
          </el-cascader>
        </el-space>
      </el-form-item>
      <el-form-item label="文档名称" prop="title">
        <el-input v-model="saveForm.title" show-word-limit maxlength="200" placeholder="请输入文档名称" type="text">
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="isShowDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleSave">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import bus from '@/utils/bus';
import { ref, reactive, onMounted, nextTick, inject, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ElMessage } from "element-plus";
import { getData } from '@/api';
import { getTag } from "@/api/tag.js"
import { addForum, updateForum, getForumInfo } from '@/api/forum.js'
import { getCategorysInfo, addCategorys, updateCategorys } from '@/api/category.js'
import { judgeNodeType } from '@/utils/methods.js'

const route = useRoute()
const router = useRouter()
const store = useStore()
const reload = inject('reload')
const node = computed(() => store.getters.node);
const isShowDialog = ref(false)
const isRight = ref('')
const treeData = ref([])
const taglist = ref([])
// 工作空间标题名
const spaceid = computed(() => sessionStorage.getItem('spaceid'));
const saveForm = reactive({
  category: '',
  title: '',
  tags: [],
  type: 'm',
  body: '',
  author: sessionStorage.getItem('username')
})
const saveFormRef = ref(null);
// 表单校验
const saveFormRules = reactive({
  category: [{ required: true, message: '请选择所属分类', trigger: 'change' }],
  title: [{ required: true, message: '请输入文档名称', trigger: 'blur' }]
})

const closeSaveDialog = () => {
  isShowDialog.value = false
}

// 保存流程
const handleSave = () => {
  if (route.query.mid) {
    updateMindMap()
    isShowDialog.value = false
  } else {
    addMindMap()
    isShowDialog.value = false
  }
}

// 新增mindMap
const addMindMap = () => {
  saveFormRef.value.validate((valid) => {
    if (valid) {
      saveForm.body = JSON.stringify(getData())
      if (route.query.isRight == "right") {
        getRightSaveApi(saveForm)
      } else {
        getSave() // 新增为节点
      }
    } else {
      return false;
    }
  });
  console.log("保存...", saveForm);
}

// 新增mindMap api
const getRightSaveApi = (saveForm) => {
  addForum(saveForm).then(res => {
    ElMessage({
      message: "新增成功",
      type: "success",
    });
    if (res.code === 1000) {
      handleClose()
      reload()
      toDetail(res.data)
    }
  })
}

// 新增mindMap 为节点
const getSave = () => {
  let params = {
    name: saveForm.title,
    parent_category: route.query.category,
    type: saveForm.type
  }
  // 新增节点
  addCategorys(params).then((res) => {
    if (res.code == 1000) {
      saveForm.category = res.data
      // 调用新增mindMap节点
      addForum(saveForm).then(res => {
        ElMessage({
          message: "新增成功",
          type: "success",
        });
        if (res.code === 1000) {
          handleClose()
          reload()
          toDetail(res.data)
        }
      })
    }
  })
}

// 编辑mindMap
const updateMindMap = () => {
  saveForm.body = JSON.stringify(getData())
  if (route.query && route.query.isRight == 'right') {
    getUpdateForumApi(route.query.mid, saveForm)
  } else {
    updateForum(route.query.mid, saveForm).then(res => {
      if (res.code === 1000) {
        getUpdateCategorysApi()
      }
      handleClose()
      reload()
      toDetail(route.query.mid)
    })
  }
}

// 编辑mindMap API
const getUpdateForumApi = (id, form) => {
  updateForum(id, form).then(res => {
    ElMessage({
      message: "编辑成功！",
      type: "success",
    });
    handleClose()
    reload()
    toDetail(res.data)
  })
}

// 更新节点 API
const getUpdateCategorysApi = () => {
  const title = { name: saveForm.title }
  updateCategorys(saveForm.category, title).then((res) => {
    ElMessage({
      message: '编辑成功！',
      type: 'success',
    })
  })
}

const loadMindMap = () => {
  getForumInfo(route.query.mid).then(res => {
    saveForm.category = res.data.category
    saveForm.title = res.data.title || ''
    saveForm.tags = res.data.tags
    saveForm.body = JSON.parse(res.data.body)
  })
}

watch(() => route.query, () => {
  if (route.query.mid) {
    loadMindMap()
  }
  if (route.query.isRight) {
    isRight.value = route.query.isRight
    getTagList()
    getNodeList()
  } else {
    isRight.value = ''
  }
})

onMounted(() => {
  if (route.query.isRight) {
    getNodeList()
    getTagList()
  }
  bus.on("showSaveDialog", () => {
    isRight.value = route.query.isRight || ''
    if (route.query.mid) {
      loadMindMap() // 获取思维导图
    } else {
      saveForm.category = node.value.id
    }
    nextTick(() => {
      isShowDialog.value = true;
    });
  });
})

// 获取节点数据
const getNodeList = () => {
  getCategorysInfo(spaceid.value).then((res) => {
    treeData.value = judgeNodeType(res.data)
  })
}

// 获取标签列表
const getTagList = () => {
  getTag().then(res => {
    taglist.value = res.data
  })
}

// 选择分类ID
const handleChange = (id) => {
  var len = id.length
  saveForm.category = id[len - 1]
}

const handleClose = () => {
  isShowDialog.value = false
  router.push({ name: 'subbooks', params: { wRefresh: true } })
}

// 跳转到详情页
const toDetail = (mid) => {
  if (route.query && route.query.isRight) {
    router.replace({ name: 'mindMap', query: { mid: mid, isRight: 'right' } })
  } else {
    router.replace({ name: 'mindMap', query: { mid: mid } })
  }
}

</script>

<script>
export default {
  name: "SaveDataDialog",
}
</script>

<style scoped>

</style>