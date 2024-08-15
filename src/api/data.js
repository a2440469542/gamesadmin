import request from '@/utils/request' 

export function channel_stat(data) {
  return request({
    url: '/admin/UserStat/channel_stat',
    method: 'post',
    data
  })
}

export function channel_day_stat(data) {
  return request({
    url: '/admin/UserStat/channel_day_stat',
    method: 'post',
    data
  })
}