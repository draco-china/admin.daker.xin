import axios from '@/utils/axios'

export default {
  singleFile(formData) {
    return axios.post('/upload/singleFile', formData, { headers: { 'Content-Type': 'multipart/form-data' }})
  },
  multerFile(formData) {
    return axios.post('/upload/multerFile', formData, { headers: { 'Content-Type': 'multipart/form-data' }})
  }
}
