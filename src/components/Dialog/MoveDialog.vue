<template>
  <el-dialog class="moveDialog" v-model="visible" width="600px" align-center @close="closeDialog">
    <template #header="{ titleId, titleClass }">
      <div class="header" style="background-color: #fff;">
        <h6 :id="titleId" :class="titleClass">移动到...</h6>
      </div>
    </template>
    <p>可移动到有创建文档权限的知识库</p>
    <div class="body">
      <div class="select">
        <el-select v-model="selectTeamValue" placement="bottom-start" popper-class="selectList">
          <template #prefix>
            <img v-if="selectTeamName === '共享知识库'" class="prefix-icon" src="@/assets/icons/publicIcon.svg" />
            <img v-else class="prefix-icon" src="@/assets/icons/publicIcon.svg" />
          </template>
          <el-option v-for="(item, index) in teamList" :key="'teamList' + index" :label="item.groupname" :value="item.id">
            <div style="display: flex; align-items: center">
              <img class="icon" src="@/assets/icons/publicIcon.svg" alt="" />
              <span>{{ item.groupname }}</span>
            </div>
            <img v-if="item.id === selectTeamValue" class="selectIcon" src="@/assets/icons/selectIcon.svg" />
          </el-option>
        </el-select>
        <span class="line"> / </span>
        <el-select v-model="selectLibarayValue" popper-class="selectList" placement="bottom-start" @change="changeLibrary">
          <template #prefix>
            <img class="prefix-icon" src="@/assets/icons/bookIcon.svg" />
          </template>
          <el-option v-for="(item, index) in libarayList" :key="'libarayList' + index" :label="item.name" :value="item.id">
            <div style="display: flex; align-items: center">
              <img class="icon" src="@/assets/icons/bookIcon.svg" alt="" />
              <span>{{ item.name }}</span>
            </div>
            <img v-if="item.id === selectLibarayValue" class="selectIcon" src="@/assets/icons/selectIcon.svg" />
          </el-option>
        </el-select>
      </div>
      <div class="list">
        <div class="list-header">
          <span>请选择要放置的目录位置</span>
          <div class="list-button">
            <el-tooltip effect="dark" content="置顶" placement="top" :show-arrow="false">
              <span @click="changeTop('1')">
                <img src="@/assets/icons/pinTopIcon.svg" alt="" />
              </span>
            </el-tooltip>
            <el-tooltip effect="dark" content="置底" placement="top" :show-arrow="false">
              <span class="pinDown" @click="changeTop('2')">
                <img src="@/assets/icons/pinTopIcon.svg" alt="" />
              </span>
            </el-tooltip>
          </div>
        </div>
        <div class="content">
          <div class="pinTop" v-if="isTop === '1'">
            <svg
              width="1em"
              height="1em"
              viewBox="0 0 13 6"
              xmlns="http://www.w3.org/2000/svg"
              class="larkui-icon larkui-icon-catalog-caret icon-svg CatalogSelector-module_caret_jxv72 index-module_size_wVASz"
              data-name="CatalogCaret"
              style="width: 13px; min-width: 13px; height: 6px;"
            >
              <path
                d="M1 0h8.104a.5.5 0 0 1 .313.11l2.618 2.112a1 1 0 0 1 0 1.556L9.417 5.89A.5.5 0 0 1 9.104 6H1a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1Z"
                fill="#1890FF"
                fill-rule="evenodd"
              ></path>
            </svg>
            <div class="line"></div>
          </div>
          <el-tree
            :data="dataSource"
            node-key="id"
            :current-node-key="articleId"
            :props="treeProps"
            highlight-current
            default-expand-all
            @node-click="toSelectArticle"
          >
            <template #default="{ node, data }">
              <span class="list-node">
                <div class="title">
                  <div :class="['icon', !data.length ? 'no-icon' : '']">
                    <img src="@/assets/icons/miniDropDownIcon.svg" alt="" v-if="data.length && node.expanded" />
                    <img class="foldIcon" src="@/assets/icons/miniDropDownIcon.svg" alt="" v-if="data.length && !node.expanded" />
                  </div>
                  <span>{{ data.label }}</span>
                </div>
                <div class="button" v-if="articleId === data.id">
                  <span v-if="data.type === 'l'">移动为</span>
                  <span v-else>不可移动到文章节点下</span>
                  <div>
                    <el-radio-group v-model="radioType" class="radio-group">
                      <!-- <el-radio label="1">同级</el-radio> -->
                      <el-radio v-if="data.type === 'l'" label="2">子级</el-radio>
                    </el-radio-group>
                  </div>
                </div>
                <div class="pin" v-if="articleId === data.id && isTop === '0' && data.type === 'l'">
                  <svg
                    width="1em"
                    height="1em"
                    viewBox="0 0 13 6"
                    xmlns="http://www.w3.org/2000/svg"
                    class="larkui-icon larkui-icon-catalog-caret icon-svg CatalogSelector-module_caret_jxv72 index-module_size_wVASz"
                    data-name="CatalogCaret"
                    style="width: 13px; min-width: 13px; height: 6px;"
                  >
                    <path
                      d="M1 0h8.104a.5.5 0 0 1 .313.11l2.618 2.112a1 1 0 0 1 0 1.556L9.417 5.89A.5.5 0 0 1 9.104 6H1a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1Z"
                      fill="#1890FF"
                      fill-rule="evenodd"
                    ></path>
                  </svg>
                  <div class="line"></div>
                </div>
              </span>
            </template>
          </el-tree>
          <div class="pinDown" v-if="isTop === '2'">
            <svg
              width="1em"
              height="1em"
              viewBox="0 0 13 6"
              xmlns="http://www.w3.org/2000/svg"
              class="larkui-icon larkui-icon-catalog-caret icon-svg CatalogSelector-module_caret_jxv72 index-module_size_wVASz"
              data-name="CatalogCaret"
              style="width: 13px; min-width: 13px; height: 6px;"
            >
              <path
                d="M1 0h8.104a.5.5 0 0 1 .313.11l2.618 2.112a1 1 0 0 1 0 1.556L9.417 5.89A.5.5 0 0 1 9.104 6H1a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1Z"
                fill="#1890FF"
                fill-rule="evenodd"
              ></path>
            </svg>
            <div class="line"></div>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="success" @click="toSubmit">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { getCategorys, getCategorysInfo, updateCategorys } from '@/api/category.js'
