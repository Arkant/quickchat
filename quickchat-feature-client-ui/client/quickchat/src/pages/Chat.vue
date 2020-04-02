<template>
  <q-page class="">
    <q-chat-message
      v-for="(message, index) in messages"
      :key="index"
      :name="message.username"
      :text="[message.message]"
    />
    <q-input
      fixed
      fixed-bottom
      v-model="message"
      v-on:keyup.enter="send"
      type="textarea"
      float-label="Your message"
      :max-height="50"
      rows="3"
    />
    <q-btn
      @click="send"
      color="primary"
      :label="'Send'"
    />
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
        username: this.username,
        message: this.message.trim()
      }
      this.socket.emit('send_message', msg)
      this.message = ''
    }
  },
  computed: {
    ...mapGetters(['username'])
  },
  created () {
    this.messages = []
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
