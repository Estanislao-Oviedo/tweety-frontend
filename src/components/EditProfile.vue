<template>
<div id="loginForm" class="overlay z-top" clickable @click="closeForm"></div>
    <div class="q-pa-md fixed-center form  z-top">
        <div class="row" style="margin-top: -5px">
            <q-btn @click="closeForm" flat round color="" icon="fas fa-times" size="sm" class="autospace"/>
            <div class="autospace text-h6 text-weight-bolder" style="margin-left: -260px; display:table-cell"> Edit Profile</div>
            <q-btn :disable="!username" v-on:click.stop="onSubmit" label="Save" no-caps type="submit" color="white" class="text-black" rounded/>
        </div>

        <div class="editHeader">
            <img class="gridItem" :src="headerLink || require('../assets/defaultHeader.jpg')"/>
            <q-file
            display-value=""
            style="position: relational"
            :model-value="headerImage"
            accept=".jpg,.png, .jpeg"
            @rejected="onRejected"
            hide-upload-btn
            borderless
            @update:model-value="updateHeader"
            class="gridItem">
            </q-file>
        </div>
        <div style="display: grid; margin-top: -70px; margin-bottom: 20px; margin-left: 20px; height: 140px; width:140px">
        <q-file
        display-value=""
        class="gridItem"
        :model-value="pfpImage"
        rounded
        accept=".jpg,.png, image/*"
        @rejected="onRejected"
        hide-upload-btn
        borderless
        @update:model-value="updatePfp"
        >
        <q-avatar rounded=true size="140px">
              <img class="gridItem" :src="pfpLink" style="border: 5px solid black">
          </q-avatar>
        </q-file>
        </div>

        <q-input
            filled
            v-model="username"
            type="username"
            label="Username"
            lazy-rules
            spellcheck="false"
            :rules="[val => !!val || 'Username is missing', val => val.length < 40 || 'Username must be below 40 characters long']"
        />
        <q-input
            filled
            v-model="bio"
            type="Bio"
            label="Bio"
            autogrow
            spellcheck="false"
        />
    </div>
</template>

<script>
import { defineComponent } from 'vue';
const api = require('../API');
export default defineComponent({
    name: 'PageLogin',
    data() {
        return {
            username: '',
            bio: '',
            user: {
                username: '',
                pfpLink: '',
                bio: '',
                headerLink: ''
            },
            pfpLink: null,
            pfpImage: null,
            headerImage: null,
            headerLink: null
        }
    },
    methods: {
        closeForm() {
            this.$emit('close')
        },
        async onSubmit(){
            let formData = new FormData();
            formData.append('username', this.username)
            formData.append('bio', this.bio)
            if (this.pfpImage) {
                formData.append('pfpImage', this.pfpImage)
            }
            if (this.headerImage) {
                formData.append('headerImage', this.headerImage)
            }
            const response = await api.editProfile(formData)
            if (response.status == 200){
                sessionStorage.setItem('user', JSON.stringify(response.data))
                this.$parent.user = response.data
                this.$parent.profile = response.data
                this.$parent.$emit('signal')
                this.closeForm()
            }
            else{
                //handle Error
            }
        },
        updatePfp(image){
            this.pfpImage = image
            this.pfpLink = URL.createObjectURL(image)
        },
        updateHeader(image){
            this.headerImage = image
            this.headerLink = URL.createObjectURL(image)
        }
    },
    mounted(){
        this.user = this.$parent.user
        this.username = this.user.username
        this.bio = this.user.bio
        this.pfpLink = this.user.pfpLink
        this.headerLink = this.user.headerLink
    },
})
</script>
<style lang="sass">
.autospace
    margin-right: auto
.overlay
    top: 0
    left: 0
    background: rgba(91, 112, 131, 0.4) !important
    opacity: 0.6
    position: absolute
    width: 100%
    height: 100%

.form
    position: relative
    background: black
    width: 500px
    display: table
    margin-top: -12%
    z-index: 10
    border-radius: 10px


.editHeader
    width: 515px
    height: 230px
    margin-top: 8px
    display: grid

.gridItem
    grid-column: 1
    grid-row: 1
    width:100%
    height:100%
    object-fit: cover
</style>