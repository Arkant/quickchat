<template>
  <q-page class="">
    <div style="padding-bottom: 100px">
      <q-chat-message
        v-for="(message, index) in messages"
        :key="index"
        :sent="message.username === username ? true : false"
        :name="`<b>${message.username}</b>`"
        :stamp="message.datetime.split(/[T Z .]/)[1] || message.datetime"
        :text="[message.message]"
      />
    </div>
    <div class="flex fixed-bottom">
      <q-input
        fixed-bottom
        v-model="message"
        v-on:keyup.enter="send"
        type="textarea"
        class="input"
        label="Type in your message"
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
      socket: io('https://fast-peak-37701.herokuapp.com')
    }
  },
  methods: {
    send (e) {
      if (this.message.trim().length > 0) {
        e.preventDefault()
        const msg = {
          idUser: this.idUser,
          username: this.username,
          message: this.message.trim(),
          datetime: new Date().toLocaleTimeString()
        }
        this.socket.emit('send_message', msg)
        this.message = ''
      }
    }
  },
  computed: {
    ...mapGetters(['username', 'idUser'])
  },
  created () {
    this.$store.dispatch('GET_MESSAGES').then((result) => {
      this.messages = result
    }).then(res => res).catch(err => {
      this.$store.dispatch('SHOW_LOADER', false)
      console.err(err)
      this.$q.notify({
        color: 'red',
        textColor: 'white',
        icon: 'report_problem',
        message: 'Could not load DB messages',
        position: 'top-right',
        timeout: Math.random() * 5000 + 3000
      })
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
  background: white;
}
.q-field__native {
  height: 50px;
}
</style>
