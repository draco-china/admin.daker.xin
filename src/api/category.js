import axios from '@/utils/axios'

export default {
  create(params) {
    return axios.post('category', params)
  },
  get(currentPage, pageSize, keyword) {
    return axios.get(`category?currentPage=${currentPage}&pageSize=${pageSize}&keyword=${keyword}`)
  },
  getAll(keyword) {
    return axios.get(`category`)
  },
  update(params) {
    return axios.put(`category/${params._id}`, params)
  },
  delete(id) {
    return axios.delete(`category/${id}`)
  }
}
