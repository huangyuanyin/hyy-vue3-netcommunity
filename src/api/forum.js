/*
 * @Description: 论坛模板接口
 * @Author: maxf
 * @Date: 2022-03-29 16:11:32
 * @LastEditors: maxf
 * @LastEditTime: 2022-03-29 18:41:32
 * @FilePath: \vue3-netforum\src\api\forum.js
 */
import request from '@/utils/request'

/*
  新增分类
*/
export function addTopics(data) {
  return request({
    url: 'forum/category/',
    method: 'post',
    data
  })
}

/*
  删除分类
*/
export function deleteTopics(id) {
  return request({
    url: `forum/category/${id}/`,
    method: 'delete'
  })
}

/*
  修改分类
*/
export function updateTopics(id, data) {
  return request({
    url: `forum/category/${id}/`,
    method: 'put',
    data
  })
}

/*
  获取分类
*/
export function getTopics() {
  return request({
    url: 'forum/category/',
    method: 'get'
  })
}

/*
  新增帖子
*/
export function addForum(data) {
  return request({
    url: 'forum/article/',
    method: 'post',
    data
  })
}

/*
  删除帖子
*/
export function deleteForum(id) {
  return request({
    url: `forum/article/${id}/`,
    method: 'delete'
  })
}

/*
  修改帖子
*/
export function updateForum(id, data) {
  return request({
    url: `forum/article/${id}/`,
    method: 'put',
    data
  })
}

/*
  查询帖子
*/
export function getForum(query) {
  return request({
    url: 'forum/article/',
    method: 'get',
    headers: query
  })
}

/*
  获取帖子详情数据
*/
export function getForumInfo(id) {
  return request({
    url: `forum/article/${id}/`,
    method: 'get'
  })
}

/*
  新增帖子回复
*/
export function addAnswer(data) {
  return request({
    url: 'forum/answer_add/',
    method: 'post',
    data
  })
}

/*
  删除帖子回复
*/
export function deleteAnswer(data) {
  return request({
    url: 'forum/answer_delete/',
    method: 'post',
    data
  })
}

/*
  获取帖子回复列表
*/
export function getAnswer(data) {
  return request({
    url: 'forum/answer_get/',
    method: 'post',
    data
  })
}

/*
  新增回复评论
*/
export function addComment(data) {
  return request({
    url: 'forum/comment_add/',
    method: 'post',
    data
  })
}

/*
  获取回复评论列表
*/
export function getComment(data) {
  return request({
    url: 'forum/comment_get/',
    method: 'post',
    data
  })
}
