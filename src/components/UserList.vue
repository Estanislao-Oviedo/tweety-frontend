<template >
    <div class="follow-overlay z-top" clickable v-on:click.stop="close"/>
    <div class="follow-container fixed-center z-top">
        <q-btn v-on:click.stop="close" flat round icon="fas fa-times" size="sm"/>
        <q-scroll-area  style="height: 483.5px">
            <q-list v-if="users.length" separator id="list" bordered class="list">
            <q-item v-for="(user, index) in virtualUsers" :key="user.link" clickable v-ripple class="q-pt-md" v-on:click.stop="openProfile(user.link)">
            <div style="display: inline-block; vertical-align: top">
            <q-avatar rounded=true size="52px">
                <img :src="user.pfpLink">
            </q-avatar>
            </div>
            <div style="display: inline-block;  margin-left: 10px; vertical-align: center">
            <q-item-label class="text-subtitle2 column" style="font-size: 15px">
                <strong>{{user.username}} </strong>
                <div class="text-grey-7" style="font-size: 15px; margin-top:2px">@{{user.link}}</div>
            </q-item-label>
            </div>
            <div class="bttn-container">
            <q-btn v-on:click.stop="toggleFollow(index)" :label="user.followed ? 'Unfollow': 'Follow'" no-caps flat :class=" user.followed ?  'follow-bttn' : 'follow-mode follow-bttn'" rounded/>
            </div>
            </q-item>
        </q-list>
            </q-scroll-area>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
const api = require('../API')
export default defineComponent({
    name: 'UserList',
    props: {
        path: String
    },
    data() {
        return {
            users: [],
            user: this.$parent.user
        }        
    },
    methods: {
        openProfile(link){
            this.$router.push(`/${link}`)
        },
        close(){
            this.$emit('close')
        },
        async toggleFollow(index){
            console.log(this.user)
            const response = await api.toggleFollow(this.users[index].link)
        
            if (this.virtualUsers[index].followed) {
                let idx = this.users[index].followers.indexOf(this.user._id)
                if (idx > -1) {
                this.users[index].followers.splice(idx, 1);
                }
                idx = this.user.follows.indexOf(this.users[index]._id)
                if (idx > -1) {
                this.users[index].follows.splice(idx, 1);
                }
            } else {
                this.users[index].followers.push(this.user._id)
                this.user.follows.push(this.users[index]._id)
            }
            if (response.status == 200) {
                sessionStorage.setItem('user', JSON.stringify(this.user))
                console.log('Nice')
            } else {
                //Handle error
            }
        },
    },
    computed: {
        virtualUsers: function(){
            for (let user of this.users){
                user.followed = user.followers.indexOf(this.user._id) !== -1 
            }
            return this.users
        }
    },
    async mounted(){
        if (this.path == 'followers'){
            const response = await api.getFollowers(this.$parent.profile.link)
            if (response.status == 200){
                this.users = response.data
            } else {
                //Handle error
            }
        }
        
        if (this.path == 'following'){
            const response = await api.getFollows(this.$parent.profile.link)
            if (response.status == 200){
                this.users = response.data
            } else {
                //Handle error
            }
        }
    }
})
</script>

<style lang="sass">
.follow-container
    background: black
    width: 500px
    display: table
    z-index: 10
    border-radius: 10px

.follow-overlay
    top: 0
    left: 0
    background: black !important
    opacity: 0.6
    position: absolute
    width: 100%
    height: 100%
    z-index:9

.follow-bttn
    border: 1px solid grey
    float: right
    overflow: auto

.bttn-container
    margin-left: auto

.follow-mode
    background-color: rgb(239, 243, 244)
    color: black
    border: 0
</style>