import request from '@/utils/request'

export function getUserList(data) {
  return request({
    url: '/agent/User/index',
    method: 'post',
    data
  })
}

export function removeUser(data) {
  return request({
    url: '/agent/User/del',
    method: 'post',
    data
  })
}

export function createRebot(data) {
  return request({
    url: '/agent/User/create_rebot',
    method: 'post',
    data
  })
}

export function getChannelList() {
  return request({
    url: '/agent/Index/get_plate',
    method: 'post'
  })
}

export function getDailyReport(data) {
  return request({
    url: '/agent/Index/get_total',
    method: 'post',
    data
  })
}
