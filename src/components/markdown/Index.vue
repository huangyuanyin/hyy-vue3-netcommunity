<template>
  <div id="editor">
    <mavon-editor
      v-model="handbook"
      @change="handleChange"
      :ishljs="true"
      :toolbars="toolbars"
      :subfield="false"
      :boxShadow="false"
      @fullScreen="fullScreen"
    ></mavon-editor>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

const props = defineProps({
  data: String
})
const emit = defineEmits(['input'])

const handbook = ref('')
const toolbars = reactive({
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
})

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
    min-height: 100vh;
    height: 100%;
    overflow-y: auto;
    box-sizing: border-box;
    overflow-x: hidden;
    box-sizing: content-box;
    padding-left: 25px;
    overflow: hidden;
    .v-note-show {
      height: 100% !important;
      padding: 0;
    }
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
}
</style>
