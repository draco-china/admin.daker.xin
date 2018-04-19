const getters = {
  sidebar: state => state.app.sidebar,
  icon: state => state.app.icon,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,

  tag: state => state.tag.all,
  category: state => state.category.all
}
export default getters
