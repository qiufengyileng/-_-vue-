import { getSearch, setSearch, delSearch } from '@/utils/storage'
export default {
  namespaced: true,
  state: {
    history: getSearch()
  },
  mutations: {
    del (state) {
      state.history = []
      delSearch()
    },
    add (state, obj) {
      if (!state.history.includes(obj)) {
        state.history.unshift(obj)
        setSearch(state.history)
      }
    }
  }
}
