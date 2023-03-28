/*
 * @Description: 上传接口
 * @Author: 黄原寅
 */
import request from '@/utils/request'

// 上传文件
export function uploadArticleFileApi(data) {
  return request({
    url: 'forum/upload_article_file/',
    method: 'post',
    data,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// markdown上传图片
export function uploadMdImageApi(data) {
  return request({
    url: '/forum/upload_image/',
    method: 'post',
    data,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
