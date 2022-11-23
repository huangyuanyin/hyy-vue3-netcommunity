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
  新增评论
*/
export function addComment(data) {
  return request({
    url: 'forum/comment/',
    method: 'post',
    data
  })
}

/*
  删除评论
*/
export function deleteComment(id) {
  return request({
    url: `forum/comment/${id}/`,
    method: 'delete'
  })
}

/*
  修改评论
*/
export function updateComment(id, data) {
  return request({
    url: `forum/comment/${id}/`,
    method: 'put',
    data
  })
}

/*
  评论列表
*/
export function getComments(query) {
  return request({
    url: 'forum/comment/',
    method: 'get',
    headers: query
  })
}
