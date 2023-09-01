import request from '@/utils/request'

export function getPermissionsApi(data) {
  return request({
    url: '/forum/permissions/',
    method: 'get',
    params: data,
    urlType: 'NEWBASE'
  })
}

export function addPermissionsApi(data) {
  return request({
    url: '/forum/permissions/',
    method: 'post',
    data,
    urlType: 'NEWBASE'
  })
}

export function deletePermissionsApi(id) {
  return request({
    url: `/forum/permissions/${id}/`,
    method: 'delete',
    urlType: 'NEWBASE'
  })
}

export function selectUserInfoApi(data) {
  return request({
    url: '/user/select_UserInfo/',
    method: 'post',
    urlType: 'BASEUSER',
    data
  })
}
