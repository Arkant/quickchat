import axios from 'axios'

const GET_MESSAGES = async ({ commit, dispatch }, payload) => {
  dispatch('SHOW_LOADER', true)
  const result = await axios.get('https://fast-peak-37701.herokuapp.com/db_messages', payload)
  dispatch('SHOW_LOADER', false)
  if (result.status === 200) {
    if (result.data === undefined) {
      return []
    } else {
      commit('GET_MESSAGES_SUCCESS', result.data)
      return result.data
    }
  }
  return new Error('Could not get messages')
}

export default {
  GET_MESSAGES
}
