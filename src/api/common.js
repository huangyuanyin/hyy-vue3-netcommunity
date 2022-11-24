import request from '@/utils/request'

export function upload(header, data) {
  return request({
    url: 'forum/upload_file/',
    method: 'post',
    header: header,
    data
  })
}
