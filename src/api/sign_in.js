
import request from '@/utils/request'

export function SignConfigIndex(data) {
  return request({
    url: '/admin/SignConfig/index',
    method: 'post',
    data
  })
}

export function SignConfigEdit(data) {
  return request({
    url: '/admin/SignConfig/edit',
    method: 'post',
    data
  })
}

export function SignConfigSetRule(data) {
  return request({
    url: '/admin/SignConfig/set_rule',
    method: 'post',
    data
  })
}

export function SignConfigDel(data) {
  return request({
    url: '/admin/SignConfig/del',
    method: 'post',
    data
  })
}

export function SignConfigget_rule(data) {
  return request({
    url: '/admin/SignConfig/get_rule',
    method: 'post',
    data
  })
}