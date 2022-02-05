<template >
  <q-layout view="lHr LpR fFf" class="bg-dark">

    <q-page-container class="bg-dark text-white page-wrapper">
      <q-toolbar>
        <q-icon clickable v-ripple v-on:click.stop=goBack name="fas fa-arrow-left" size="xs" style="margin-right: 32px" v-if="showBack"/>
        <q-toolbar-title class="text-weight-bold">
          {{$route.name}}
        </q-toolbar-title>
      </q-toolbar>
    </q-page-container>

    <q-drawer show-if-above breakpoint="0" mini-width="62" :mini="miniState" v-model="leftDrawerOpen" side="left" bordered >
      <!-- drawer content -->
      <q-list style="margin-left: 15px;">
        <q-item clickable v-ripple v-on:click.stop="this.$router.push('/')" class="q-mb-sm q-mt-sm drawer-item">
            <q-icon name="fas fa-dove" size="md"/>
        </q-item>
        
        <q-item :clickable=loggedin v-ripple to="/home" class="q-mb-sm q-mt-sm drawer-item" :style="loggedIn ? '' : 'pointer-events: none'">
          <q-item-section avatar>
            <q-icon name="fas fa-home" size="md"/>
          </q-item-section>
          <q-item-section class="text-h5">Home</q-item-section>
        </q-item>

        <q-item :clickable=loggedin v-if="false" v-ripple to="/messages" class="q-mb-sm q-mt-sm drawer-item" :style="loggedIn ? '' : 'pointer-events: none'">
          <q-item-section avatar>
            <q-icon name="far fa-envelope" size="md"/>
          </q-item-section>
          <q-item-section class="text-h5">Messages</q-item-section>
        </q-item>

        <q-item clickable v-ripple :to="`/${user.link}`" class="q-mb-sm q-mt-sm drawer-item" :style="loggedIn ? '' : 'pointer-events: none'">
          <q-item-section avatar>
            <q-icon name="far fa-user" size="md"/>
          </q-item-section>
          <q-item-section class="text-h5">Profile</q-item-section>
        </q-item>

        <q-item clickable v-ripple v-on:click.stop=logOut class="q-mb-sm q-mt-sm drawer-item" :style="loggedIn ? '' : 'pointer-events: none'">
          <q-item-section avatar>
            <q-icon name="fas fa-sign-out-alt" size="md"/>
          </q-item-section>
          <q-item-section style="overflow: hidden; white-space: nowrap" class="text-h5">Log Out</q-item-section>
        </q-item>

        
      </q-list>
    </q-drawer>

    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered class="q-pa-md" v-if="showRightDrawer">
      <!-- drawer content -->
       <search/>
    </q-drawer>

    <q-page-container class="page-wrapper">
        <template v-if="finishedFetching">
          <router-view v-if="loggedIn" :key="$route.fullPath"/>
          <auth-buttons v-on:signal="updateLoggedIn" v-else/>
        </template>
    </q-page-container>
    <q-resize-observer @resize="onResize"/>
  </q-layout>
</template>

<script>
const api = require('../API');
import { ref } from 'vue'
import authButtons from '../components/AuthButtons.vue';
import search from '../components/Search.vue'
export default {
  components: {
    'auth-buttons' : authButtons,
    'search' : search
  },
  setup () {
    const leftDrawerOpen = true
    const rightDrawerOpen = ref(false)
    const loggedIn = ref(false)
    const finishedFetching = ref(false)
    const user = ref({})
    
    console.warn = () => {};
    window.onunload = function () {
      sessionStorage.removeItem('posts');
      sessionStorage.removeItem('page');
    }
    return {
      finishedFetching,
      leftDrawerOpen,
      loggedIn,
      rightDrawerOpen,
      toggleRightDrawer () {
        rightDrawerOpen.value = !rightDrawerOpen.value
      },
      user,
    }
  },
  computed: {
    miniState: function() {
      return (this.$q.screen.width - 1100) < 0
    },
    showRightDrawer: function (){
      return this.$route.name != 'Messages not yet implemented'
    },
    showBack: function(){
      return this.$route.name != 'Home' && this.$route.name != 'Messages not yet implemented'
    }
  },
  methods: {
    goBack(){
      this.$router.back()
    },
    async updateLoggedIn() {
      const response = await api.checkedIfLoggedIn()
      if (response.status == 200){
      this.loggedIn = response.data ? true : false
        if (this.loggedIn) {
          this.user = response.data
          sessionStorage.setItem('user', JSON.stringify(response.data))
        }
      } else {
        //handle error
      }
    },
    setDrawersPosition () {
     this.setDrawerPosition('left');
     this.setDrawerPosition('right'); // if you add
   },
   setDrawerPosition (site) {
     const pageContainer = this.$el.querySelector('.q-page-container');
     if (pageContainer) {
       const drawer = this.$el.querySelector(`.q-drawer--${site}`);
       if (drawer) {
         const style = getComputedStyle(pageContainer);
         drawer.style[site] = style[`margin-${site}`];
       }
     }
   },
   onResize () {
      this.setDrawersPosition();
    },
    async logOut() {
      this.loggedIn = false
      sessionStorage.removeItem('user')
      sessionStorage.removeItem('posts');
      sessionStorage.removeItem('page');
      const response = await api.logOut()
      if (response.status == 200){
        console.log('Logged out')
      } else {
        //handle error
      }

    }
  },

  mounted () {
    const user = JSON.parse(sessionStorage.getItem('user'))
    if (user){
      this.user = user
      this.finishedFetching = true
      this.loggedIn = true
      return
    }
    this.updateLoggedIn().then(() =>
      this.finishedFetching = true
    ) 
  }
}
</script>

<style lang="sass">
.page-wrapper
  max-width: 1250px
  margin-left: auto
  margin-right: auto

.drawer-item
  border-radius: 25px
  width: min-content

</style>