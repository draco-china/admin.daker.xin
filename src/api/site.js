import axios from '@/utils/axios'

export default {
  get() {
    return axios.get('site')
  },
  update(params) {
    return axios.put('site', params)
  }
}
