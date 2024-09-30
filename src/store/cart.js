import { getCartSms, updateCartSms, delCartList } from '@/api/cart'
export default {
  namespaced: true,
  state () {
    return {
      cartList: []
    }
  },
  mutations: {
    setCartList (state, newList) {
      state.cartList = newList
    },
    changeChecked (state, id) {
      state.cartList.forEach(e => {
        if (e.goods_id === id) {
          e.isChecked = !e.isChecked
        }
      })
    },
    disNum (state, id) {
      state.cartList.forEach(e => {
        if (e.goods_id === id) {
          if (e.goods_num >= 1) { e.goods_num-- }
        }
      })
    },
    addNum (state, id) {
      state.cartList.forEach(e => {
        if (e.goods_id === id) {
          e.goods_num++
        }
      })
    },
    checkedAll (state) {
      state.cartList.forEach(e => {
        e.isChecked = !e.isChecked
      })
    },
    del (state) {
      state.cartList = state.cartList.filter(item => item.isChecked !== true)
    }
  },
  actions: {
    async updateCartList (context, obj) {
      const { goodsId, goodsNum, goodsSkuId } = obj
      await updateCartSms(goodsId, goodsNum, goodsSkuId)
    },
    async  getCartList (context) {
      const res = await getCartSms()
      res.data.list.forEach(item => {
        item.isChecked = true
      })
      context.commit('setCartList', res.data.list)
    },
    async delCartList (context, getters) {
      await delCartList(context.getters.getArray)
    }
  },
  getters: {
    total (state) {
      return state.cartList.reduce((sum, item) => sum + item.goods_num, 0)
    },
    totalPrice (state) {
      const price = state.cartList.reduce((sum, item) => {
        if (item.isChecked === true) {
          return sum + item.goods_num * item.goods.goods_price_min
        } else {
          return sum
        }
      }, 0)
      return price
    },
    getArray (state) {
      const array = state.cartList
        .filter(item => item.isChecked !== false) // 筛选出 isChecked 为 true 的商品
        .map(item => item.id)
      return array
    },
    totalNum (state) {
      const num = state.cartList.reduce((sum, item) => {
        if (item.isChecked === true) {
          return sum + item.goods_num
        } else {
          return sum
        }
      }, 0)
      return num
    },
    ischeckedAll (state) {
      const hasUncheckedItem = state.cartList.some(item => item.isChecked === false)
      return !hasUncheckedItem
    }
  }
}
