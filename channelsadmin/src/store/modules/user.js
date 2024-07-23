import { login, logout, getInfo } from '@/api/user'
import { getChannelList, getMenuList } from '@/api/table'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { constantRoutes, resetRouter } from '@/router'
const getDefaultState = () => {
  return {
    token: getToken(),
    cid: '',
    name: '',
    avatar: '',
    menus: [],
    tabs: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus
  },
  SET_TABS: (state, tabs) => {
    state.tabs = tabs
  },
  SET_CHANNEL: (state, cid) => {
    state.cid = cid
  }
}

const actions = {
  setTabs({ commit }, obj) {
    // console.log('commit', obj)
    commit('SET_TABS', obj)
  },

  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ mobile: username.trim(), pwd: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  getMenuList({ commit, state }) {
    return new Promise((resolve, reject) => {
      const data = []
      data.push({
        'name': '每日数据',
        'is_menu': 1,
        'path': '/dailyReport/index'
      })

      data.push({
        'name': '虚拟账号',
        'is_menu': 1,
        'path': '/mockAccount/index'
      })

      if(this.state.token) {
        getChannelList().then((response) => {
          if (response.code === 0) {
            if (response.data && response.data.length) {
              const channels = response.data
              const cid = channels[0].cid
              commit('SET_CHANNEL', cid)
              // this.state.cid = cid
              // if(!window['hasSetCid']) {
              //   window['hasSetCid'] = true
              //   console.error('set token')
              //   localStorage.setItem('cid', cid)
              // }

              commit('SET_MENUS', data)
              resolve(data)
            }
            else {
              return reject('No Channel.')
            }
          }
          else {
            return reject('Get Channel failed.')
          }
        })
      }
      else {
        commit('SET_MENUS', data)
        resolve(data)
      }
    })
  },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

