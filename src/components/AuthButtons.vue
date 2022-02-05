<template>
  <div class="q-pa-md row q-gutter-y-md fixed-center border" style="width: 265px; ">
    <q-btn class="row text-black q-pa-sm" style="width:100%; margin-top:10px" color="white" @click="toggleLogInForm" rounded label="Log in"/>
    <q-btn class="row text-black q-pa-sm" style="width:100%" color="white" @click="toggleSignUpForm" rounded label="Sign up"/>
    <q-separator color="primary" style="width:100%"/>
    <q-btn class="row text-black q-pa-sm" style="width:100%" color="white" @click="logWithTestUser" rounded label="Use test user"/>
  </div>
    <loginForm v-if="showLogInForm" v-on:close="toggleLogInForm"/>
    <signUpForm v-if="showSignUpForm" v-on:close="toggleSignUpForm"/>
</template>

<script>
import { defineComponent } from 'vue';
import loginForm from './Login.vue';
import signUpForm from './SignUp.vue';
const api = require('../API');

export default defineComponent({
    components: {
    'loginForm' : loginForm,
    'signUpForm' : signUpForm,
  },
    data(){
      return {
        showLogInForm: false,
        showSignUpForm: false,
      }
    },
    methods: {
    toggleLogInForm () {
      this.showLogInForm = !this.showLogInForm
    },
    toggleSignUpForm () {
      this.showSignUpForm = !this.showSignUpForm
    },
    async logWithTestUser () {
        let formData = new FormData();
        formData.append("email", "email@email.com")
        formData.append("password","password")
        const response = await api.logIn(formData)
        this.$emit('signal')
    }
  },
})
</script>