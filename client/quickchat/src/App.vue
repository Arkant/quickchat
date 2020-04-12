<template>
  <div id="q-app">
      <div v-if="showLoader">
        <q-spinner-hourglass
          class="spinner"
          color="primary"
          size="4em"
        />
      </div>
      <router-view
      :disabled="showLoader"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  mounted () {
    this.$router.push('/login')
  },
  computed: {
    ...mapGetters(['showLoader'])
  }
}
</script>

<style>
.q-message-text--sent {
  position: relative;
  right: 10px !important;
}
.q-message-name--sent {
  right: 10px !important;
}
.spinner {
  position: absolute;
  height: 100px;
  width: 100px;
  top: 50%;
  left: 50%;
  margin-left: -50px;
  margin-top: -50px;
  z-index: 100;
}
</style>
