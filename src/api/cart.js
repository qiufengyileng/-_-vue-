import request from '@/utils/request'
export const setCartSms = (goodsId, goodsNum, goodsSkuId) => {
  return request.post('/cart/add',
    {
      goodsId: goodsId,
      goodsNum: goodsNum,
      goodsSkuId: goodsSkuId
    }
  )
}
export const getCartSms = () => {
  return request.get('/cart/list')
}
export const updateCartSms = (goodsId, goodsNum, goodsSkuId) => {
  return request.post('/cart/update', {
    goodsId: goodsId,
    goodsNum: goodsNum,
    goodsSkuId: goodsSkuId
  })
}
export const delCartList = (cartIds) => {
  return request.post('/cart/clear', {
    cartIds: cartIds
  })
}
