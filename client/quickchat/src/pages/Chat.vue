<template>
  <q-page class="">
    <q-chat-message
      v-for="(message, index) in messages"
      :key="index"
      :name="message.username"
      :text="[message.message]"
    />
    <div class="flex fixed-bottom">
      <q-input
        fixed
        fixed-bottom
        v-model="message"
        v-on:keyup.enter="send"
        type="textarea"
        class="input"
        float-label="Type in your message"
        rows="3"
      />
    </div>
  </q-page>
</template>

<style>
</style>

<script>
import io from 'socket.io-client'
import { mapGetters } from 'vuex'

export default {
  name: 'Chat',
  data () {
    return {
      admin: '',
      message: '',
      messages: [],
      socket: io('localhost:3001')
    }
  },
  methods: {
    send (e) {
      e.preventDefault()
      const msg = {
        idUser: this.idUser,
        username: this.username,
        message: this.message.trim()
      }
      this.socket.emit('send_message', msg)
      this.message = ''
    }
  },
  computed: {
    ...mapGetters(['username', 'idUser'])
  },
  created () {
    this.$store.dispatch('GET_MESSAGES').then((result) => {
      this.messages = result
    })
  },
  mounted () {
    this.socket.on('send_message', (data) => {
      this.messages = [...this.messages, data]
    })

    this.socket.on('connect', () => {
    })

    this.socket.on('message', (data) => {
      this.messages = [...this.messages, data]
    })

    this.socket.on('clear all messages', () => {
      this.messages = []
    })
  },
  beforeDestroy () {
    this.messages = []
  }
}
</script>
<style scoped>
.q-textarea{
  height: 50px;
}
.input {
  width: 100%;
  padding-left: 8px;
  font-size: 20px;
  border: 1px solid #1976d2;
}
.q-field__native {
  height: 50px;
}
</style>
