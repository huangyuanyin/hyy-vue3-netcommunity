<template>
  <div>
    <el-dialog title="知识库" v-model="dialogBook" draggable width="600px"
      :before-close="handleClose">
      <el-form :model="form" ref="formRef" :rules="formRules" label-width="80px" size="large">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" maxlength="10" placeholder="知识库名称" show-word-limit type="text"/>
        </el-form-item>
        <el-form-item>
          <el-input v-model="textarea1" :disabled="true"
            :autosize="{ minRows: 4, maxRows: 6 }"
            type="textarea"
            placeholder="知识库简介"
          />
        </el-form-item>
        <el-form-item label="可见范围">
          <el-radio-group v-model="textarea2" :disabled="true">
            <el-radio border label="私有" />
            <el-radio border label="公开" />
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

<script>
import { reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { updateCategorys, addCategorys } from "@/api/category.js"
export default {
  props: {
    show: Boolean,
    edit: Object
  },
  setup(prop, ctx) {
    const textarea1 = ref('')
    const textarea2 = ref('')
    // 对话框
    const dialogBook = ref(false)
    // 表单
    const form = ref({
      name: ''
    })
    const formRef = ref(null)
    // 表单校验
    const formRules = reactive({
      name: [{ required: true, message: '请输入知识库名称', trigger: 'blur'}]
    })

    // 监听
    watch(() => prop.show, () => {
      dialogBook.value = prop.show
      if (prop.show) {
        console.log(prop.edit.value)
        if (JSON.stringify(prop.edit.value) != undefined) {
          form.value = prop.edit.value
        }
      }
    })

    const handleClose = () => {
      formRef.value.resetFields()
      ctx.emit('input', false)
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
      formRef.value.validate((valid) => {
        if (!valid) return
        addCategorys(form.value).then((res) => {
          ElMessage({
            message: '新增成功！',
            type: 'success',
          })
          handleClose()
        })
      })
    }

    // 更新接口
    const updateApi = () => {
      formRef.value.validate((valid) => {
        if (!valid) return
        updateCategorys(prop.edit.value.id, form.value).then((res) => {
          ElMessage({
            message: '编辑成功！',
            type: 'success',
          })
          handleClose()
        })
      })
    }

    return {
      textarea1,
      textarea2,
      dialogBook,
      form,
      formRef,
      formRules,
      handleClose,
      handleClick
    }
  },
}
</script>