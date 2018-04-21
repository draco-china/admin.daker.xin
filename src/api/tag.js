import axios from '@/utils/axios'

export default {
  create(params) {
    return axios.post('tag', params)
  },
  get(currentPage = 1, pageSize = 10, keyword) {
    return axios.get(`tag?currentPage=${currentPage}&pageSize=${pageSize}&keyword=${keyword}`)
  },
  getAll() {
    return axios.get(`tag`)
  },
  update(params) {
    return axios.put(`tag/${params._id}`, params)
  },
  delete(id) {
    return axios.delete(`tag/${id}`)
  }
}
