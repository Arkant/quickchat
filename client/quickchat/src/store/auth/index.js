import getters from './getters'
import mutations from './mutations'
import actions from './actions'

export default {
  getters,
  mutations,
  actions,
  state: {
    isAuthed: 'Unauthenticated',
    username: '',
    idUser: null
  }
}
