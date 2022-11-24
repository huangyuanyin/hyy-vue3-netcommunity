<!--
 * @Description: 标签 新增、编辑
 * @Author: maxf
 * @Date: 2022-04-18 22:49:29
 * @LastEditors: maxf
 * @LastEditTime: 2022-04-18 22:54:07
 * @FilePath: \vue3-apitest\src\views\tags\components\Dialog.vue
-->
<template>
  <div>
    <el-dialog
      title="添加/编辑"
      v-model="dialog"
      width="700px"
      @close="dialogClose"
      :close-on-click-modal="false"
      :append-to-body="true"
      :draggable="true"
    >
      <el-form :model="form" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="form.name" clearable placeholder="如：NetSign"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogClose">取 消</el-button>
          <el-button type="primary" @click="confirmHandle">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, ref, watch } from 'vue'
import { addTag, updateTag } from '@/api/tag.js'
import { ElMessage } from 'element-plus'
export default {
  props: {
    show: Boolean,
    edit: Object,
    status: String
  },
  setup(props, ctx) {
    // 对话框状态
    const dialog = ref(false)
    // 表单
    const form = ref({
      name: ''
    })
    // 表单校验
    const formRules = reactive({
      name: [{ required: true, message: '请输入标签名称', trigger: 'blur' }]
    })
    const formRef = ref(null)

    // 监听对话框状态
    watch(
      () => props.show,
      () => {
        dialog.value = props.show
        if (props.status == 'edit') {
          form.value = props.edit.value
        }
      }
    )

    // 对话框关闭事件
    const dialogClose = () => {
      formRef.value.resetFields()
      ctx.emit('input', false)
    }

    // 提交回复
    const confirmHandle = () => {
      formRef.value.validate(valid => {
        if (!valid) return
        if (props.status == 'add') {
          addApi()
        } else {
          updateApi()
        }
      })
    }

    // 新增接口
    const addApi = () => {
      addTag(form.value).then(res => {
        ElMessage({
          message: '新增成功！',
          type: 'success'
        })
        dialogClose()
      })
    }

    // 更新接口
    const updateApi = () => {
      const id = props.edit.value.id
      console.log(id)
      updateTag(id, form.value).then(res => {
        ElMessage({
          message: '更新成功！',
          type: 'success'
        })
        dialogClose()
      })
    }

    return {
      dialog,
      form,
      formRules,
      formRef,
      dialogClose,
      confirmHandle
    }
  }
}
</script>

<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
