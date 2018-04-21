import Cookies from 'js-cookie'
import IconApi from '@/api/icon'

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus')
    },
    icon: []
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
    },

    SET_ICON: (state, icon) => {
      state.icon = icon
    }
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    },

    // 获取icon
    getIcon({ commit }) {
      return new Promise((resolve, reject) => {
        IconApi.get().then(response => {
          commit('SET_ICON', response.result.list)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default app
