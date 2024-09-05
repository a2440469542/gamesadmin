
import request from '@/utils/request'

export function getLuckyStar(data) {
  return request({
    url: '/admin/LuckyStar/index',
    method: 'post',
    data
  })
}

export function LuckyStarAdd(data) {
  return request({
    url: '/admin/LuckyStar/add',
    method: 'post',
    data
  })
}


export function StarPhraseAdd(data) {
  return request({
    url: '/admin/StarPhrase/add',
    method: 'post',
    data
  })
}

export function StarPhraseEdit(data) {
  return request({
    url: '/admin/StarPhrase/edit',
    method: 'post',
    data
  })
}

export function StarPhraseDel(data) {
  return request({
    url: '/admin/StarPhrase/del',
    method: 'post',
    data
  })
}

export function StarFileAdd(data) {
  return request({
    url: '/admin/StarFile/add',
    method: 'post',
    data
  })
}

export function StarCoinAdd(data) {
  return request({
    url: '/admin/StarCoin/add',
    method: 'post',
    data
  })
}

export function StarCoinEdit(data) {
  return request({
    url: '/admin/StarCoin/edit',
    method: 'post',
    data
  })
}

export function StarCoinDel(data) {
  return request({
    url: '/admin/StarCoin/del',
    method: 'post',
    data
  })
}
