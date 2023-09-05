<template>
  <div class="my-tinymce">
    <Editor v-model="contentValue" :init="myInit" />
  </div>
  <el-dialog v-model="fileParseDialog" custom-class="fileParseDialog" title="word文件解析" width="40%">
    <el-upload class="upload-demo" drag action="" multiple :on-change="handleFileParse" show-file-list accept=".docx">
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">拖拽文件至此处 或 <em>点击此处上传</em></div>
      <template #tip>
        <div class="el-upload__tip">
          注：解析成功后，解析结果将会替换已有内容！
        </div>
      </template>
    </el-upload>
    <!-- <div class="failTip" v-if="!isSuccess">解析失败！</div>
    <div class="successTip" v-if="isSuccess">解析成功！</div> -->
  </el-dialog>
</template>

<script>
import { onMounted, reactive, toRefs, watch, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { upload } from '@/api/common.js'
import Editor from '@tinymce/tinymce-vue' // 引入tinymce编辑器
import tinymce from 'tinymce/tinymce' // tinymce默认hidden，不引入则不显示编辑器
import './js/importTinymce' // 导入配置文件
import { init } from './js/config'

export default {
  name: 'myEditor',
  components: {
    Editor
  },
  props: {
    // 绑定文本值
    modelValue: {
      type: String,
      default: ''
    },
    // placeholder
    placeholder: {
      type: String,
      default: '在此处输入内容（内容不可为空）'
    },
    // 默认样式
    style: {
      type: Object,
      default: () => {
        return { width: '100%', heigth: '89vh' }
      }
    },
    // 图片上传服务器地址
    imgUploadUrl: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const route = useRoute()
    const state = reactive({
      myInit: customer(init), // 初始化
      contentValue: props.modelValue, // 绑定文本
      timeout: null,
      fileParseDialog: false,
      isSuccess: null
    })
    onMounted(() => {
      tinymce.init({})
    })
    // 侦听文本变化并传给外界
    watch(
      () => state.contentValue,
      n => {
        debounce(() => {
          emit('update:modelValue', state.contentValue)
        })
      }
    )
    // 侦听默认值 外界第一次传进来一个 v-model 就赋值给 contentValue
    watch(
      () => props.modelValue,
      n => {
        if (n && n !== state.contentValue) {
          state.contentValue = n
        }
      }
    )
    watch(
      () => route.query,
      () => {
        if (route.query && route.query.isAdd) {
          state.contentValue = '  '
          emit('update:modelValue', state.contentValue)
        }
      }
    )
    watchEffect(() => {
      if (route.query.isAdd) {
        state.contentValue = '  '
        emit('update:modelValue', state.contentValue)
      }
    })

    function debounce(fn, wait = 400) {
      // console.log('进到了防抖', wait)
      if (state.timeout !== null) {
        clearTimeout(state.timeout)
      }
      state.timeout = setTimeout(fn, wait)
    }
    // 参数自定义初始化
    function customer(init) {
      init.setup = editor => {
        editor.ui.registry.addButton('changeEditor', {
          text: '<span>切换MD编辑器</span>',
          tooltip: '切换MD编辑器',
          onAction: () => {
            if (state.contentValue) {
              ElMessageBox.confirm('切换编辑器可能会清空内容！！！', '警告', {
                confirmButtonText: '继续',
                cancelButtonText: '取消',
                type: 'warning'
              })
                .then(() => {
                  emit('changeEditor', ['Markdown', state.contentValue])
                })
                .catch(() => {})
            } else {
              emit('changeEditor', ['Markdown', state.contentValue])
            }
          }
        })
        editor.ui.registry.addButton('fileParse', {
          text: '<span>word文件解析</span>',
          tooltip: 'word文件解析',
          onAction: () => {
            state.fileParseDialog = true
            state.isSuccess = null
          }
        })
      }
      // 允许外界传进来高度和placeholder
      init.height = props.style.heigth
      init.placeholder = props.placeholder
      // 粘贴图片 自动处理 base64
      init.urlconverter_callback = (url, node, onSave, name) => {
        if (node === 'img' && url.startsWith('blob:')) {
          tinymce.activeEditor && tinymce.activeEditor.uploadImages()
        }
        return url
      }
      // 图片上传
      // init.images_upload_handler = (blobInfo, success, failure) => {
      //   imgUploadFn(blobInfo, success, failure)
      // }
      return init
    }
    function imgUploadFn(blobInfo, success, failure) {
      // 可以限制图片大小
      // if (blobInfo.blob().size / 1024 / 1024 > 2) {
      //   failure('上传失败，图片大小请控制在 2M 以内')
      // } else {}
      const params = new FormData()
      params.append('file', blobInfo.blob())
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      // 图片上传
      axios
        .post(props.imgUploadUrl, params, config)
        .then(res => {
          if (res.data.code == 0) {
            success(res.data.data.url) // 上传成功，在成功函数里填入图片路径
            // console.log('[文件上传]', res.data)
          } else {
            failure('上传失败')
          }
        })
        .catch(() => {
          failure('上传出错，服务器开小差了呢')
        })
    }
    // 解析md
    function loadMd() {
      // 本地上传md文件并解析
      const file = document.getElementById('fileInput').files[0]
      // fileName.value = file.name
      console.log(`output->file`, file)
      if (file) {
        const reader = new FileReader()
        reader.readAsText(file, 'UTF-8')
        reader.onload = evt => {
          state.contentValue = evt.target.result
          console.log(`output->`, evt.target.result)
        }
      }
    }
    function handleFileParse(uploadFile, uploadFiles) {
      console.log(uploadFile, uploadFiles)
      state.isSuccess = null
      const files = uploadFile.raw
      // fileName.value = files[0].name
      let formData = new FormData()
      let header = {
        'Content-Type': 'multipart/form-data'
      }
      formData.append('file', files)
      formData.append('type', 'html')
      upload(header, formData).then(res => {
        // form.title = name
        if (res.code === 1000) {
          state.contentValue = res.data
          state.isSuccess = true
          state.fileParseDialog = false
        } else {
          state.isSuccess = false
        }
      })
    }
    return {
      ...toRefs(state),
      customer,
      debounce,
      loadMd,
      handleFileParse
    }
  }
}
</script>

<style lang="scss" scoped>
.my-tinymce {
  width: 100%;
  :deep(.tox-tinymce) {
    border: none;
    border-radius: 0px;
    border-top: 1px solid rgba(0, 0, 0, 0.04);
  }
  :deep(.tox-editor-header) {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.04) !important;
    box-shadow: none !important;
  }
  :deep(.tox-tbtn),
  :deep(.tox-tbtn__select-label),
  :deep(.tox-mbtn__select-label) {
    cursor: pointer !important;
  }
  :deep(.tox-toolbar__primary) {
    background-image: none !important;
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
  .failTip {
    color: red;
    text-align: center;
    font-size: 18px;
  }
  .successTip {
    color: green;
    text-align: center;
    font-size: 18px;
  }
}
</style>
