import axios from '@/utils/axios'

export default {
  create(icon, name, description) {
    return axios.post('tag', { icon, name, description })
  },
  get(currentPage = 1, pageSize = 10, keyword) {
    return axios.get(`tag?currentPage=${currentPage}&pageSize=${pageSize}&keyword=${keyword}`)
  },
  getAll() {
    return axios.get(`tag`)
  },
  update(id, icon, name, description) {
    return axios.put(`tag/${id}`, { icon, name, description })
  },
  delete(id) {
    return axios.delete(`tag/${id}`)
  }
}
