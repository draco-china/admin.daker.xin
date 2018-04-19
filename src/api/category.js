import axios from '@/utils/axios'

export default {
  create(icon, name, description, category) {
    return axios.post('category', { icon, name, description, category })
  },
  get(currentPage, pageSize, keyword) {
    return axios.get(`category?currentPage=${currentPage}&pageSize=${pageSize}&keyword=${keyword}`)
  },
  getAll(keyword) {
    return axios.get(`category`)
  },
  update(id, icon, name, description, category) {
    return axios.put(`category/${id}`, { icon, name, description, category })
  },
  delete(id) {
    return axios.delete(`category/${id}`)
  }
}
