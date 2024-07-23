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

export function getChannels() {
  return request({
    url: '/agent/Index/get_plate',
    method: 'post'
  })
}

export function logout() {
  return request({
    url: '/agent/Login/logout',
    method: 'post'
  })
}
