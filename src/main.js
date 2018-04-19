import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/permission' // permission control

Vue.use(ElementUI)

import VueSimplemde from 'vue-simplemde'
Vue.use(VueSimplemde)
require.ensure([], () => require('github-markdown-css'), 'markdown-style')
import 'simplemde/dist/simplemde.min.css'
import 'github-markdown-css'

import hljs from 'highlight.js'
window.hljs = hljs

import 'highlight.js/styles/atom-one-dark.css'

import MainLayout from '@/components/MainLayout/index.js'
Vue.use(MainLayout)

import filters from './filters'
// use fiters
Object.keys(filters).forEach(key => Vue.filter(key, filters[key]))

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
