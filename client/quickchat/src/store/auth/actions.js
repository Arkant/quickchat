import axios from 'axios'

const LOGIN_USER = ({ commit }, payload) => {
  axios.post('http://localhost:3001/sign-up', payload)
    .then((result) => {
      console.log(result)
    })
    .catch((error) => {
      console.log(error)
    })
  commit('LOGIN_USER_SUCCESS', payload)
}

const SIGN_UP_USER = ({ commit }, payload) => {
  axios.post('http://localhost:3001/sign-up', payload)
    .then((result) => {
      console.log(result)
    })
    .catch((error) => {
      console.log(error)
    })
  commit('SIGN_UP_USER_SUCCESS', payload)
}

export default {
  LOGIN_USER,
  SIGN_UP_USER
}
