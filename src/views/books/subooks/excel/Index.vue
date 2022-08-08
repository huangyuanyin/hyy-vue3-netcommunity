<template>
  <div>
    <div id="luckysheet"></div>
    <div class="operate">
      <el-button @click="downloadExcel">导出</el-button>
      <el-button type="primary" @click="dialogOpen" style="margin-right: 30px">保存</el-button>
      <input type="file" accept=".xlsx" @change="loadExcel" />
    </div>
    <el-dialog title="新增/编辑文档" v-model="dialog" draggable width="700px">
      <el-form :model="form" ref="formRef" :rules="formRules" label-width="80px">
        <el-form-item label="分类" prop="category" v-if="isRight == 'right'">
          <el-space>
            <el-cascader :options="treeData" v-model="form.category" @change="handleChange"
              :props="{ value: 'id', checkStrictly: true }" clearable :show-all-levels="false" />
            <span style="margin-left: 30px">标签</span>
            <el-cascader :options="taglist" v-model="form.tags" :props="{ value: 'id', label: 'name' }">
            </el-cascader>
          </el-space>
        </el-form-item>
        <el-form-item label="文档名称" prop="title">
          <el-input v-model="form.title" show-word-limit maxlength="200" placeholder="请输入文档名称" type="text"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialog = false">取 消</el-button>
          <el-button type="primary" @click="handleSave">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed, inject } from 'vue'
import { exportExcel } from '@/utils/export'
import { ElMessage } from "element-plus";
import { useStore } from 'vuex'
import { useRoute, useRouter, onBeforeRouteUpdate, onBeforeRouteLeave } from 'vue-router';
import { addForum, updateForum, getForumInfo } from '@/api/forum.js'
import { getCategorysInfo, addCategorys, updateCategorys } from '@/api/category.js'
import { getTag } from "@/api/tag.js"
import LuckyExcel from 'luckyexcel'
import { judgeNodeType } from '@/utils/methods.js'

const reload = inject('reload')
const store = useStore()
const route = useRoute();
const router = useRouter();
const node = computed(() => store.getters.node);
watch(
  () => route.query,
  (newVal, oldVal) => {
    if (route.query && route.query.category) {
      categoryId.value = route.query.category
    } else {
      categoryId.value = ''
    }
    // 监控 是否显示分类
    if (route.query && route.query.isRight) {
      isRight.value = route.query.isRight
    } else {
      isRight.value = ''
    }
    if (route.query && route.query.isAdd) {
      luckysheet.create({
        container: 'luckysheet',
        lang: "zh", //中文
      })
    }
  },
)
// 工作空间标题名
const spaceid = computed(() => sessionStorage.getItem('spaceid'));
// const jsonData = ref({})
// 路由传参
const categoryId = ref("")
const dialog = ref(false)
const editCategory = ref('')
// 节点数据
const treeData = ref([])
// 标签列表
const taglist = ref([])
// 是否显示分类
const isRight = ref("")
// 表单
const form = reactive({
  category: '',
  title: '',
  tags: [],
  type: 'e',
  body: ''
})
const formRef = ref(null);
// 表单校验
const formRules = reactive({
  category: [{ required: true, message: '请选择所属分类', trigger: 'change' }],
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }]
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

getNodeList()
getTagList()

const loadExcel = (evt) => {
  const files = evt.target.files
  if (files == null || files.length == 0) {
    alert('No files wait for import')
    return
  }

  let name = files[0].name
  let suffixArr = name.split('.'),
    suffix = suffixArr[suffixArr.length - 1]
  if (suffix != 'xlsx') {
    alert('Currently only supports the import of xlsx files')
    return
  }
  LuckyExcel.transformExcelToLucky(files[0], function (exportJson, luckysheetfile) {
    if (exportJson.sheets == null || exportJson.sheets.length == 0) {
      alert('Failed to read the content of the excel file, currently does not support xls files!')
      return
    }
    // console.log('exportJson', exportJson)
    // jsonData.value = exportJson

    luckysheet.destroy()

    luckysheet.create({
      container: 'luckysheet', //luckysheet is the container id
      showinfobar: true, //是否显示工具栏
      showsheetbar: true, //是否显示底部sheet按钮
      lang: "zh", //中文
      data: exportJson.sheets,
      title: exportJson.info.name,
      userInfo: exportJson.info.name.creator
    })
  })
}

