<template>
  <div class="WangEdtior_wrap">
    <Toolbar class="toolbar" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
    <div class="editor">
      <Editor v-model="valueHtml" :defaultConfig="editorConfig" :mode="mode" @onCreated="handleCreated" />
    </div>
  </div>
</template>

<script setup>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
import { registerMenu } from './index.js'
import { onBeforeUnmount, ref, watch, shallowRef, onMounted } from 'vue'

const props = defineProps({
  value: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['fileParseMenuClick'])

watch(
  () => props.value,
  () => {
    valueHtml.value = props.value
  }
)

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()
// 内容 HTML
const valueHtml = ref('')
const toolbarConfig = {}
const editorConfig = { placeholder: '请输入内容...' }
const mode = 'default'

const handleCreated = editor => {
  editorRef.value = editor // 记录 editor 实例，重要！
  registerMenu(editorRef.value, toolbarConfig) // 注册自定义菜单。这个是5.4那边声明的
  initMediaMenuEvent() // 注册自定义菜单点击事件
}

// 事件监听
const initMediaMenuEvent = () => {
  const editor = editorRef.value
  // 在点击事件中，根据具体菜单，可以触发响应的功能，这里可以为每个事件创建一个el-dialog弹窗。我们就可以完全按照自己的需求开发后续功能
  editor.on('fileParseMenuClick', () => {
    // 你点击了图片菜单
    emit('fileParseMenuClick')
  })
  editor.on('changeEditorMenuClick', () => {
    emit('changeEditorMenuClick')
  })
}

// 模拟 ajax 异步获取内容
onMounted(() => {})

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
</script>

<style lang="scss" scoped>
.WangEdtior_wrap {
  display: flex;
  flex-direction: column;
  width: 100%;
  .toolbar {
    display: flex;
    justify-content: center;
    border-top: 1px solid hsla(0, 0%, 0%, 0.04);
    border-bottom: 1px solid hsla(0, 0%, 0%, 0.04);
  }
  .editor {
    height: calc(100vh - 160px);
    :deep(.w-e-scroll) {
      padding: 0 10%;
    }
  }
  :deep(.w-e-bar-item:first-child) {
    svg {
      width: 20px;
      height: 20px;
      fill: #1296db !important;
    }
  }
  :deep(.w-e-bar-item:nth-child(2)) {
    svg {
      width: 20px;
      height: 20px;
      fill: #d4237a !important;
    }
  }
}
</style>