import { ElMessage } from 'element-plus'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false
  },
  aId: {
    type: Number,
    default: 0
  },
  spacename: {
    type: String,
    default: ''
  },
  aname: {
    type: String,
    default: ''
  },
  aType: {
    type: String,
    default: ''
  },
  ar: {
    type: Number,
    default: 0
  }
})
const emit = defineEmits(['closeDialog'])

const route = useRoute()
const router = useRouter()
const store = useStore()
const visible = ref(false)
const dataSource = ref([]) // 目录树
const selectTeamValue = ref(1)
const isType = ref('')
const selectTeamName = ref('共享知识库')
const spacename = ref('')
const teamList = ref([
  {
    id: 1,
    groupname: '共享知识库',
    is_default: '1'
  }
  // {
  //   id: 0,
  //   groupname: '个人知识库',
  //   is_default: '0'
  // }
])
const selectLibarayValue = ref(Number(route.query.spaceid))
const libarayList = ref([])
const articleId = ref(Number(props.aId))
const radioType = ref('2')
const treeProps = {
  class: 'articleList'
}
const isTop = ref('1')

watch(
  () => props.isShow,
  async newVal => {
    spacename.value = props.spacename
    isType.value = 'a'
    visible.value = newVal
    articleId.value = Number(props.aId)
    selectLibarayValue.value = Number(route.query.spaceid)
    if (visible.value) {
      await getMyBooks()
      await getNodeList()
    }
  }
)

const closeDialog = () => {
  visible.value = false
  isTop.value = '0'
  emit('closeDialog', false)
}

const toSubmit = () => {
  if (isType.value !== 'l') {
    return ElMessage.warning('不可移动到该目录')
  }
  const params = {
    name: props.aname,
    parent_category: articleId.value
  }
  console.log(`output->params`, props.aId, params)
  toMove()
}

// 获取知识库列表
const getMyBooks = () => {
  const params = {
    public: selectTeamValue.value,
    author: sessionStorage.getItem('username') || ''
  }
  selectTeamValue.value === 1 ? delete params.author : ''
  getCategorys(params).then(res => {
    libarayList.value = res.data
  })
}

// 获取目录树
const getNodeList = async () => {
  let res = await getCategorysInfo(selectLibarayValue.value)
  if (res.code === 1000) {
    res.data.forEach(item => {
      item.isFolder = true
    })
    dataSource.value = res.data
  }
}

const changeLibrary = val => {
  spacename.value = libarayList.value.find(item => item.id === val).name
  console.log(`output->spacename.value`, spacename.value, selectLibarayValue.value)
  selectLibarayValue.value = val
  getNodeList()
}

const typeData = ref({
  a: {
    name: 'detail'
  },
  m: {
    name: 'mindMap'
  },
  p: {
    name: 'FramePPT'
  },
  w: {
    name: 'detail'
  },
  e: {
    name: 'excel'
  }
})

const toSelectArticle = val => {
  console.log(`output->val`, val)
  isType.value = val.type
  isTop.value = '0'
  articleId.value = val.id
  if (val.type === 'l') {
    radioType.value = '2'
  }
}

const changeTop = val => {
  isTop.value = val
}

