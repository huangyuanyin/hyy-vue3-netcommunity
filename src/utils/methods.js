// 递归判断分类节点类型
export const judgeNodeType = data => {
  for (const item of data) {
    if (item.type != 'l') {
      Object.assign(item, { disabled: true })
    }
    if (item.children && item.children.length) {
      judgeNodeType(item.children)
    }
  }
  return data
}
