import axios from '@/utils/axios'

export default {
  create(params) {
    return axios.post('article', params)
  },
  get(id) {
    return axios.get(`article/${id}`)
  },
  getList(currentPage, pageSize, keyword) {
    return axios.get(`article?currentPage=${currentPage}&pageSize=${pageSize}&keyword=${keyword}`)
  },
  patch(params) {
    return axios.patch(`article`, params)
  },
  update(id, params) {
    return axios.put(`article/${id}`, params)
  },
  delete(id) {
    return axios.delete(`article/${id}`)
  }
}
