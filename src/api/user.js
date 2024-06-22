import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/Login/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/admin/Admin/userInfo',
    method: 'post'
  })
}

export function logout() {
  return request({
    url: '/admin/Admin/logout',
    method: 'post'
  })
}
