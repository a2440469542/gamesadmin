

import request from '@/utils/request'

export function levelIndex(data) {
  return request({
    url: '/admin/Level/index',
    method: 'post',
    data
  })
}

export function levelImport(data) {
  return request({
    url: '/admin/Level/import',
    method: 'post',
    data
  })
}

export function levelEdit(data) {
  return request({
    url: '/admin/Level/edit',
    method: 'post',
    data
  })
}


export function levelDel(data) {
  return request({
    url: '/admin/Level/del',
    method: 'post',
    data
  })
}

export function levelGetStat(data) {
  return request({
    url: '/admin/Level/get_stat',
    method: 'post',
    data
  })
}
