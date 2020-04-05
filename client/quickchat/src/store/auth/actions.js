import axios from 'axios'

const LOGIN_USER = async ({ commit }, payload) => {
  const result = await axios.post('http://localhost:3001/login', payload)
  if (result.status === 200 && result.data[1] === 'Authenticated') {
    commit('LOGIN_USER_SUCCESS', result.data)
  }
  return new Error('Unauthenticated')
}

const SIGN_UP_USER = async ({ commit }, payload) => {
  const result = await axios.post('http://localhost:3001/sign-up', payload)
  if (result.status === 200 && result.data[1] === 'Authenticated') {
    commit('SIGN_UP_USER_SUCCESS', result.data)
  }
  return new Error('Unauthenticated')
}

const LOGOUT_USER = async ({ commit }) => {
  const result = await axios.get('http://localhost:3001/loggout')
  if (result.status !== 200) {
    return new Error('Could not logout')
  }
  commit('LOGOUT_SUCCESS')
}

export default {
  LOGIN_USER,
  SIGN_UP_USER,
  LOGOUT_USER
}
