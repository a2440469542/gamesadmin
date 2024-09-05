import request from '@/utils/request'

export function getScoreGet_config(data) {
  return request({
    url: '/admin/Score/get_config',
    method: 'post',
    data
  })
}

export function getScoreSet_config(data) {
  return request({
    url: '/admin/Score/set_config',
    method: 'post',
    data
  })
}


export function GoodsIndex(data) {
  return request({
    url: '/admin/Goods/index',
    method: 'post',
    data
  })
}


export function GoodsEdit(data) {
  return request({
    url: '/admin/Goods/edit',
    method: 'post',
    data
  })
}


export function GoodsDel(data) {
  return request({
    url: '/admin/Goods/del',
    method: 'post',
    data
  })
}


export function GoodsGoodsOrder(data) {
  return request({
    url: '/admin/Goods/goods_order',
    method: 'post',
    data
  })
}


export function GoodsSendGoods(data) {
  return request({
    url: '/admin/Goods/send_goods',
    method: 'post',
    data
  })
}


export function GoodsStatic(data) {
  return request({
    url: '/admin/Goods/static',
    method: 'post',
    data
  })
}
