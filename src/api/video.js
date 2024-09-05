

import request from '@/utils/request'

export function VideoIndex(data) {
  return request({
    url: '/admin/Video/index',
    method: 'post',
    data
  })
}

export function VideoEdit(data) {
  return request({
    url: '/admin/Video/edit',
    method: 'post',
    data
  })
}

export function VideoDel(data) {
  return request({
    url: '/admin/Video/del',
    method: 'post',
    data
  })
}


export function VideoSet_config(data) {
  return request({
    url: '/admin/Video/set_config',
    method: 'post',
    data
  })
}


export function VideoGet_config(data) {
  return request({
    url: '/admin/Video/get_config',
    method: 'post',
    data
  })
}
