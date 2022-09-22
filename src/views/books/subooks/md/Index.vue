<template>
  <div>
    <el-card :style="{ 'min-height': minHeight }">
      <template #header>
        <el-button type="primary" @click="goBack">
          <el-icon>
            <Back />
          </el-icon>返回
        </el-button>
      </template>
      <el-form :model="form" ref="formRef" :rules="formRules" size="large" label-width="100px">
        <el-form-item label="分类" prop="category" v-if="isRight === 'right' || categoryId === ''">
          <el-space>
            <el-cascader :options="treeData" v-model="form.category" @change="handleChange"
              :props="{ value: 'id', checkStrictly: true }" clearable :show-all-levels="false" />
            <span style="margin-left: 30px">标签</span>
            <el-cascader :options="taglist" v-model="form.tags" :props="{ value: 'id', label: 'name' }">
            </el-cascader>
          </el-space>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" show-word-limit maxlength="200" placeholder="请输入标题" type="text"></el-input>
        </el-form-item>
        <el-form-item label="编辑器风格" prop="editorType">
          <el-radio-group v-model="editorType" class="ml-4" :disabled="editorDisabled">
            <el-radio label="Markdown" size="large">Markdown</el-radio>
            <el-radio label="tiny" size="large">富文本</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="body">
          <markdown-com :data="md" @input="getMd" v-show="editorType === 'Markdown'"></markdown-com>
          <tinymce-com v-model="tinyValue" placeholder="请输入帖子详情内容(不少于10个字)" v-show="editorType === 'tiny'">
          </tinymce-com>
        </el-form-item>
        <!-- <el-form-item>
          <v-md-editor v-model="md" height="400px"></v-md-editor>
        </el-form-item> -->
        <!-- <div>
          <markdown-com :data="md" @input="getMd"></markdown-com>
        </div> -->
        <el-form-item label="word解析">
          <input type="file" accept=".docx" @change="loadWord" />
        </el-form-item>
        <el-form-item label="上传附件">
          <span>暂不支持</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveHandle" round>发布文章</el-button>
          <el-button round disabled>保存草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import markdown from '@/components/markdown/Index.vue'
import 'mavon-editor/dist/css/index.css';

import Tinymce from '@/components/tinymce'

