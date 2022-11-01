/*
 * @Description: 分类
 * @Author: maxf
 * @Date: 2022-03-29 16:11:32
 * @LastEditors: maxf
 * @LastEditTime: 2022-03-29 18:41:32
 * @FilePath: \vue3-netforum\src\api\category.js
 */
import request from '@/utils/request'

/*
  新增分类
*/
export function addCategorys(data) {
  return request({
    url: 'forum/category/',
    method: 'post',
    data
  })
}

/*
  删除分类
*/
export function deleteCategorys(id) {
  return request({
    url: `forum/category/${id}/`,
    method: 'delete'
  })
}

/*
  修改分类
*/
export function updateCategorys(id, data) {
  return request({
    url: `forum/category/${id}/`,
    method: 'put',
    data
  })
}

/*
  获取分类
*/
export function getCategorys(headers) {
  return request({
    url: 'forum/category/',
    method: 'get',
    headers
  })
}

/*
  获取分类所有节点
*/
export function getCategorysInfo(id) {
  return request({
    url: `forum/category/${id}/`,
    method: 'get'
  })
}