const toMove = () => {
  const params = {
    name: props.aname,
    parent_category: articleId.value
  }
  const query = ref({})
  switch (props.aType) {
    case 'a':
      query.value = {
        spaceid: selectLibarayValue.value,
        spacename: spacename.value,
        aid: props.ar
      }
      break
    case 'm':
      query.value = {
        spaceid: selectLibarayValue.value,
        spacename: spacename.value,
        mid: props.ar
      }
      break
    case 'p':
      query.value = {
        spaceid: selectLibarayValue.value,
        spacename: spacename.value,
        pid: props.ar
      }
      break
    case 'w':
      query.value = {
        spaceid: selectLibarayValue.value,
        spacename: spacename.value,
        wid: props.ar
      }
      break
    case 'e':
      query.value = {
        spaceid: selectLibarayValue.value,
        spacename: spacename.value,
        eid: props.ar
      }
      break
    default:
      break
  }
  updateCategorys(props.aId, params).then(async res => {
    if (res.code === 1000) {
      ElMessage.success('移动成功')
      visible.value = false
      emit('closeDialog', false)
      console.log(`output->props.aType`, props.aType)
      console.log(`output->`, props.aType, {
        name: typeData.value[props.aType].name,
        query: query.value
      })
      await store.commit('books/SET_REFRESH', true)
      sessionStorage.setItem('deleteNode', JSON.stringify(props.aId))
      router.push({ name: 'subbooks', params: { wRefresh: true } })
    }
  })
}
</script>

<style lang="scss">
.moveDialog {
  border-radius: 8px;
  h6 {
    margin-bottom: 8px;
    font-size: 16px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
  }
  .el-dialog__body {
    padding-top: 0;
  }
  p {
    margin-bottom: 16px;
    font-weight: 400;
    font-size: 14px;
    color: #585a5a;
  }
  .select {
    margin-bottom: 25px;
    .el-select {
      width: 160px;
      height: 32px;
      font-size: 14px;
      border-radius: 6px;
      .select-trigger {
        border-radius: 6px;
        height: 32px;
      }
    }
    .line {
      margin: 0px 12px;
      line-height: 32px;
    }
  }
  .list {
    &-header {
      color: #262626;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      .list-button {
        display: flex;
        align-items: center;
        span {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 20px;
          height: 20px;
          margin-left: 8px;
          cursor: pointer;
          img {
            width: 9px;
            min-width: 9px;
            height: 13px;
          }
          &:hover {
            background-color: #e7e9e8;
            border-radius: 2px;
          }
        }
        .pinDown {
          img {
            transform: rotate(180deg);
          }
        }
      }
    }
    .content {
      padding: 16px;
      border: 1px solid rgba(0, 0, 0, 0.06);
      color: #262626;
      font-size: 14px;
      font-variant: tabular-nums;
      list-style: none;
      font-feature-settings: 'tnum';
      background: #fff;
      border-radius: 6px;
      position: relative;
      .articleList {
        .el-tree-node__content {
          border-radius: 4px;
          margin-top: 4px;
          width: 100%;
          box-sizing: border-box;
        }
      }
      .el-tree {
        height: 326px;
        overflow: hidden auto;
        .list-node {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          height: 23px;
          position: relative;
          .button {
            display: flex;
            align-items: center;
            span {
              color: #8a8f8d;
            }
            .radio-group {
              margin-left: 8px;
              margin-right: 8px;
              .el-radio {
                margin-right: 8px;
                margin-left: 0px;
                .el-radio__label {
                  color: #262626;
                  margin-left: 4px;
                  margin-right: 4px;
                  padding: 0;
                }
              }
            }
          }
          .pin {
            position: absolute;
            bottom: -2px;
            left: 16px;
            display: flex;
            align-items: center;
            position: absolute;
            width: calc(100% - 16px);
            max-width: 546px;
            svg {
              width: 13px;
              min-width: 13px;
              height: 6px;
            }
            .line {
              margin-left: 4px;
              width: 100%;
              height: 1px;
              background-color: #117cee;
            }
          }
        }
        .no_folder {
          &:hover {
            cursor: not-allowed !important;
            background-color: #fff !important;
          }
        }
      }
      .pinTop {
        width: 100%;
        max-width: 546px;
        display: flex;
        align-items: center;
        position: absolute;
        top: 8px;
        left: 16px;
        .line {
          margin-left: 4px;
          width: 100%;
          height: 1px;
          background-color: #117cee;
        }
        svg {
          width: 13px;
          min-width: 13px;
          height: 6px;
        }
      }
      .pinDown {
        width: 100%;
        max-width: 546px;
        display: flex;
        align-items: center;
        position: absolute;
        bottom: 8px;
        left: 16px;
        .line {
          margin-left: 4px;
          width: 100%;
          height: 1px;
          background-color: #117cee;
        }
        svg {
          width: 13px;
          min-width: 13px;
          height: 6px;
        }
      }
    }
  }
}
.selectList {
  li {
    display: flex !important;
    align-items: center;
    justify-content: space-between;
    width: 280px;
    .icon {
      width: 24px !important;
      height: 24px !important;
      margin-right: 12px !important;
    }
  }
}
</style>
