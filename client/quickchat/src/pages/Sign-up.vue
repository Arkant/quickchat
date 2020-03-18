<template>
  <q-page class="row justify-center items-center">
    <div class="column">
      <div class="row">
        <q-card square bordered class="q-pa-lg shadow-1">
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input square filled clearable v-model="username" type="name" label="Username" />
              <q-input square filled clearable v-model="password" type="password" label="Password" />
              <q-input square filled clearable v-model="confirmPassword" type="password" label="Confirm password" />
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn @click="signUp" unelevated color="blue" size="lg" class="full-width" label="Sign Up" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'Sign Up',
  data () {
    return {
      username: '',
      password: '',
      confirmPassword: ''
    }
  },
  computed: {
    isValidPassword() {
      return this.password === this.confirmPassword &&
        this.password !== '' &&
        this.confirmPassword !== ''
    }
  },
  method: {
    signUp() {
      this.$store.dispatch('SIGN_UP_USER', {
        username,
        password
      })
    }
  }
}
</script>

<style>
.q-card {
  width: 360px;
}
</style>
