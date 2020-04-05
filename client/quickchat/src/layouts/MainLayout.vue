<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Quickchat
        </q-toolbar-title>

        <h6 class="username" v-if="username !== ''">{{username}}</h6>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Navigation
        </q-item-label>
        <q-item v-if="isAuthed === 'Unauthenticated'" clickable tag="a">
          <q-item-section avatar>
            <q-icon name="play_arrow" />
          </q-item-section>
          <q-item-section @click="$router.push('/login')">
            <q-item-label>Login</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="isAuthed === 'Unauthenticated'" clickable tag="a">
          <q-item-section avatar>
            <q-icon name="power_settings_new" />
          </q-item-section>
          <q-item-section @click="$router.push('/sign-up')">
            <q-item-label>Sign Up</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="isAuthed === 'Authenticated'" clickable tag="a">
          <q-item-section avatar>
            <q-icon name="chat" />
          </q-item-section>
          <q-item-section @click="$router.push('/chat')">
            <q-item-label>Chat</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="isAuthed === 'Authenticated'" clickable tag="a">
          <q-item-section avatar>
            <q-icon name="exit_to_app" />
          </q-item-section>
          <q-item-section @click="logout">
            <q-item-label>Logout</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <div :class="{'disabled': leftDrawerOpen}">
      <q-page-container>
        <router-view />
      </q-page-container>
    </div>
  </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'MainLayout',

  components: {
  },
  computed: {
    ...mapGetters(['username', 'isAuthed'])
  },
  data () {
    return {
      leftDrawerOpen: false
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('LOGOUT_USER')
        .then(() => {
          this.$router.push('/login')
        })
    }
  }
}
</script>

<style scoped>
.username {
  margin: 0 !important;
}
.username:hover {
  cursor: pointer;
}
.disabled {
}
</style>
