import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/views/layout/index.vue'
import Home from '@/views/layout/home.vue'
import Cart from '@/views/layout/cart.vue'
import User from '@/views/layout/user.vue'
import Category from '@/views/layout/category.vue'
import store from '@/store/index'

const Login = () => import('@/views/login/index.vue')
const Pay = () => import('@/views/pay/index.vue')
const Prodetail = () => import('@/views/prodetail/index.vue')
const Myorder = () => import('@/views/myorder/index.vue')
const Search = () => import('@/views/search/index.vue')
const List = () => import('@/views/search/list.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/layout',
    component: Layout,
    children: [
      { path: '/home', component: Home },
      { path: '/cart', component: Cart },
      { path: '/category', component: Category },
      { path: '/user', component: User }
    ]
  },
  { path: '/login', component: Login },
  { path: '/pay', component: Pay },
  { path: '/prodetail', component: Prodetail },
  { path: '/myorder', component: Myorder },
  { path: '/search', component: Search },
  { path: '/searchlist', component: List },
  { path: '/', redirect: '/home' }
]
const router = new VueRouter({
  routes
})
const path = ['/pay', '/myorder']
router.beforeEach((to, from, next) => {
  if (!path.includes(to.path)) {
    next()
    return
  }
  const token = store.state.user.userInfo.token
  if (token) {
    next()
  } else {
    next('/login')
  }
})
export default router
