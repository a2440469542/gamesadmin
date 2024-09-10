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

export function getlock_money(params) {
  return request({
    url: '/admin/User/lock_money',
    method: 'post',
    params
  })
}

export function reSCoreMoney(data) {
  return request({
    url: '/admin/User/bill',
    method: 'post',
    data
  })
}

export function lock_chilend_money(data) {
  return request({
    url: '/admin/User/lock_chilend_money',
    method: 'post',
    data
  })
}



