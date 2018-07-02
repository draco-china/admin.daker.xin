import TagApi from '@/api/tag'

const tag = {
  state: {
    data: []
  },

  mutations: {
    SET_TAG: (state, list) => {
      state.data = list
    }
  },

  actions: {
    // 获取所有tags
    getTagsAll({ commit }) {
      return new Promise((resolve, reject) => {
        TagApi.getAll().then(res => {
          commit('SET_TAG', res.result.list)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default tag
