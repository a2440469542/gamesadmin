
import request from '@/utils/request'

export function RacsIndex(data) {
  return request({
    url: '/admin/Racs/index',
    method: 'post',
    data
  })
}

export function RacsEdit(data) {
  return request({
    url: '/admin/Racs/edit',
    method: 'post',
    data
  })
}


export function RacsDel(data) {
  return request({
    url: '/admin/Racs/del',
    method: 'post',
    data
  })
}

export function GameIndex(data) {
  return request({
    url: '/admin/Game/index',
    method: 'post',
    data
  })
}

export function ChannelIndex(data) {
  return request({
    url: '/admin/Channel/index',
    method: 'post',
    data
  })
}


export function PlateIndex(data) {
  return request({
    url: '/admin/Plate/index',
    method: 'post',
    data
  })
}


