const INFO_KEY = 'qiufenyileng_shop'
export const getInfo = () => {
  const defaultObj = {
    token: '',
    userId: ''
  }
  const result = localStorage.getItem(INFO_KEY)
  return result ? JSON.parse(result) : defaultObj
}
export const setInfo = (obj) => {
  localStorage.setItem(INFO_KEY, JSON.stringify(obj))
}
export const removeinfo = (INFO_KEY) => {
  localStorage.removeItem(INFO_KEY)
}
const search = 'THE_SEARCH_HISTORY'
export const getSearch = () => {
  const result = localStorage.getItem(search)
  return result ? JSON.parse(result) : []
}
export const setSearch = (obj) => {
  localStorage.setItem(search, JSON.stringify(obj))
}
export const delSearch = () => {
  localStorage.removeItem(search)
}
