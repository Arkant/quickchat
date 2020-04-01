const LOGIN_USER = ({ commit }, payload) => {
  commit('LOGIN_USER_SUCCESS', payload)
}

const SIGN_UP_USER = ({ commit }, payload) => {
  commit('SIGN_UP_USER_SUCCESS', payload)
}

export default {
  LOGIN_USER,
  SIGN_UP_USER
}
