import CategoryApi from '@/api/category'

const tag = {
  state: {
    data: []
  },

  mutations: {
    SET_CATEGORY: (state, list) => {
      state.data = list
    }
  },

  actions: {
    // 获取所有tags
    getCategoryAll({ commit }) {
      return new Promise((resolve, reject) => {
        CategoryApi.getAll().then(res => {
          commit('SET_CATEGORY', res.result.list)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default tag
