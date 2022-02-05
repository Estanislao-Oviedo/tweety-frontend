<template>
<div id="signUpForm" class="overlayy">
    
    <div class="q-pa-md fixed-center border" style="width: 400px">
        <div class="row" style="margin-top: -5px">
            <q-btn @click="closeForm" flat round color="" icon="fas fa-times" size="sm" class="autospace"/>
            <q-icon name="fas fa-dove" size="md" class="autospace" style="margin-left: -30px"/>
        </div>
        <q-label class="row text-h5 text-weight-bold justify-center q-pa-sm">Sign up to tweety</q-label>


        <q-form
        @submit="onSubmit"
        class="q-gutter-md"
        >

        <q-input
            @keydown.space.prevent
            filled
            v-model="link"
            label="UserLink"
            lazy-rules
            :rules="[val => !!val || 'UserLink is missing', val => val.length < 40 || 'UserLink must be below 40 characters long']"
        />

        <q-input
            filled
            v-model="email"
            label="Email"
            lazy-rules
            :rules="[val => !!val || 'Email is missing', isValidEmail]"
        />

        <q-input
            filled
            v-model="password"
            type="password"
            label="Password"
            lazy-rules
            :rules="[
            val => val.length >= 8 && val.length <= 40 || 'Password must be between 8 and 40 characters long'
            ]"
        />
        <div>
            <q-btn label="Sign Up" type="submit" color="white" class="text-black" rounded style="width:100%"/>
        </div>
        </q-form>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
const api = require('../API')

export default defineComponent({
    name: 'PageLogin',
    data() {
        return {
        email: '',
        password: '',
        link: '',
        }
    },
    methods: {
        isValidEmail (val) {
            const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
            return emailPattern.test(val) || 'Invalid email';
        },
        closeForm() {
            this.$emit('close')
        },
        async onSubmit(){
            let formData = new FormData();
            formData.append("link", this.link)
            formData.append("email", this.email)
            formData.append("password", this.password)
            const response = await api.signUp(formData)
            if (response.status == 201){
                this.$parent.$emit('signal')
                this.$router.replace('/home')
            }
            else{
                //Handle Error
            }
        }
    },
})
</script>


<style lang="sass">
.border
  border: 0.5px solid
  border-radius: 10px
.autospace
    margin-right: auto
.overlayy
    position: absolute
    top: 0
    left: 0
    width: 100vw
    height: 100vh
    background-color: black
</style>