
import request from '@/utils/request'

export function getActivityList(data) {
  return request({
    url: '/admin/Activity/index',
    method: 'post',
    data
  })
}

export function editActivityInfo(data) {
  return request({
    url: '/admin/Activity/edit',
    method: 'post',
    data
  })
}


export function edlActivityInfo(data) {
  return request({
    url: '/admin/Activity/del',
    method: 'post',
    data
  })
}