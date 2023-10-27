<script setup>
import { ref, watch, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { selectUserInfoApi, getPermissionsApi, addPermissionsApi, deletePermissionsApi, selectUserApi } from '@/api/base'
import { ElMessage } from 'element-plus/lib/components'
import { Search } from '@element-plus/icons-vue'

const props = defineProps({
  isDisabled: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()
const searchValue = ref('')
const searchList = []
const selectedUserList = ref([])
const isShowUserOperationPopver = ref(false)
const article = ref(route.query.tid || route.query.wid || '')
const dialogVisible = ref(false)
const memberList = ref([])
const selectTotal = ref(0)
const total = ref(0)
const page = ref(1)
const size = ref(10)
const selectMemberList = ref([])
const inputName = ref('')

watchEffect(async () => {
  article.value = route.query.tid || route.query.wid || ''
})

watch(
  () => dialogVisible.value,
  async () => {
    if (dialogVisible.value) {
      console.log(`output->23`, 23)
      page.value = 1
      let res = await selectUserApi({ page: page.value })
      if (res.code === 1000) {
        memberList.value = res.data
        total.value = res.total
        for (let i = 0; i < memberList.value.length; i++) {
          memberList.value[i].id = null
          memberList.value[i].status = false // 默认设置为 false
          for (let j = 0; j < selectedUserList.value.length; j++) {
            if (memberList.value[i].name === selectedUserList.value[j].permusername) {
              memberList.value[i].id = selectedUserList.value[j].id
              memberList.value[i].status = true // 如果找到匹配，设置为 true
              break // 如果找到匹配，可以提前退出内层循环
            }
          }
        }

        console.log(`output->memberList.value`, memberList.value, selectedUserList.value)
      }
    }
  }
)

const querySearch = async (queryString, cb) => {
  searchList.value = []
  if (queryString) {
    let res = await selectUserInfoApi({ name: queryString })
    searchList.value = res.data
  }
  cb(searchList.value)
}

const handleSelect = item => {
  addPermissions('e', item.name)
}

// add
const addPermissions = async (permtype, permusername) => {
  const params = {
    article: article.value,
    permtype,
    permusername
  }
  let res = await addPermissionsApi(params)
  if (res.code === 1000) {
    ElMessage.success('添加成功')
    await getPermissions()
    await handleCurrentChange(page.value)
  }
}

const getPermissions = async () => {
  const params = {
    article: article.value
  }
  let res = await getPermissionsApi(params)
  if (res.code === 1000) {
    selectedUserList.value = res.data
  }
}

const deletePermissions = async id => {
  let res = await deletePermissionsApi(id)
  if (res.code === 1000) {
    ElMessage.success('移除成功')
    await getPermissions()
    await handleCurrentChange(page.value)
  }
}

const handleCommand = val => {
  const [type, item] = val
  switch (type) {
    case 'edit':
      break
    case 'delete':
      deletePermissions(item.id)
      break
    default:
      break
  }
}

const onShowUserOperationPopver = val => {
  isShowUserOperationPopver.value = val
}

const onGetPermissions = () => {
  if (props.isDisabled) return ElMessage.error('非作者本人无操作权限')
  getPermissions()
}

const handleClose = async () => {
  selectMemberList.value = []
  dialogVisible.value = false
}

const handleSelectionChange = val => {
  selectMemberList.value = val
  selectTotal.value = val.length
}

const handleSizeChange = async value => {
  size.value = value
  console.log(`output->size.value`, size.value)
  let res = await selectUserApi({ page: page.value })
  if (res.code === 1000) {
    memberList.value = res.data
    total.value = res.total
    for (let i = 0; i < memberList.value.length; i++) {
      memberList.value[i].status = false // 默认设置为 false
      for (let j = 0; j < selectedUserList.value.length; j++) {
        if (memberList.value[i].name === selectedUserList.value[j].permusername) {
          memberList.value[i].status = true // 如果找到匹配，设置为 true
          break // 如果找到匹配，可以提前退出内层循环
        }
      }
    }
  }
}

// 页码响应
const handleCurrentChange = async value => {
  page.value = value
  let res = await selectUserApi({ page: page.value })
  if (res.code === 1000) {
    memberList.value = res.data
    total.value = res.total
    for (let i = 0; i < memberList.value.length; i++) {
      memberList.value[i].id = null
      memberList.value[i].status = false // 默认设置为 false
      for (let j = 0; j < selectedUserList.value.length; j++) {
        if (memberList.value[i].name === selectedUserList.value[j].permusername) {
          memberList.value[i].id = selectedUserList.value[j].id
          memberList.value[i].status = true // 如果找到匹配，设置为 true
          break // 如果找到匹配，可以提前退出内层循环
        }
      }
    }
  }
}

const toChangePermissions = (val, type) => {
  console.log(`output->val`, val)
  if (type === 'add') {
    addPermissions('e', val.name)
  } else {
    deletePermissions(val.id)
  }
}

const searchMember = async () => {
  let res = await selectUserInfoApi({ name: inputName.value, page: 1 })
  if (res.code === 1000) {
    memberList.value = res.data
    total.value = res.total
    for (let i = 0; i < memberList.value.length; i++) {
      memberList.value[i].id = null
      memberList.value[i].status = false // 默认设置为 false
      for (let j = 0; j < selectedUserList.value.length; j++) {
        if (memberList.value[i].name === selectedUserList.value[j].permusername) {
          memberList.value[i].id = selectedUserList.value[j].id
          memberList.value[i].status = true // 如果找到匹配，设置为 true
          break // 如果找到匹配，可以提前退出内层循环
        }
      }
    }
  }
}
</script>

<template>
  <el-popover
    popper-class="cooperatePopverPopver"
    placement="bottom-end"
    width="422px"
    trigger="click"
    hide-after="100"
    :show-arrow="false"
    :disabled="props.isDisabled"
  >
    <template #reference>
      <div class="ignore-cooperate-icon" @click="onGetPermissions()">
        <img src="@/assets/icons/cooperateIcon.svg" alt="" />
      </div>
    </template>
    <div class="box">
      <div class="box-top" style="padding: 20px 20px 0 20px;">
        <span style="font-size: 16px;">文档协作者</span>
        <el-button type="primary" link style="font-size: 14px; " @click="dialogVisible = true">+ 批量添加</el-button>
      </div>
      <div class="box-content">
        <div class="search">
          <el-autocomplete
            :teleported="false"
            popper-class="cooperatePopverPopver-search-list"
            v-model="searchValue"
            :fetch-suggestions="querySearch"
            :trigger-on-focus="false"
            clearable
            class="inline-input w-50"
            placeholder="输入用户名邀请协作"
            @select="handleSelect"
          >
            <template #default="{ item }">
              <img src="@/assets/img/img.jpg" alt="" />
              <div class="value">{{ item.nickname }}</div>
            </template>
          </el-autocomplete>
        </div>
        <div class="userlist-box" v-if="selectedUserList.length">
          <div class="userlist">
            <div class="item" v-for="(item, index) in selectedUserList" :key="'selectedUserList' + index">
              <div class="item-left">
                <img src="@/assets/img/img.jpg" alt="" />
                <span class="nickname" style="font-size: 14px;">
                  {{ item.permusername }}
                  <span class="name" style="font-size: 14px;">({{ item.permusername }})</span>
                </span>
              </div>
              <div class="item-right">
                <el-dropdown
                  :teleported="false"
                  ref="userOperationPopverRef"
                  trigger="click"
                  placement="bottom-end"
                  popper-class="userOperation-popver"
                  @command="handleCommand"
                  @visible-change="onShowUserOperationPopver"
                >
                  <div :class="['ignore-role-selector', isShowUserOperationPopver ? 'ignore-selected' : '']">
                    <span class="user-dropdown"> 可编辑</span>
                    <img src="@/assets/icons/arrowDownIcon.svg" alt="" />
                  </div>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item :command="['edit', item]">
                        <div class="item">
                          <div class="item-left">
                            <span>可编辑</span>
                            <span class="des">拥有文档的编辑权限</span>
                          </div>
                          <div class="item-right">
                            <img src="@/assets/icons/selectIcon.svg" alt="" />
                          </div>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item :command="['onlyRead', item]" disabled>
                        <div class="item disabled">
                          <el-tooltip class="box-item" effect="dark" content="暂未开放" placement="top-end" :show-arrow="false" offset="0">
                            <div class="item-left">
                              <span>可阅读</span>
                              <span class="des">仅拥有只读和评论权限</span>
                            </div>
                          </el-tooltip>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item :command="['delete', item]">
                        <div class="item">
                          <div class="item-left delete">
                            <span>移除</span>
                            <span class="des">移除该协作者</span>
                          </div>
                        </div>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </div>
        </div>
        <div class="userlist-empty" v-else>
          <div class="empty">
            <div class="empty-img">
              <img src="@/assets/img/cooperate.png" alt="" />
            </div>
            <p>暂无文档协作者</p>
          </div>
        </div>
        <!-- <div class="share">
          <p>拿到链接的人可获得编辑权限</p>
          <div class="share-button">
            <el-input placeholder="输入用户名邀请协作" v-model="link" disabled />
            <el-button type="primary">复制链接</el-button>
          </div>
        </div> -->
      </div>
    </div>
  </el-popover>

  <el-dialog class="addMemberDialog" v-model="dialogVisible" title="批量添加" width="600" :before-close="handleClose" append-to-body>
    <!-- <div class="header">仅展示无协作权限的人员</div> -->
    <!-- <el-input v-model="inputName" placeholder="请输入姓名进行搜索" clearable :prefix-icon="Search" @change="searchMember" /> -->
    <el-table
      ref="memberListRef"
      :data="memberList"
      row-key="id"
      @selection-change="handleSelectionChange"
      min-height="100"
      max-height="800"
      empty-text="暂无可添加成员"
      width="100%"
    >
      <!-- <el-table-column type="selection" :reserve-selection="true" width="55" /> -->
      <el-table-column property="nickname" label="姓名" />
      <el-table-column property="status" label="状态">
        <template #default="{ row }">
          <el-tag v-if="row.status">已添加</el-tag>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button v-if="row.status" type="danger" @click="toChangePermissions(row, 'delete')">移除</el-button>
          <el-button v-else type="success" @click="toChangePermissions(row, 'add')">添加</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin: 10px 0 20px 0;justify-content: flex-end"
      :total="total"
      :current-page="page"
      :page-size="size"
      :page-sizes="[10, 20, 50, 100]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout="total, prev, pager, next, jumper"
    ></el-pagination>
    <!-- <template #footer>
      <span class="footer">
        <div class="left">
          <span class="count">已选择 {{ selectTotal }}人</span>
          <span>
            添加为：
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                成员
                <i-ep-ArrowDown />
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>成员</el-dropdown-item>
                  <el-dropdown-item disabled>只读成员</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </span>
        </div>
        <el-button type="success" @click="toAddMember"> 添加 </el-button>
      </span>
    </template> -->
  </el-dialog>
</template>

<style lang="scss" scoped>
.cooperatePopverPopver {
  box-sizing: border-box;
  .box {
    &-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 20px 0 20px;
      span {
        text-align: left;
        font-weight: 700;
        font-size: 16px;
        line-height: 24px;
        cursor: pointer;
      }
    }
  }
  .box-content {
    .search {
      display: flex;
      justify-content: space-between;
      padding: 16px 20px;
      height: 40px;
      :deep(.el-autocomplete) {
        width: 100%;
        .el-input {
          height: 40px;
        }
        .el-input__wrapper {
          border-radius: 6px;
          border: 1px solid #d9d9d9;
          box-shadow: none;
          &:hover {
            border-color: #0bd07d;
          }
        }
      }
    }
    .userlist-empty {
      height: 244px;
      padding-top: 40px;
      padding-bottom: 56px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      box-sizing: border-box;
      border-bottom: 1px solid #eff0f0;
      .empty {
        &-img {
          width: 110px;
          height: 110px;
          padding: 15.28px 0 11.68px 12.83px;
          margin-bottom: 16px;
          box-sizing: border-box;
          img {
            width: 97.78px;
            height: 83.04px;
          }
        }
        p {
          color: #8a8f8d;
          font-size: 14px;
        }
      }
    }
    .userlist-box {
      border-bottom: 1px solid #eff0f0;
      .userlist {
        padding: 0 10px 10px 10px;
        max-height: 244px;
        overflow-y: auto;
        overflow-x: clip;
        .item {
          padding: 10px;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          &-left {
            display: flex;
            align-items: center;
            color: #262626;
            .name {
              color: #8a8f8d;
              margin-left: 3px;
            }
            img {
              width: 32px;
              min-width: 32px;
              height: 32px;
              border-radius: 16px;
              margin-right: 12px;
            }
          }
          &-right {
            display: flex;
            align-items: center;
            height: 32px;
            :deep(.el-dropdown) {
              position: unset;
            }
            :deep(.userOperation-popver) {
              position: unset;
              display: flex;
              align-items: center;
              width: 216px;
              box-sizing: border-box;
              .el-scrollbar {
                width: 100%;
              }
              ul {
                width: 100%;
                padding: 0px;
              }
              li {
                padding: 0 12px;
                .item {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  height: 44px;
                  padding: 12px 0;
                  width: 100%;
                  &-left {
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: flex-start;
                    color: #262626;
                    font-size: 14px;
                    .des {
                      color: #8a8f8d;
                      font-size: 12px;
                    }
                  }
                }
                .delete {
                  color: #df2a3f;
                }
                .disabled {
                  &:hover {
                    background: #fff;
                  }
                }
              }
            }
            .ignore-role-selector {
              display: flex;
              align-items: center;
              cursor: pointer;
              height: 26px;
              .user-dropdown {
                display: flex;
                align-items: center;
              }
              img {
                margin-left: 8px;
                width: 16px;
                min-width: 16px;
                height: 16px;
              }
            }
            .ignore-selected {
              padding: 2px 0;
              border-radius: 4px;
              color: #8a8f8d;
              background-color: #eff0f0;
              img {
                transform: rotate(-180deg);
                transition: transform 0.3s ease;
              }
            }
          }
        }
      }
    }
    .share {
      padding: 20px;
      p {
        font-size: 14px;
        color: #262626;
      }
      &-button {
        margin-top: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        :deep(.el-input) {
          margin-right: 8px;
          height: 40px;
          .el-input__wrapper {
            padding: 12px;
            border-radius: 6px;
            border: 1px solid #e7e9e8;
            box-shadow: none;
          }
          .el-input__inner {
            color: #bec0bf;
          }
        }
        :deep(.el-button) {
          background: #00b96b;
          border-color: #00b96b;
          height: 40px;
          border-radius: 6px;
          span {
            font-size: 14px;
            font-weight: 700;
            color: #fff;
          }
        }
      }
    }
  }
}
.ignore-cooperate-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #eff0f0;
  }
}
</style>

<style lang="scss">
.cooperatePopverPopver {
  padding: 0 !important;
}
.cooperatePopverPopver-search-list {
  padding: 0 8px !important;
  .is-loading {
    box-sizing: border-box;
    width: 100%;
    li {
      height: 50px;
      line-height: 50px;
    }
  }
  ul {
    li {
      box-sizing: border-box;
      height: 48px;
      display: flex;
      align-items: center;
      margin-bottom: 4px;
      border-radius: 6px;
      color: #262626;
      padding: 0 8px;
      width: 100%;
      img {
        width: 32px;
        min-width: 32px;
        height: 32px;
        border-radius: 16px;
        margin-right: 12px;
      }
    }
  }
}
.addMemberDialog {
  .header {
    margin-bottom: 16px;
    padding: 0px 14px;
    color: #000000;
    background-color: #fff;
  }
  .el-dialog__body {
    padding-top: 16px;
  }
  .cell {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .el-table__empty-block {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .footer {
    padding: 0px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      color: #8a8f8d;
      font-size: 14px;
      display: flex;
      align-items: center;
      span {
        display: flex;
        align-items: center;
      }
      .count {
        margin-right: 16px;
      }
      .el-dropdown-link {
        cursor: pointer;
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
