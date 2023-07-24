<template>
  <div id="editor">
    <mavon-editor
      v-model="handbook"
      @change="handleChange"
      :ishljs="true"
      :subfield="props.subfield"
      :toolbars="props.toolbars"
      :boxShadow="false"
      @fullScreen="fullScreen"
      ref="mavonEditorRef"
      @imgAdd="imgAdd"
    >
      <template v-slot:left-toolbar-before v-if="props.noSlot">
        <el-button type="default" link @click="changeEditor">切换富文本编辑器</el-button>
        <el-button type="default" link @click="fileParseDialog = true">文件解析</el-button>
      </template>
    </mavon-editor>
    <el-dialog v-model="fileParseDialog" custom-class="fileParseDialog" title="world文件解析" width="40%">
      <el-upload class="upload-demo" drag action="" accept=".md" multiple :on-change="handleFileParse">
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">拖拽文件至此处 或 <em>点击此处上传</em></div>
        <template #tip>
          <div class="el-upload__tip">
            注：解析成功后，解析结果将会替换已有内容！
          </div>
        </template>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import { useRoute } from 'vue-router'
import { uploadMdImageApi } from '@/api/upload'
import { ElMessageBox } from 'element-plus'

const props = defineProps({
  data: String,
  noSlot: {
    type: Boolean,
    default: true
  },
  subfield: {
    type: Boolean,
    default: true
  },
  toolbars: {
    type: Object,
    default: {
      bold: true, // 粗体
      italic: true, // 斜体
      header: true, // 标题
      underline: true, // 下划线
      strikethrough: true, // 中划线
      mark: true, // 标记
      superscript: true, // 上角标
      subscript: true, // 下角标
      quote: true, // 引用
      ol: true, // 有序列表
      ul: true, // 无序列表
      link: true, // 链接
      imagelink: true, // 图片链接
      code: true, // code
      table: true, // 表格
      fullscreen: true, // 全屏编辑
      readmodel: true, // 沉浸式阅读
      htmlcode: true, // 展示html源码
      help: true, // 帮助
      /* 1.3.5 */
      undo: true, // 上一步
      redo: true, // 下一步
      trash: true, // 清空
      save: false, // 保存（触发events中的save事件）
      /* 1.4.2 */
      navigation: true, // 导航目录
      /* 2.1.8 */
      alignleft: true, // 左对齐
      aligncenter: true, // 居中
      alignright: true, // 右对齐
      /* 2.2.1 */
      subfield: true, // 单双栏模式
      preview: true // 预览
    }
  }
})
const emit = defineEmits(['input', 'changeEditor'])

const route = useRoute()
const mavonEditorRef = ref() // 获取编辑器Vue实例子
const handbook = ref('')
const fileParseDialog = ref(false)

watch(
  () => props.data,
  () => {
    handbook.value = props.data
  }
)

// render: html数据  val：markdown数据
const handleChange = (val, render) => {
  emit('input', val)
}

const fullScreen = () => {
  emit('fullScreen', true)
}

const changeEditor = () => {
  if (handbook.value) {
    ElMessageBox.confirm('切换编辑器可能会清空内容！！！', '警告', {
      confirmButtonText: '继续',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        emit('changeEditor', ['tiny', handbook.value])
      })
      .catch(() => {})
  } else {
    emit('changeEditor', ['tiny', handbook.value])
  }
}

const handleFileParse = (uploadFile, uploadFiles) => {
  if (uploadFile) {
    const reader = new FileReader()
    reader.readAsText(uploadFile.raw, 'UTF-8')
    reader.onload = evt => {
      handbook.value = evt.target.result
      fileParseDialog.value = false
    }
  }
}

const imgAdd = async (name, $file) => {
  // 第一步.将图片上传到服务器.
  var formdata = new FormData()
  formdata.append('id', route.query.mid)
  formdata.append('file', $file)
  let res = await uploadMdImageApi(formdata)
  if (res.code === 1000) {
    // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
    mavonEditorRef.value.$img2Url(name, process.env.VUE_APP_BASE_URL + '/' + res.data[0])
  }
}
</script>

<style lang="scss" scoped>
#editor {
  margin: auto;
  width: 100%;
  height: 100%;
  .markdown-body {
    height: 100%;
  }

  .v-note-panel {
    height: 100%;
    overflow: auto;
    // min-height: 100vh;
    height: 100%;
    overflow-y: auto;
    box-sizing: border-box;
    overflow-x: hidden;
    box-sizing: content-box;
    padding-left: 25px;
    overflow: hidden;
  }
  .v-show-content {
    min-height: 100vh;
    height: 100%;
    overflow-y: auto;
    box-sizing: border-box;
    overflow-x: hidden;
    box-sizing: content-box;
    padding-left: 25px;
    overflow: hidden;
  }
  .v-note-wrapper {
    border-radius: 0%;
    border: none;
    border-top: 1px solid #f2f6fc;
    :deep(.v-note-op .v-left-item) {
      padding-left: 8%;
      height: 40px;
      box-sizing: border-box;
      flex: none !important;
      .changeEditor {
        width: max-content;
      }
    }
    :deep(.v-note-op .v-right-item) {
      flex: none !important;
    }
  }
}
.fileParseDialog {
  .upload-demo {
    :deep(.el-upload) {
      width: 100% !important;
    }
  }
  :deep(.el-dialog__body) {
    padding-top: 0px !important;
  }
}
:deep(.v-note-show) {
  height: 100vh;
}
</style>
<style lang="scss">
.v-note-show {
  max-height: 100% !important;
  padding: 0;
}
</style>
