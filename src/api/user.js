import axios from '@/utils/axios'

export default {
  login(username, password) {
    return axios.post('login', { username, password })
  },
  logout() {
    return axios.post('logout')
  },
  get() {
    return axios.get('user')
  },
  update(params) {
    return axios.put('user', params)
  }
}
