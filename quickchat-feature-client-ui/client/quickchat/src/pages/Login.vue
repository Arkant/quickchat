<template>
  <q-page class="row justify-center items-center">
    <div class="column">
      <div class="row">
        <q-card square bordered class="q-pa-lg shadow-1">
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input square filled clearable v-model="username" type="name" label="Username" />
              <q-input square filled clearable v-model="password" type="password" label="Password" />
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn :disabled="!isBtnDisabled" @click="login" unelevated color="blue" size="lg" class="full-width" label="Login" />
          </q-card-actions>
          <q-card-section class="cursor-pointer text-center q-pa-none">
            <p @click="$router.push('/sign-up')"
                class="text-grey-6">
                Not reigistered? Created an Account
            </p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  computed: {
    isBtnDisabled () {
      return this.password !== '' && this.username !== ''
    }
  },
  methods: {
    login () {
      this.$store.dispatch('LOGIN_USER', {
        username: this.username,
        password: this.password
      })
      this.$router.push('/chat')
    }
  }
}
</script>

<style>
.q-card {
  width: 360px;
}
</style>
