const LOGIN_USER_SUCCESS = (state, payload) => {
  state.username = payload.username
}
const SIGN_UP_USER_SUCCESS = (state, payload) => {
  state.username = payload.username
}

export default {
  LOGIN_USER_SUCCESS,
  SIGN_UP_USER_SUCCESS
}
