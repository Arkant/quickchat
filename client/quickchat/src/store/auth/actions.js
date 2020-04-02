import axios from 'axios';

const LOGIN_USER = ({ commit }, payload) => {
  axios.post('/sign-up', payload)
    .then((result) => {
      console.log(result);
    });
  commit('LOGIN_USER_SUCCESS', payload)
}

const SIGN_UP_USER = ({ commit }, payload) => {
  axios.post('/sign-up', payload)
    .then((result) => {
      console.log(result);
    });
  commit('SIGN_UP_USER_SUCCESS', payload)
}

export default {
  LOGIN_USER,
  SIGN_UP_USER
}