import { ref, computed, reactive, watch, onMounted, inject } from "vue";
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from "element-plus";
import { getCategorysInfo, addCategorys, updateCategorys } from '@/api/category.js'
import { addForum, updateForum, getForumInfo } from '@/api/forum.js'
import { getTag } from "@/api/tag.js"
import { upload } from '@/api/common.js'
import { judgeNodeType } from '@/utils/methods.js'
export default {
  name: 'editor',
  components: {
    mavonEditor,
    'markdown-com': markdown,
    'tinymce-com': Tinymce
  },
  setup() {
    const reload = inject('reload')
    const router = useRouter();
    const route = useRoute();
    const store = useStore()
    // 是否显示分类
    const isRight = ref("")
    // 最小高度
    const minHeight = computed(() => {
      return window.innerHeight - 55 + "px";
    });
    // 工作空间标题名
    const spaceid = computed(() => sessionStorage.getItem('spaceid'));
    // 节点数据
    const node = computed(() => store.getters.node);
    // 节点数据
    const treeData = ref([])
    // 标签列表
    const taglist = ref([])
    const md = ref('') // markdown编辑器数据
    const tinyValue = ref('') // 富文本编辑器数据
    const editorType = ref('Markdown')
    const editorDisabled = ref(false)
    const formRef = ref(null);
    // 路由传参
    const categoryId = ref("")
    // 表单
    const form = reactive({
      category: '',
      title: '',
      tags: [],
      type: '',
      body: ''
    })
    // 表单校验
    const formRules = reactive({
      category: [{ required: true, message: '请选择所属分类', trigger: 'change' }],
      title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
      body: [{ required: true, message: '内容不能为空', trigger: 'blur' }]
    })

    // 获取节点数据
    const getNodeList = () => {
      getCategorysInfo(spaceid.value).then((res) => {
        treeData.value = judgeNodeType(res.data)
      })
    }

    // 获取标签列表
    const getTagList = () => {
      getTag().then(res => {
        taglist.value = res.data
      })
    }

    // 获取帖子数据
    const getForumData = () => {
      getForumInfo(route.query.mid || route.query.tid).then(res => {
        form.title = res.data.title
        form.category = res.data.category
        form.tags = res.data.tags
        tinyValue.value = res.data.body
        md.value = res.data.body
      })
    };

    md.value = ''
    tinyValue.value = ''
    getNodeList()
    getTagList()
    form.category = node.value.id
    watch(() => route.query, () => {
      // 监控 文章编辑
      if (route.query.mid || route.query.tid) {
        getForumData()
      }
      if (route.query && route.query.category) {
        categoryId.value = route.query.category
        isRight.value = ''
      } else {
        categoryId.value = ''
      }
      // 监控 是否显示分类
      if (route.query && route.query.isRight) {
        isRight.value = route.query.isRight
      } else {
        isRight.value = ''
      }
      if (route.query && route.query.isAdd) {
        md.value = ''
        form.body = ''
        formRef.value.resetFields()
        form.category = route.query.category
        editorDisabled.value = false
        editorType.value = 'Markdown'
      }
      // 监控 编辑器种类与禁用
      if (route.query && route.query.typeof) {
        route.query.typeof === 'w' ? editorType.value = 'Markdown' : editorType.value = 'tiny'
        editorDisabled.value = true
      }
    })

    onMounted(() => {
      form.category = categoryId.value = route.query.category || ''
      isRight.value = route.query.isRight || ''
      route.query.typeof === 'w' ? (editorType.value = 'Markdown') && (editorDisabled.value = true) : (editorType.value = 'tiny') && (editorDisabled.value = true)
      md.value = ''
      tinyValue.value = ''
      if (route.query && route.query.isAdd) {
        editorType.value = 'Markdown'
        editorDisabled.value = false
      }
      if (route.query.mid || route.query.tid) {
        getForumData()
      }
    })

    // 获取md数据
    const getMd = (evt) => {
      if (typeof (evt) == 'string') {
        form.body = evt
      }
    }

    // 选择分类ID
    const handleChange = (id) => {
      var len = id.length
      form.category = id[len - 1]
    }

    // 上传word
    const loadWord = (evt) => {
      const files = evt.target.files
      if (files == null || files.length == 0) {
        alert('请至少选择一个文件！')
        return
      }
      let name = files[0].name
      let formData = new FormData();
      let header = {
        "Content-Type": "multipart/form-data"
      };
      formData.append("file", files[0]);
      editorType.value === 'Markdown' ? formData.append("type", 'md') : formData.append("type", 'html');
      upload(header, formData).then(res => {
        form.title = name
        editorType.value === 'Markdown' ? md.value = res.data : tinyValue.value = res.data
      })
    }

    const handleClose = () => {
      formRef.value.resetFields()
      md.value = ''
      form.body = ''
      router.push({ name: 'subbooks', params: { wRefresh: true } })
    }

    // 发布文章
    const saveHandle = () => {
      if (route.query.mid || route.query.tid) {
        updateApi()
      } else {
        addApi()
      }
    }

    // 新增文章 流程
    const addApi = () => {
      form.author = sessionStorage.getItem('username')
      judgeEditor()
      formRef.value.validate((valid) => {
        if (!valid) return
        if (route.query.isRight == "right") { // 判断新增的文章是否为节点 right - 否
          getSaveApi(form)
        } else {
          save()
        }
      })
    }

    // 编辑文章 流程
    const updateApi = () => {
      form.author = sessionStorage.getItem('username')
      judgeEditor()
      formRef.value.validate((valid) => {
        if (!valid) return
        if (route.query && route.query.isRight == 'right') { // 判断编辑的文章是否为节点 right - 否
          getUpdateForumApi(route.query.mid || route.query.tid, form)
        } else {
          updateForum(route.query.mid || route.query.tid, form).then(res => {
            if (res.code === 1000) {
              getUpdateCategorysApi()
            }
            handleClose()
            reload()
            toDetail(res.data)
          }) 
        }
      })
    }

    // 编辑文章 API
    const getUpdateForumApi = (id, form) => {
      updateForum(id, form).then(res => {
        ElMessage({
          message: "编辑成功！",
          type: "success",
        });
        toDetail(res.data)
      })
    }

    // 更新节点 API
    const getUpdateCategorysApi = () => {
      const title = { name: form.title }
      updateCategorys(form.category, title).then((res) => {
        ElMessage({
          message: '编辑成功！',
          type: 'success',
        })
      })
    }

    // 新增文章 API
    const getSaveApi = (form) => {
      addForum(form).then(res => {
        ElMessage({
          message: "新增成功",
          type: "success",
        });
        if (res.code === 1000) {
          handleClose()
          reload()
          toDetail(res.data)
        }
      })
    }

    // getApi
    const save = () => {
      let params = {
        name: form.title,
        parent_category: form.category,
        type: form.type
      }
      // 新增节点
      addCategorys(params).then((res) => {
        if (res.code == 1000) {
          form.category = res.data
          // 新增markdown
          addForum(form).then(res => {
            ElMessage({
              message: "新增成功",
              type: "success",
            });
            if (res.code === 1000) {
              handleClose()
              reload()
              toDetail(res.data)
            }
          })
        }
      })
    }
    // 跳转到详情页
    const toDetail = (wid) => {
      if (route.query && route.query.isRight) {
        router.replace({ name: 'detail', query: { wid: wid, isRight: 'right' } })
      } else {
        router.replace({ name: 'detail', query: { wid: wid } })
      }
    }
    // 返回
    const goBack = () => {
      // router.push({ name: 'subbooks' })
      router.go(-1)
    }

    // 判断编辑器种类和内容
    const judgeEditor = () => {
      editorType.value === 'Markdown' ? '' : form.body = tinyValue.value
      editorType.value === 'Markdown' ? form.type = 'w' : form.type = 'a'
    }

    return {
      minHeight,
      form,
      formRef,
      formRules,
      treeData,
      taglist,
      node,
      md,
      getMd,
      goBack,
      handleChange,
      loadWord,
      handleClose,
      saveHandle,
      categoryId,
      save, reload, getSaveApi, isRight, toDetail, editorType, tinyValue, editorDisabled, judgeEditor
    }
  },
}
</script>

<style lang="scss" scoped>
.my-tinymce {
  margin-bottom: 30px;
  width: 100%;
}
</style>