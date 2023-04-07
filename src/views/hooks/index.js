import { updateCategorys, addCategorys } from '@/api/category.js'

// 知识库 - 删除
export const deleteCategory = asycn(data) => {
  let res = await updateCategorys({ id, status: 0 })
  updateCategorys(prop.edit.value.id, form.value).then(res => {
    if (res.code === 1000) {
      ElMessage({
        message: '编辑成功！',
        type: 'success'
      })
      handleClose()
    }
  })
}
