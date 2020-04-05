const LOGIN_USER_SUCCESS = (state, payload) => {
  const [user, status] = payload
  state.isAuthed = status
  state.username = user.Login
  state.idUser = user.idUser
}
const SIGN_UP_USER_SUCCESS = (state, payload) => {
  const [user, status] = payload
  state.isAuthed = status
  state.username = user.Login
  state.idUser = user.idUser
}

const LOGOUT_SUCCESS = (state) => {
  state.isAuthed = 'Unathenticated'
  state.username = ''
  state.idUser = null
}

export default {
  LOGIN_USER_SUCCESS,
  SIGN_UP_USER_SUCCESS,
  LOGOUT_SUCCESS
}
