import request from '@/utils/request'
export const getCheckOrder = (mode, obj) => {
  return request.get('/checkout/order', {
    params: {
      mode,
      delivery: 10,
      shopId: 0,
      couponId: 0,
      isUsePoints: 0,
      ...obj
    }
  })
}
export const buyOrder = (mode, obj) => {
  return request.post('/checkout/submit', {
    mode,
    couponId: 0,
    delivery: 10,
    ...obj
  })
}
export const money = () => {
  return request.get('/user/assets')
}
export const getMyOrderList = (dataType, page) => {
  return request.get('/order/list', {
    params: {
      dataType,
      page
    }
  })
}
