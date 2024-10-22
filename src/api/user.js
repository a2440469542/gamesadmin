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


export function userBindUser(data) {
  return request({
    url: '/admin/User/bind_user',
    method: 'post',
    data
  })
}


export function userbind_child_user(data) {
  return request({
    url: '/admin/User/bind_child_user',
    method: 'post',
    data
  })
}


export function api_unlock_money(data) {
  return request({
    url: '/admin/User/unlock_money',
    method: 'post',
    data
  })
}

export function api_unlock_chilend_money(data) {
  return request({
    url: '/admin/User/unlock_chilend_money',
    method: 'post',
    data
  })
}

export function api_set_default(data) {
  return request({
    url: '/admin/Line/set_default',
    method: 'post',
    data
  })
}

export function api_cash_examine(data) {
  return request({
    url: '/admin/Cash/cash_examine',
    method: 'post',
    data
  })
}

export function api_set_max_money(data) {
  return request({
    url: '/admin/User/set_max_money',
    method: 'post',
    data
  })
}






