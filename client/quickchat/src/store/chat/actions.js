import axios from 'axios'

const GET_MESSAGES = async ({ commit }, payload) => {
  const result = await axios.get('http://localhost:3001/db_messages', payload)
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
