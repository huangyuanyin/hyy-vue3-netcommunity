<template>
  <div>
    <el-dialog v-model="isShowDialog" custom-class="saveDialog" title="新建文档" @close="closeSaveDialog">
      <el-form :model="saveForm" ref="saveFormRef" :rules="saveFormRules" label-width="80px">
        <el-form-item label="分类" prop="category">
          <el-space>
            <el-cascader :options="treeData" v-model="saveForm.category" @change="handleChange"
              :props="{ value: 'id', checkStrictly: true }" clearable :show-all-levels="false" />
            <span style="margin-left: 30px">标签</span>
            <el-cascader :options="taglist" v-model="saveForm.tags" :props="{ value: 'id', label: 'name' }">
            </el-cascader>
          </el-space>
        </el-form-item>
        <el-form-item label="文档名称" prop="title">
          <el-input v-model="saveForm.title" show-word-limit maxlength="30" placeholder="请输入文档名称" type="text">
          </el-input>
        </el-form-item>
        <el-form-item label="选择文件" prop="file">
          <el-upload class="upload-demo" ref="upload" action="" :show-file-list="false" :multiple="false"
            :before-upload="beforeUpload" :file-list="saveForm.file" :limit="1" :on-exceed="handleExceed">
            <el-button type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload-list__item-name">{{fileName}}</div>
            <template #tip>
              <div class="el-upload__tip">
                仅支持.pdf .ppt .docx类型文件上传
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeSaveDialog">取 消</el-button>
          <el-button type="primary" @click="handleSave">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, toRefs, defineProps, defineEmits, onMounted, computed } from 'vue'
import { getTag } from "@/api/tag.js"
import { uploadArticleFileApi } from '@/api/upload.js'
import { getCategorysInfo, addCategorys, updateCategorys } from '@/api/category.js'
import { judgeNodeType } from '@/utils/methods.js'
import { ElMessage } from 'element-plus';
import { async } from 'q'

const props = defineProps({
  isShowDialog: {
    type: Boolean,
    default: () => false
  }
})

// 工作空间标题名
const spaceid = computed(() => sessionStorage.getItem('spaceid'));
// 节点数据
const treeData = ref([])
// 标签列表
const taglist = ref([])
const { isShowDialog } = toRefs(props)
const emits = defineEmits(['closeSaveDialog'])
const upload = ref(null)
const fileName = ref("")
const saveForm = reactive({
  category: '',
  title: '',
  tags: [],
  author: sessionStorage.getItem('username'),
  // file: []
})
const saveFormRef = ref(null);
const saveFormRules = reactive({
  category: [{ required: true, message: '请选择所属分类', trigger: 'change' }],
  title: [{ required: true, message: '请输入文档名称', trigger: 'blur' }],
  file: [{ required: true, message: '请选择文件上传', trigger: 'blur' }]
})

// 选择分类ID
const handleChange = (id) => {
  var len = id.length
  saveForm.category = id[len - 1]
}

const handleSave = async () => {
  if (fileName.value == "") {
    ElMessage.warning('请选择要上传的文件！')
    return false
  }
  await addDocumentManage()
}

const addDocumentManage = async () => {
  // upload.value.submit()
  // const fd = new FormData()
  // if (saveForm.file) {
  //   //append方法逐个添加键值对
  //   fd.append("file", saveForm.file); //把文件实体添加到表单对象
  // }
  // let addForm;
  // //添加收集的表单数据
  // addForm = saveForm
  // fd.append("form", JSON.stringify(saveForm));
  // console.log("确定。。。", saveForm);

  let fileFormData = new FormData();
  if (saveForm.file) {
    //append方法逐个添加键值对
    fileFormData.append("file", saveForm.file, fileName.value); //把文件实体添加到表单对象
  }
  fileFormData.append("form", JSON.stringify(saveForm));
  // fileFormData.append('file', saveForm.file, fileName.value);//filename是键，file是值，就是要传的文件，test.zip是要传的文件名
  uploadArticleFile(fileFormData)
}

// 调用上传接口
const uploadArticleFile = async (params) => {
  console.log("参数", params);
  let res = await uploadArticleFileApi(params)
}

// 获取分类列表
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

const handleExceed = (files, fileList) => {
  ElMessage.error('只能选择1个文件')
}

// //上传文件让第二次覆盖第一次的文件
const onFileChange = (file, fileList) => {
  // if (fileList.length > 0) {
  //   saveForm.file = [fileList[fileList.length - 1]]  // 展示最后一次选择的文件
  // }
}

const uploadFile = (params) => {
  saveForm.file = params.file
}

const beforeUpload = (file) => {
  console.log(file, '文件');
  saveForm.file = file;
  fileName.value = file.name;
  console.log("fileName", fileName.value);
  return false // 返回false不会自动上传
}

const closeSaveDialog = () => {
  emits('closeSaveDialog', false)
}

onMounted(() => {
  getTagList()
  getNodeList()
})

</script>

<style lang="scss" scoped>
.saveDialog {
  width: 800px !important;

  .el-input {
    width: 503px;
  }
}
</style>