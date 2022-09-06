<template>
  <div>
    <el-card :style="{ 'min-height': minHeight }">
      <template #header>
        <el-button @click="goBack">
          <el-icon>
            <Back />
          </el-icon>
          返回
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
        <div class="tinymce">
          <tinymce-com v-model="value" placeholder="请输入帖子详情内容(不少于10个字)"></tinymce-com>
        </div>
        <el-form-item label="word解析">
          <input type="file" accept=".docx, .doc" @change="loadWord" />
        </el-form-item>
        <el-form-item label="附件">
          <span>暂不支持</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveHandle" round>发布文章</el-button>
          <el-button @click="previewHandle" round>预览文章</el-button>
          <el-button @click="draftHandle" round disabled>保存草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-dialog title="预览" v-model="dialog" width="60%">
      <div v-html="form.body"></div>
      <!-- <div class="markdown-body" v-html="form.content"></div> -->
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, toRefs, computed, watch, onMounted, inject } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from "element-plus";
import { getCategorysInfo, addCategorys, updateCategorys } from '@/api/category.js'
import { upload } from '@/api/common.js'
import { addForum, updateForum, getForumInfo } from '@/api/forum.js'
import { getTag } from "@/api/tag.js"
import Tinymce from '@/components/tinymce'
import { judgeNodeType } from '@/utils/methods.js'
export default {
  components: {
    'tinymce-com': Tinymce
  },
  setup() {
    const reload = inject('reload')
    const router = useRouter();
    const route = useRoute();
    const store = useStore()
    // 工作空间
    const spaceid = computed(() => sessionStorage.getItem('spaceid'));
    // 节点数据
    const node = computed(() => store.getters.node);
    // 最小高度
    const minHeight = computed(() => {
      return window.innerHeight - 55 + "px";
    });
    // 预览对话框
    const dialog = ref(false)
    // 节点数据
    const treeData = ref([])
    // 标签列表
    const taglist = ref([])
    // 路由传参
    const categoryId = ref("")
    // 富文本数据
    const state = reactive({
      value: ''
    })
    // 是否显示分类
    const isRight = ref("")

    const formRef = ref(null);
    // 表单
    const form = reactive({
      category: '',
      title: '',
      tags: [],
      type: 'a',
      body: ''
    })
    // 表单校验
    const formRules = reactive({
      category: [{ required: true, message: '请选择所属话题', trigger: 'change' }],
      title: [{ required: true, message: '请输入标题', trigger: 'blur' }]
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
      getForumInfo(route.query.tid).then(res => {
        form.title = res.data.title
        form.category = res.data.category
        form.tags = res.data.tags
        state.value = res.data.body
      })
    };

    getTagList()
    getNodeList()
    form.category = node.value.id

    // 监控 文章编辑
    watch(() => route.query.tid, () => {
      if (route.query.tid) {
        getForumData()
      }
    })

    watch(() => route.query, () => {
      // 监控 分组ID
      if (route.query && route.query.category) {
        form.category = categoryId.value = route.query.category
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
        formRef.value.resetFields()
        state.value = ''
        form.body = ''
        form.title = ''
        form.tags = []
      }
      if (route.query && route.query.type == 'right') {
        getTagList()
        getNodeList()
      }
    })

    onMounted(() => {
      form.category = categoryId.value = route.query.category || ''
      isRight.value = route.query.isRight || ''
      getNodeList()
      if (route.query.tid) {
        getForumData()
      }
    })

    const loadWord = (evt) => {
      const files = evt.target.files
      if (files == null || files.length == 0) {
        alert('No files wait for import')
        return
      }
      let name = files[0].name
      // console.log(name)
      // console.log(files[0])
      let formData = new FormData();
      let header = {
        "Content-Type": "multipart/form-data"
      };
      formData.append("file", files[0]);
      formData.append("type", 'html');
      upload(header, formData).then(res => {
        form.title = name
        state.value = res.data
      })
    }

    // 返回
    const goBack = () => {
      router.push({ name: 'subbooks' })
    }

    // 关闭事件
    const handleClose = () => {
      formRef.value.resetFields()
      state.value = ''
      form.body = ''
      router.push({ name: 'subbooks', params: { wRefresh: true } })
    }

    const handleChange = (id) => {
      var len = id.length
      form.category = id[len - 1]
    }

    // 发布文章
    const saveHandle = () => {
      if (state.value == '') {
        ElMessage({
          message: "内容不能为空",
          type: "warning",
        });
        return
      }
      if (route.query.tid) {
        updateApi()
      } else {
        addApi()
      }
    }

    // 新增文章
    const addApi = () => {
      form.body = state.value
      form.author = sessionStorage.getItem('username')
      formRef.value.validate((valid) => {
        if (!valid) return
        if (route.query.type == "right") {
          getSaveApi(form)
        } else {
          save()
        }
      })
    }

    // 文章编辑
    const updateApi = () => {
      form.body = state.value
      form.author = sessionStorage.getItem('username')
      formRef.value.validate((valid) => {
        if (!valid) return
        if (route.query && route.query.isRight == 'right') {
          getUpdateForumApi(route.query.tid, form)
        } else {
          updateForum(route.query.tid, form).then(res => {
            if (res.code === 1000) {
              getUpdateCategorysApi()
            }
            handleClose()
            reload()
            toDetail(route.query.tid)
          })
        }
      })
    }

    // 编辑文章API 
    const getUpdateForumApi = (id, form) => {
      updateForum(id, form).then(res => {
        ElMessage({
          message: "编辑成功！",
          type: "success",
        });
        handleClose()
        toDetail(route.query.tid)
      })
    }

    // 新增文章 API
    const getSaveApi = (form) => {
      addForum(form).then(res => {
        if (res.code === 1000) {
          ElMessage({
            message: "新增成功",
            type: "success",
          });
          handleClose()
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
          // 新增文章
          addForum(form).then(res => {
            if (res.code === 1000) {
              ElMessage({
                message: "新增成功",
                type: "success",
              });
              handleClose()
              reload()
              toDetail(res.data)
            }
          })
        }
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
    // 跳转到详情页
    const toDetail = (wid) => {
      router.replace({ name: 'detail', query: { wid: wid } })
    }
    // 预览
    const previewHandle = () => {
      form.body = state.value
      dialog.value = true
    }

    // 保存草稿
    const draftHandle = () => {
      formRef.value.validate((valid) => {
        if (!valid) return
        ElMessage({
          message: "暂不支持",
          type: "warning",
        });
      })
    }

    return {
      ...toRefs(state),
      minHeight,
      treeData,
      node,
      form,
      formRef,
      formRules,
      taglist,
      dialog,
      previewHandle,
      saveHandle,
      draftHandle,
      handleChange,
      goBack,
      loadWord,
      categoryId,
      save,
      reload,
      getSaveApi,
      isRight, toDetail
    }
  },
}
</script>

<style scoped>
/* .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
} */
.tinymce {
  margin-left: 100px;
  margin-bottom: 30px;
  width: 80%;
}

.el-input {
  width: 80%;
}
</style>