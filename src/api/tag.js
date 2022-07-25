/*
 * @Description: 标签接口
 * @Author: maxf
 * @Date: 2022-04-18 16:11:32
 * @LastEditors: maxf
 * @LastEditTime: 2022-04-18 18:41:32
 * @FilePath: \vue3-netforum\src\api\tag.js
 */
import request from '@/utils/request'

/*
  新增标签
*/
export function addTag(data) {
  return request({
    url: 'forum/tag/',
    method: 'post',
    data
  })
}

/*
  删除标签
*/
export function deleteTag(id) {
  return request({
    url: `forum/tag/${id}/`,
    method: 'delete'
  })
}

/*
  修改标签
*/
export function updateTag(id, data) {
  return request({
    url: `forum/tag/${id}/`,
    method: 'put',
    data
  })
}

/*
  标签列表
*/
export function getTag() {
  return request({
    url: 'forum/tag/',
    method: 'get'
  })
}