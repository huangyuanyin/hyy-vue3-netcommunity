<template>
  <el-dialog v-model="isShowDialog" custom-class="saveDialog" title="新建/编辑 文件名称" @close="closeSaveDialog">
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

<script lang='js' setup>
import { reactive, ref, toRefs, defineProps, defineEmits } from 'vue'

const props = defineProps({
  isShowDialog: {
    type: Boolean,
    default: false
  }
})

const { isShowDialog } = toRefs(props)
const emits = defineEmits(['closeSaveDialog'])
const saveForm = reactive({
  category: '',
  title: '',
  tags: [],
  type: 'm',
  body: '',
  author: sessionStorage.getItem('username')
})
const saveFormRef = ref(null);
const saveFormRules = reactive({
  category: [{ required: true, message: '请选择所属分类', trigger: 'change' }],
  title: [{ required: true, message: '请输入文档名称', trigger: 'blur' }]
})

// 选择分类ID
const handleChange = (id) => {
  var len = id.length
  saveForm.category = id[len - 1]
}

const handleSave = () => {

}

const closeSaveDialog = () => {
  emits('closeSaveDialog', false)
}



</script>

<style scoped>

</style>