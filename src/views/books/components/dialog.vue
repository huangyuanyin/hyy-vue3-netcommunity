<template>
  <div>
    <el-dialog title="知识库" v-model="dialogBook" draggable width="600px" :before-close="handleClose">
      <el-form :model="form" ref="formRef" :rules="formRules" label-width="80px" size="large">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" maxlength="10" placeholder="知识库名称" show-word-limit type="text" />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="form.description"
            :autosize="{ minRows: 4, maxRows: 6 }"
            type="textarea"
            placeholder="请输入知识库简介..."
            maxlength="200"
          />
        </el-form-item>
        <el-form-item label="可见范围" prop="public">
          <el-radio-group v-model="form.public">
            <el-radio border label="0">私有</el-radio>
            <el-radio border label="1">公开</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleClick">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'
import { ElMessage } from 'element-plus'
import { updateCategorys, addCategorys } from '@/api/category.js'

const prop = defineProps({
  show: Boolean,
  edit: Object
})
const emit = defineEmits(['input'])

// 对话框
const dialogBook = ref(false)
// 表单
const form = ref({
  name: '',
  description: '',
  public: null,
  author: sessionStorage.getItem('username')
})
const formRef = ref(null)
// 表单校验
const formRules = ref({
  name: [{ required: true, message: '请输入知识库名称', trigger: 'blur' }],
  public: [{ required: true, message: '请选择可见范围', trigger: 'blur' }]
})

// 监听
watch(
  () => prop.show,
  () => {
    dialogBook.value = prop.show
    if (prop.show) {
      if (JSON.stringify(prop.edit.value) != undefined) {
        form.value = prop.edit.value
        console.log(prop.edit.value)
      }
    }
  }
)

const handleClose = () => {
  form.value.description = ''
  formRef.value.resetFields()
  emit('input', false)
}

// 确定事件
const handleClick = () => {
  if (JSON.stringify(prop.edit.value) != undefined) {
    updateApi()
  } else {
    addApi()
  }
}

// 新增接口
const addApi = () => {
  formRef.value.validate(valid => {
    if (!valid) return
    addCategorys(form.value).then(res => {
      if (res.code === 1000) {
        ElMessage({
          message: '新增成功！',
          type: 'success'
        })
        handleClose()
      }
    })
  })
}

// 更新接口
const updateApi = () => {
  formRef.value.validate(valid => {
    if (!valid) return
    form.value.author = sessionStorage.getItem('username')
    updateCategorys(prop.edit.value.id, form.value).then(res => {
      if (res.code === 1000) {
        ElMessage({
          message: '编辑成功！',
          type: 'success'
        })
        handleClose()
      }
    })
  })
}
</script>
