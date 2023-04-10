<template>
  <div>
    <el-dialog
      v-model="showDialog"
      custom-class="saveDialog"
      title="新建文档"
      @close="closeSaveDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="closeSaveDialog"
    >
      <el-form
        :disabled="disabled"
        :model="saveForm"
        ref="saveFormRef"
        :rules="saveFormRules"
        label-width="80px"
        v-loading="loading"
        :element-loading-text="`文件上传中...`"
      >
        <el-form-item label="分类" prop="category">
          <el-space>
            <el-cascader
              :options="treeData"
              v-model="saveForm.category"
              @change="handleChange"
              :props="{ value: 'id', checkStrictly: true }"
              :show-all-levels="false"
            />
            <span style="margin-left: 30px">标签</span>
            <el-cascader :options="taglist" v-model="saveForm.tags" :props="{ value: 'id', label: 'name' }"> </el-cascader>
          </el-space>
        </el-form-item>
        <el-form-item label="文档名称" prop="title">
          <el-input v-model="saveForm.title" show-word-limit maxlength="100" placeholder="请输入文档名称" type="text"> </el-input>
        </el-form-item>
        <el-form-item label="选择文件" prop="file">
          <el-upload
            class="upload-demo"
            ref="fileUpload"
            drag
            action=""
            :multiple="false"
            :limit="1"
            :auto-upload="false"
            accept=""
            :on-change="onFileChange"
            :file-list="saveForm.file"
            :data="saveForm"
            :on-exceed="handleExceed"
            :disabled="disabled"
          >
            <el-icon class="el-icon--upload">
              <upload-filled />
            </el-icon>
            <div class="el-upload__text">将文件拖到此处自动上传或<em>点击上传</em></div>
            <!-- <template #tip>
              <div class="el-upload__tip">
                仅支持.pdf .ppt(x) .docx类型文件上传
              </div>
            </template> -->
          </el-upload>
        </el-form-item>
        <el-form-item label="文档描述">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 10 }"
            v-model="saveForm.description"
            show-word-limit
            maxlength="200"
            placeholder="请输入文档描述"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeSaveDialog">取 消</el-button>
          <el-button v-if="!disabled" type="primary" @click="handleSave">确 定</el-button>
          <el-button v-else type="primary">上传中...</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, toRefs, defineEmits, onMounted, computed, watch } from 'vue'
import { getTag } from '@/api/tag.js'
import { uploadArticleFileApi } from '@/api/upload.js'
import { getCategorysInfo } from '@/api/category.js'
import { judgeNodeType } from '@/utils/methods.js'
import { ElMessage } from 'element-plus'
import { genFileId } from 'element-plus'

const props = defineProps({
  isShowDialog: {
    type: Boolean,
    default: () => false
  },
  treeData: {
    type: Object,
    default: () => {}
  }
})

const { treeData } = toRefs(props)
const emits = defineEmits(['closeSaveDialog', 'goRefresh'])

const showDialog = ref(false)
const taglist = ref([]) // 标签列表
const fileUpload = ref(null)
const fileName = ref('')
const loading = ref(false)
const saveForm = reactive({
  category: '',
  title: '',
  tags: [],
  description: '',
  author: sessionStorage.getItem('username')
})
const saveFormRef = ref(null)
const saveFormRules = reactive({
  category: [{ required: true, message: '请选择所属分类', trigger: 'change' }],
  title: [{ required: true, message: '请输入文档名称', trigger: 'blur' }],
  file: [{ required: true, message: '请选择文件上传', trigger: 'blur' }]
})
const disabled = ref(false)

watch(
  () => props.isShowDialog,
  () => {
    showDialog.value = props.isShowDialog
    if (props.isShowDialog) {
      saveForm.category = JSON.parse(sessionStorage.getItem('node')) ? JSON.parse(sessionStorage.getItem('node')).id : null
    }
  }
)

// 选择分类ID
const handleChange = id => {
  const len = id.length
  saveForm.category = id[len - 1]
}

const handleSave = async () => {
  saveFormRef.value.validate(valid => {
    if (!valid) return false
    // let pos = fileName.value.lastIndexOf(".");
    // let lastName = fileName.value.substring(pos, fileName.length);
    // if (![".pdf", ".ppt", ".pptx", ".docx"].includes(lastName.toLowerCase())) {
    //   console.log("lastName", lastName.toLowerCase());
    //   ElMessage.error("上传文件只能是pdf、ppt(x)、docx格式");
    //   return false
    // }
    let formData = new FormData()
    formData.append('author', saveForm.author)
    formData.append('title', saveForm.title)
    formData.append('category', saveForm.category)
    formData.append('description', saveForm.description)
    formData.append('tags', JSON.stringify(saveForm.tags))
    formData.append('file', saveForm.file[0].raw)
    fileUpload.value.submit()
    uploadArticleFile(formData)
  })
}

// 调用上传接口
const uploadArticleFile = async params => {
  disabled.value = true
  loading.value = true
  let res = await uploadArticleFileApi(params)
  disabled.value = false
  loading.value = false
  if (res.code === 1000) {
    ElMessage.success('上传成功')
    emits('closeSaveDialog', false)
    emits('goRefresh')
    saveFormRef.value.resetFields()
    fileUpload.value.clearFiles()
  } else {
    disabled.value = false
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
    saveForm.file = [fileList[fileList.length - 1]] // 展示最后一次选择的文件
  }
}

// 获取标签列表
const getTagList = () => {
  getTag().then(res => {
    taglist.value = res.data
  })
}

const closeSaveDialog = async () => {
  if (disabled.value) {
    return ElMessage.warning('文件上传中，请耐心等待...')
  }
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
  .el-textarea,
  .el-input {
    width: 503px;
  }
}
</style>
