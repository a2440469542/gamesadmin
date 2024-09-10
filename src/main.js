import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import dayjs from 'dayjs'
import AWS from 'aws-sdk';

import '@/styles/index.scss' // global css
import VueQuillEditor from 'vue-quill-editor'
import App from './App'
import store from './store'
import router from './router'
import '@/icons' // icon
import '@/permission' // permission control
import lodash from "lodash"
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
Vue.use(VueQuillEditor)
Vue.use(AWS)


Vue.config.productionTip = false
Vue.prototype.$dayjs = dayjs
Vue.prototype.$lodash = lodash

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
