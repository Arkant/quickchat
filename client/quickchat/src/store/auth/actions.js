import axios from '../../api'

const LOGIN_USER = ({ commit }, payload) => {
  axios.post(payload)
}

export default {
  LOGIN_USER
}
