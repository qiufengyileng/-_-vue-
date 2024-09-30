import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/styles/common.less'
import {
  Button, Tabbar, TabbarItem, NavBar, Toast,
  Search, Swipe, SwipeItem, Grid, GridItem
  , Icon, Rate, ActionSheet, Dialog, Checkbox, Tab, Tabs
} from 'vant'
Vue.use(Button)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(NavBar)
Vue.use(Search)
Vue.use(Swipe)
Vue.use(SwipeItem)
Vue.use(Grid)
Vue.use(GridItem)
Vue.use(Icon)
Vue.use(Rate)
Vue.use(ActionSheet)
Vue.use(Checkbox)
Vue.use(Tab)
Vue.use(Tabs)
Vue.prototype.$toast = Toast
Vue.prototype.$dialog = Dialog
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
