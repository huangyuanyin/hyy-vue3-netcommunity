<template>
  <div>
    <el-dialog v-model="isShowDialog" custom-class="saveDialog" title="新建文档" @close="closeSaveDialog">
      <el-form :model="saveForm" ref="saveFormRef" :rules="saveFormRules" label-width="80px">
        <el-form-item label="分类" prop="category">
          <el-space>
            <el-cascader :options="treeData" v-model="saveForm.category" @change="handleChange"
              :props="{ value: 'id', checkStrictly: true }" :show-all-levels="false" />
            <span style="margin-left: 30px">标签</span>
            <el-cascader :options="taglist" v-model="saveForm.tags" :props="{ value: 'id', label: 'name' }">
            </el-cascader>
          </el-space>
        </el-form-item>
        <el-form-item label="文档名称" prop="title">
          <el-input v-model="saveForm.title" show-word-limit maxlength="100" placeholder="请输入文档名称" type="text">
          </el-input>
        </el-form-item>
        <el-form-item label="选择文件" prop="file">
          <el-upload class="upload-demo" ref="fileUpload" drag action="" :multiple="false" :limit="1"
            :auto-upload="false" accept="" :on-change="onFileChange" :file-list="saveForm.file" :data="saveForm"
            :on-exceed="handleExceed">
            <el-icon class="el-icon--upload">
              <upload-filled />
            </el-icon>
            <div class="el-upload__text">
              将文件拖到此处自动上传或<em>点击上传</em>
            </div>
            <!-- <template #tip>
              <div class="el-upload__tip">
                仅支持.pdf .ppt(x) .docx类型文件上传
              </div>
            </template> -->
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
import { getCategorysInfo } from '@/api/category.js'
import { judgeNodeType } from '@/utils/methods.js'
import { ElMessage } from 'element-plus';
import { genFileId } from 'element-plus'

const props = defineProps({
  isShowDialog: {
    type: Boolean,
    default: () => false
  },
  treeData: {
    type: Object,
    default: () => { }
  }
})

const { isShowDialog, treeData } = toRefs(props)
const emits = defineEmits(['closeSaveDialog', 'goRefresh'])
const spaceid = computed(() => sessionStorage.getItem('spaceid')); // 工作空间标题名
const taglist = ref([]) // 标签列表
const fileUpload = ref(null)
const fileName = ref("")
const saveForm = reactive({
  category: '',
  title: '',
  tags: [],
  author: sessionStorage.getItem('username'),
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
  saveFormRef.value.validate((valid) => {
    if (!valid) return false
    // let pos = fileName.value.lastIndexOf(".");
    // let lastName = fileName.value.substring(pos, fileName.length);
    // if (![".pdf", ".ppt", ".pptx", ".docx"].includes(lastName.toLowerCase())) {
    //   console.log("lastName", lastName.toLowerCase());
    //   ElMessage.error("上传文件只能是pdf、ppt(x)、docx格式");
    //   return false
    // }
    let formData = new FormData();
    formData.append("author", saveForm.author);
    formData.append("title", saveForm.title);
    formData.append("category", saveForm.category);
    formData.append("tags", JSON.stringify(saveForm.tags));
    formData.append("file", saveForm.file[0].raw);
    fileUpload.value.submit()
    uploadArticleFile(formData)
  })
}

// 调用上传接口
const uploadArticleFile = async (params) => {
  let res = await uploadArticleFileApi(params)
  if (res.code === 1000) {
    ElMessage.success('上传成功')
    emits('closeSaveDialog', false)
    emits('goRefresh')
    saveFormRef.value.resetFields()
    fileUpload.value.clearFiles()
  } else {
    ElMessage.error(res.msg || '上传失败')
    emits('closeSaveDialog', false)
    saveFormRef.value.resetFields()
    fileUpload.value.clearFiles()
  }
}

const handleExceed = (files, fileList) => {
  fileUpload.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  fileUpload.value.handleStart(file)
}

// 文件状态改变时的钩子
const onFileChange = (file, fileList) => {
  saveForm.title = file.name
  fileName.value = file.name
  if (fileList.length > 0) {
    saveForm.file = [fileList[fileList.length - 1]]  // 展示最后一次选择的文件
  }
}

// 获取分类列表
const getNodeList = () => {
  getCategorysInfo(spaceid.value).then((res) => {
    treeData.value = judgeNodeType(res.data)
    console.log('dada', treeData.value);
  })
}

// 获取标签列表
const getTagList = () => {
  getTag().then(res => {
    taglist.value = res.data
  })
}

const closeSaveDialog = async () => {
  fileUpload.value.clearFiles()
  saveFormRef.value.resetFields()
  emits('closeSaveDialog', false)
}

onMounted(() => {
  getTagList()
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