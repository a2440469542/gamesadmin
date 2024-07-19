import request from '@/utils/request'

export function register(data) {
  return request({
    url: '/agent/Login/register',
    method: 'post',
    data
  })
}

export function login(data) {
  return request({
    url: '/agent/Login/user_login',
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
    url: '/agent/Admin/logout',
    method: 'post'
  })
}

export function createRebot(data) {
  return request({
    url: '/admin/User/create_rebot',
    method: 'post',
    data
  })
}

export function getLoginCode(params) {
  return request({
    url: '/admin/Login/verify',
    method: 'get',
    params
  })
}
