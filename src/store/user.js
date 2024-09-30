import { getInfo, setInfo, removeinfo } from '@/utils/storage'
export default {
  namespaced: true,
  state () {
    return {
      userInfo: getInfo()

    }
  },
  mutations: {
    setUserInfo (state, userInfo) {
      state.userInfo = userInfo
      setInfo(userInfo)
    },
    clearUserInfo (state) {
      state.userInfo = {}
      removeinfo('qiufenyileng_shop')
      location.reload()
    }
  }

}
