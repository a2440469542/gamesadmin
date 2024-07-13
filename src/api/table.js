import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}

export function getAdminList(data) {
  return request({
    url: '/admin/Admin/index',
    method: 'post',
    data
  })
}

export function createAdmin(data) {
  return request({
    url: '/admin/Admin/add',
    method: 'post',
    data
  })
}
export function removeAdmin(data) {
  return request({
    url: '/admin/Admin/del',
    method: 'post',
    data
  })
}

export function getUserList(data) {
  return request({
    url: '/admin/User/index',
    method: 'post',
    data
  })
}

export function updateUserPwd(data) {
  return request({
    url: '/admin/User/update_pwd',
    method: 'post',
    data
  })
}
export function removeUser(data) {
  return request({
    url: '/admin/User/del',
    method: 'post',
    data
  })
}
export function getMenuList() {
  return request({
    url: '/admin/Menu/index',
    method: 'post'
  })
}

export function createMenu(data) {
  return request({
    url: '/admin/Menu/add',
    method: 'post',
    data
  })
}

export function removeMenu(data) {
  return request({
    url: '/admin/Menu/del',
    method: 'post',
    data
  })
}
export function getCarouselList(data) {
  return request({
    url: '/admin/Ad/index',
    method: 'post',
    data
  })
}

export function createCarousel(data) {
  return request({
    url: '/admin/Ad/edit',
    method: 'post',
    data
  })
}

export function removeCarousel(data) {
  return request({
    url: '/admin/Ad/del',
    method: 'post',
    data
  })
}
export function getRoleList() {
  return request({
    url: '/admin/Roles/index',
    method: 'post'
  })
}

export function createRole(data) {
  return request({
    url: '/admin/Roles/edit',
    method: 'post',
    data
  })
}

export function removeRole(data) {
  return request({
    url: '/admin/Roles/del',
    method: 'post',
    data
  })
}
export function getChannelList() {
  return request({
    url: '/admin/Channel/index',
    method: 'post'
  })
}

export function createChannel(data) {
  return request({
    url: '/admin/Channel/add',
    method: 'post',
    data
  })
}

export function removeChannel(data) {
  return request({
    url: '/admin/Channel/del',
    method: 'post',
    data
  })
}
export function getGameList(data) {
  return request({
    url: '/admin/Game/index',
    method: 'post',
    data
  })
}

export function createGame(data) {
  return request({
    url: '/admin/Game/edit',
    method: 'post',
    data
  })
}

export function removeGame(data) {
  return request({
    url: '/admin/Game/del',
    method: 'post',
    data
  })
}

export function getPlateList() {
  return request({
    url: '/admin/Plate/index',
    method: 'post'
  })
}

export function createPlate(data) {
  return request({
    url: '/admin/Plate/edit',
    method: 'post',
    data
  })
}

export function removePlate(data) {
  return request({
    url: '/admin/Plate/del',
    method: 'post',
    data
  })
}

export function config(data) {
  return request({
    url: '/admin/Config/info',
    method: 'post',
    data
  })
}

export function chargeLog(data) {
  return request({
    url: '/admin/Order/index',
    method: 'post',
    data
  })
}

export function withdrawLog(data) {
  return request({
    url: '/admin/Cash/index',
    method: 'post',
    data
  })
}

export function gameLog(data) {
  return request({
    url: '/admin/GameLog/index',
    method: 'post',
    data
  })
}

export function saveConfig(data) {
  return request({
    url: '/admin/Config/edit',
    method: 'post',
    data
  })
}

export function getRechargeConfigList(data) {
  return request({
    url: '/admin/Recharge/index',
    method: 'post',
    data
  })
}

export function createRechargeConfigList(data) {
  return request({
    url: '/admin/Recharge/edit',
    method: 'post',
    data
  })
}

export function removeRechargeConfigList(data) {
  return request({
    url: '/admin/Recharge/del',
    method: 'post',
    data
  })
}

export function getBoxConfigList(data) {
  return request({
    url: '/admin/Box/index',
    method: 'post',
    data
  })
}

export function createBoxConfigList(data) {
  return request({
    url: '/admin/Box/edit',
    method: 'post',
    data
  })
}

export function getPGRouteList(data) {
  return request({
    url: '/admin/Channel/pg_list',
    method: 'post',
    data
  })
}

export function getBillRecords(data) {
  return request({
    url: '/admin/Bill/index',
    method: 'post',
    data
  })
}

export function getBillType(data) {
  return request({
    url: '/admin/Bill/get_type',
    method: 'post',
    data
  })
}

export function getData(data) {
  return request({
    url: '/admin/UserStat/index',
    method: 'post',
    data
  })
}

export function recharge(data) {
  return request({
    url: '/admin/Bill/bill',
    method: 'post',
    data
  })
}

export function getInviteData(data) {
  return request({
    url: '/admin/User/get_child',
    method: 'post',
    data
  })
}

export function wagesConfig(data) {
  return request({
    url: '/admin/WagesConfig/index',
    method: 'post',
    data
  })
}

export function addWagesConfig(data) {
  return request({
    url: '/admin/WagesConfig/edit',
    method: 'post',
    data
  })
}

export function wagesList(data) {
  return request({
    url: '/admin/Wages/index',
    method: 'post',
    data
  })
}

export function channelUserStat(data) {
  return request({
    url: '/admin/UserStat/stat',
    method: 'post',
    data
  })
}

export function routeList(data) {
  return request({
    url: '/admin/Line/index',
    method: 'post',
    data
  })
}

export function updateRoute(data) {
  return request({
    url: '/admin/Line/edit',
    method: 'post',
    data
  })
}

export function removeRoute(data) {
  return request({
    url: '/admin/Line/del',
    method: 'post',
    data
  })
}
