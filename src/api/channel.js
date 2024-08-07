
import request from '@/utils/request'

export function channelExport(data) {
  return request({
    url: '/admin/Channel/export',
    method: 'post',
    data
  })
}