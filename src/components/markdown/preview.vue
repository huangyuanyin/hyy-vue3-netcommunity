<template>
  <div id="editor">
    <!-- box-shadow-style="0 2px 5px 0 rgba(0, 0, 0, 0.1)" -->
    <mavon-editor
      class="md"
      v-model="handbook"
      :subfield="false"
      :defaultOpen="'preview'"
      :toolbars="toolbars"
      :boxShadow="false"
      :ishljs="true"
      :previewBackground="'#FFFFFF'"
    ></mavon-editor>
  </div>
</template>

<script>
import { reactive, ref, watch } from 'vue'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
export default {
  name: 'editor',
  components: {
    mavonEditor
  },
  props: {
    data: String
  },
  setup(props, ctx) {
    const handbook = ref('')
    const toolbars = reactive({
      bold: false, // 粗体
      italic: false, // 斜体
      header: false, // 标题
      underline: false, // 下划线
      strikethrough: false, // 中划线
      mark: false, // 标记
      superscript: false, // 上角标
      subscript: false, // 下角标
      quote: false, // 引用
      ol: false, // 有序列表
      ul: false, // 无序列表
      link: false, // 链接
      imagelink: false, // 图片链接
      code: false, // code
      table: false, // 表格
      fullscreen: true, // 全屏编辑
      readmodel: false, // 沉浸式阅读
      htmlcode: false, // 展示html源码
      help: false, // 帮助
      /* 1.3.5 */
      undo: false, // 上一步
      redo: false, // 下一步
      trash: false, // 清空
      save: false, // 保存（触发events中的save事件）
      /* 1.4.2 */
      navigation: true, // 导航目录
      /* 2.1.8 */
      alignleft: false, // 左对齐
      aligncenter: false, // 居中
      alignright: false, // 右对齐
      /* 2.2.1 */
      subfield: false, // 单双栏模式
      preview: true // 预览
    })

    watch(
      () => props.data,
      () => {
        // console.log(props.data)
        handbook.value = props.data
      }
    )

    return {
      handbook,
      toolbars
    }
  }
}
</script>

<style scoped>
#editor {
  margin: auto;
  width: 100%;
  height: 100%;
}

:deep(.markdown-body table) {
  display: inline-table;
}
</style>
