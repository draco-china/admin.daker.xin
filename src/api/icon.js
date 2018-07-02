import axios from '@/utils/axios'

export default {
  get() {
    return axios.get('icons')
  }
}
