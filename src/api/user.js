import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'forum/login/',
    method: 'post',
    data
  })
}

// 服务分组 - 获取
export function getCategoryApi() {
  return request({
    url: '/product/category/',
    method: 'Get',
    urlType: 'NetDevOps'
  })
}

// 产品服务 - 获取（全部）
export function getProductApi() {
  return request({
    url: '/product/provider/',
    method: 'Get',
    urlType: 'NetDevOps'
  })
}
