<template>
    <error-404 v-if="error == 404"/>
    <div v-if="finishedLoading">

      <user-list v-if="showFollowers" v-on:close="toggleShowFollowers" path="followers"/>
      <user-list v-if="showFollowing" v-on:close="toggleShowFollowing" path="following"/>

      <div class="header">
        <img :src="profile.headerLink || require('../assets/defaultHeader.jpg')" class="headerImg">
      </div>
      <div class="q-pr-md q-pl-md">
          <q-avatar rounded=true size="140px" style="margin-top: -70px; margin-bottom: -70px">
              <img :src="profile.pfpLink" style="border: 5px solid black">
          </q-avatar>
          <div style="float: right" class="q-pt-md">
              <q-btn v-if="myProfile" @click="toggleEditProfileForm" label="Edit profile" no-caps flat class="text-white" rounded style="width: auto; border: 1px solid grey;"/>
              <q-btn v-else @click="toggleFollow" :label="followed ? 'Unfollow': 'Follow'" no-caps flat :class="followed ? 'grey-border' : 'follow-mode'" rounded style="width: auto;"/>
          </div>
          <div style="margin-top: 70px">
              <q-item-label class="text-h5 text-weight-bold">{{profile.username}}</q-item-label>
              <q-item-label class="text-subtitle1 text-grey-7 q-mb-sm">@{{profile.link}}</q-item-label>
              <q-item-label class="text-subtitle1 q-mb-sm q-mt-sm" style="white-space: pre-line">{{profile.bio}}</q-item-label>
              <span class="underline-hover" clickable  v-on:click.stop="toggleShowFollowing">
              <span>{{profile.follows.length}}</span>
              <span class="text-grey-7"> Following</span>
              </span>
              <span class="underline-hover" clickable  v-on:click.stop="toggleShowFollowers">
              <span class="q-ml-md">{{profile.followers.length}}</span>
              <span class="text-grey-7"> Followers</span>
              </span>
          </div>
      </div>
      <edit-profile v-if="showEditProfileForm" v-on:close="toggleEditProfileForm"/>

      <div class="q-gutter-y-md q-mt-md">
        <q-tabs
          v-model="tab"
          class="text-white"
          no-caps
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="posts" label="Posts" />
          <q-tab name="replies" label="Replies"/>
        </q-tabs>

    </div>
      <q-separator/>
      <q-tab-panels
          v-model="tab"
          animated
          swipeable
          transition-prev="slide-right"
          transition-next="slide-left"
          keep-alive>
          <q-tab-panel name="posts" style="padding: 0">
            <posts-list path="userposts"/>
          </q-tab-panel>
          <q-tab-panel name="replies" style="padding: 0">
            <posts-list path="userreplies"/>
          </q-tab-panel>
      </q-tab-panels>
    </div>

</template>

<script>

import { ref, defineComponent } from 'vue';
import editProfile from '../components/EditProfile.vue'
import postsList from '../components/PostsList.vue'
import error404 from './Error404.vue'
const api = require('../API')
import userList from '../components/UserList.vue'
export default defineComponent({
    components: {
        'editProfile' : editProfile,
        'posts-list': postsList,
        'error-404' : error404,
        'user-list' : userList
    },
  name: 'ProfilePage',
  data() {
    return {
      user: {},
      profile: {
          link: '',
          followers: [],
          follows: [],
          username: '',
          link: '',
          bio: '',
          headerLink: ''
      },
      showEditProfileForm: false,
      error: 0,
      tab: ref('posts'),
      myProfile: false,
      finishedLoading: false,
      showFollowing: false,
      showFollowers: false
    }
  },
  computed: {
    followed: function() {
      return this.profile.followers.indexOf(this.user._id) !== -1
    }
  },
  methods: {
    toggleEditProfileForm() {
      this.showEditProfileForm = !this.showEditProfileForm
    },
    async toggleFollow(){
      const response = await api.toggleFollow(this.profile.link)
      if (this.followed) {
        let idx = this.profile.followers.indexOf(this.user._id)
        if (idx > -1) {
        this.profile.followers.splice(idx, 1);
        }
        idx = this.user.following.indexOf(this.profile._id)
        if (idx > -1) {
        this.profile.following.splice(idx, 1);
        }
      } else {
        this.profile.followers.push(this.user._id)
        this.user.following.push(this.profile._id)
      }
      if (response.status == 200) {
        console.log('Nice')
      } else {
        //Handle error
      }
      
    },
    toggleShowFollowers(){
      this.showFollowers = !this.showFollowers
    },
    toggleShowFollowing(){
      this.showFollowing = !this.showFollowing
    }
  },
  async mounted(){
    this.user = JSON.parse(sessionStorage.getItem('user'))
    const link = this.$route.params.link
    this.myProfile = this.user.link == link
    const response = await api.getUser(link)
    if (response.status == 200) {
        this.profile = response.data
        this.finishedLoading = true
    } else if (response.status == 404){
        this.error = 404
    } else {
        //handle error
    }
  },
})
</script>

<style lang="sass">
.header
  height: 280px
  width:100%
.headerImg
  width:100%
  height:100%
  object-fit: cover

.underline-hover:hover
  text-decoration-line: underline

.grey-border
  border: 1px solid grey
</style>