const downloadExcel = () => {
  exportExcel(luckysheet.getAllSheets(), luckysheet.toJson().title)
}

onMounted(() => {
  isRight.value = route.query.isRight || ''
  if (route.query.eid) {
    loadExcelForServer()
  } else {
    form.category = node.value.id
    luckysheet.create({
      container: 'luckysheet',
      lang: "zh", //中文
    })
  }
})

watch(() => route.query.eid, () => {
  if (route.query.eid) {
    loadExcelForServer()
  }
})

const loadExcelForServer = () => {
  getForumInfo(route.query.eid).then(res => {
    form.category = res.data.category
    // editCategory.value = res.data.category
    luckysheet.create({
      container: 'luckysheet',
      lang: "zh", //中文
      showinfobar: true, //是否显示工具栏
      showsheetbar: true, //是否显示底部sheet按钮
      data: JSON.parse(res.data.body),
      title: res.data.title,
      userInfo: res.data.author
    })
  })
}

const handleChange = (id) => {
  var len = id.length
  form.category = id[len - 1]
}

const dialogOpen = () => {
  dialog.value = true
  form.title = luckysheet.toJson().title
}

const handleClose = () => {
  dialog.value = false
  router.push({ name: 'subbooks', params: { wRefresh: true } })
}

const handleSave = () => {
  if (route.query.eid) {
    updateApi()
  } else {
    addApi()
  }
}

// 编辑
const updateApi = () => {
  var excelData = luckysheet.getAllSheets();
  form.body = JSON.stringify(excelData);
  form.author = sessionStorage.getItem('username')
  if (route.query && route.query.isRight == 'right') {
    getUpdateForumApi(route.query.eid, form)
  } else {
    updateForum(route.query.eid, form).then(res => {
      if (res.code === 1000) {
        getUpdateCategorysApi()
      }
      handleClose()
      reload()
    })
  }
}

// 新增
const addApi = () => {
  var excelData = luckysheet.getAllSheets();
  form.category = categoryId.value = route.query.category || ''
  form.body = JSON.stringify(excelData);
  form.author = sessionStorage.getItem('username')
  if (route.query.isRight == "right") {
    getSaveApi(form)
  } else {
    save()
  }
}

// 编辑excel API
const getUpdateForumApi = (id, form) => {
  updateForum(id, form).then(res => {
    ElMessage({
      message: "编辑成功！",
      type: "success",
    });
    handleClose()
  })
}

// 新增excel API
const getSaveApi = (form) => {
  addForum(form).then(res => {
    ElMessage({
      message: "新增成功",
      type: "success",
    });
    handleClose()
  })
}

// 更新节点 API
const getUpdateCategorysApi = () => {
  const title = { name: form.title }
  updateCategorys(form.category, title).then((res) => {
    ElMessage({
      message: '编辑成功！',
      type: 'success',
    })
  })
}

// getApi
const save = () => {
  let params = {
    name: form.title,
    parent_category: form.category,
    type: form.type
  }
  // 新增节点
  addCategorys(params).then((res) => {
    if (res.code == 1000) {
      form.category = res.data
      // 新增excel
      addForum(form).then(res => {
        ElMessage({
          message: "新增成功",
          type: "success",
        });
        handleClose()
        reload()
      })
    }
  })
}
</script>

<style  scoped>
#luckysheet {
  margin: 0px;
  padding: 0px;
  position: absolute;
  width: 100%;
  left: 0px;
  top: 0px;
  bottom: 0px;
  /* width: 100% !important;    */
}

.operate {
  left: 60px;
  position: fixed;
  top: 15px;
  width: 100%;
  position: absolute;
}

#tip {
  position: absolute;
  z-index: 1000000;
  left: 0px;
  top: 0px;
  bottom: 0px;
  right: 0px;
  background: rgba(255, 255, 255, 0.8);
  text-align: center;
  font-size: 40px;
  align-items: center;
  justify-content: center;
  display: flex;
}

/* 
.luckysheet canvas {
  width: 100% !important;  
} */
</style>
