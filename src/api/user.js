import axios from '@/utils/axios'

export default {
  login(username, password) {
    return axios.post('login', { username, password })
  },
  logout() {
    return axios.post('logout')
  },
  getInfo(token) {
    return axios.get('user/info', { token })
  }
}
