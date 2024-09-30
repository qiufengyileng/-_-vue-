import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import search from './search'
import cart from './cart'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    user,
    search,
    cart
  }
})
