import request from '@/utils/request'

/*
  添加项目
*/
export function addItem(data) {
  return request({
    url: 'httpapi/items_create/',
    method: 'post',
    data
  })
}

/*
  移除项目
*/
export function deleteItem(data) {
  return request({
    url: 'httpapi/items_delete/',
    method: 'post',
    data
  })
}

/*
  编辑项目
*/
export function updateItem(data) {
  return request({
    url: 'httpapi/items_update/',
    method: 'post',
    data
  })
}

/*
  查询项目
*/
export function getItem(data) {
  return request({
    url: 'httpapi/items_select/',
    method: 'post',
    data
  })
}

/*
  增加分组
*/
export function addGroup(data) {
  return request({
    url: 'httpapi/group_create/',
    method: 'post',
    data
  })
}

/*
  删除分组
*/
export function deleteGroup(data) {
  return request({
    url: 'httpapi/group_delete/',
    method: 'post',
    data
  })
}

/*
  修改分组
*/
export function updateGroup(data) {
  return request({
    url: 'httpapi/group_update/',
    method: 'post',
    data
  })
}

/*
  查询分组
*/
export function selectGroup(data) {
  return request({
    url: 'httpapi/group_select/',
    method: 'post',
    data
  })
}
