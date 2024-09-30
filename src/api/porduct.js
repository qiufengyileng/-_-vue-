import request from '@/utils/request'
export const getProList = (obj) => {
  const { categoryId, goodsName, page } = obj
  return request.get('/goods/list', {
    params: {
      categoryId,
      goodsName,
      page
    }
  })
}
export const getProDetail = (id) => {
  return request.get('/goods/detail', {
    params: {
      goodsId: id
    }
  })
}
export const getProlistRow = (id) => {
  return request.get('/comment/listRows', {
    params: {
      goodsId: id,
      limit: 3
    }
  })
}
