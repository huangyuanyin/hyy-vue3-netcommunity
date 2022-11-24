/*
 * @Description: 下载接口
 * @Author: 黄原寅
 */

import request from '@/utils/request'

// 下载markdown/富文本文件
export function downloadArticleFileApi(data) {
  return request({
    url: `forum/download_article_file/`,
    method: 'post',
    data
  })
}
