<template>
  <error-404 v-if="error == 404"/>
  <div v-if="finishedLoading">
    <posts-list path="parentreplies"/>
    <q-item class="q-pt-sm">
      <div style="width:100%">
        <div> 
          <div style="display: inline-block; vertical-align: top">
          <q-avatar rounded=true size="52px" clickable v-on:click.stop="openProfile(post.author.link)">
            <img :src="post.author.pfpLink">
          </q-avatar>
          </div>
          <div style="display: inline-block;  margin-left: 10px; vertical-align: center">
          <q-item-label class="text-subtitle2 column" style="font-size: 15px">
            <strong clickable v-on:click.stop="openProfile(post.author.link)">{{post.author.username}} </strong>
            <div class="text-grey-7" style="font-size: 15px; margin-top:2px" clickable v-on:click.stop="openProfile(post.author.link)">@{{post.author.link}}</div>
          </q-item-label>
          </div>
        </div>
        <div class="q-gutter-md q-mt-md">
          <q-item-label style="font-size: 23px" :class="post.deleted ? 'text-grey-7 text-bold' : ''">{{post.content}}</q-item-label>

          <div class="text-grey-7" style="font-size: 15px">{{formattedDate}}</div>
          
          <q-separator/>

          <div class="row justify-between q-mt-sm">
            <div class="buttonDiv">
              <q-btn flat round icon="far fa-comment" size="sm" color="grey-7"/>
              <span class="buttonSpan text-grey-7 text-subtitle2">{{commentCount}}</span>
            </div>
            <div>
              <q-btn flat round icon="fas fa-retweet" size="sm" color="grey-7"/>
            </div>
            <div class="buttonDiv">
              <q-btn flat round :icon="liked? 'fas fa-heart' : 'far fa-heart'" size="sm" :color="liked ? 'red' : 'grey-7'" v-on:click.stop="toggleLike" />
              <span class="buttonSpan text-grey-7 text-subtitle2">{{likeCount}}</span>
            </div>
              <div>
                <q-btn flat round icon="far fa-trash-alt" size="sm" color="grey-7" v-on:click.stop="deletePost(post._id)"/>
              </div>
            </div>
          </div>
        </div>
    </q-item>
    <q-separator inset/>
        <q-input placeholder="Post your reply" v-model="replyToPost" counter maxlength="280" class="q-ma-md textInput" autogrow spellcheck="false">
          <template v-slot:before>
            <q-avatar rounded=true size="xl">
              <img :src="user.pfpLink">
            </q-avatar>
          </template>
          <template v-slot:after>
            <q-btn unelevated rounded color="primary" label="Post" no-caps :disable="!replyToPost" @click="submitReply"/>
          </template>
        </q-input>
      <q-separator/>
    <posts-list path="post"/>
  </div>
</template>


<script>
import { defineComponent } from 'vue';
import { format, parseISO} from 'date-fns'
const api = require('../API')
import postsList from '../components/PostsList.vue'
import error404 from './Error404.vue'
export default defineComponent({
  name: 'Post',
  components: {
    'posts-list': postsList,
    'error-404' : error404
  },
  data() {
    return {
      replyToPost: '',
      post: {
      },
      error: 0,
      finishedLoading: false
    }
  },
  computed: {
    liked : function(){
      return this.post.likes.includes(this.user._id)
    },
    likeCount: function() {
      return this.post.likes.length
    },
    commentCount: function() {
      return this.post.comments.length
    },
    formattedDate: function() {
      return format(parseISO(this.post.createdAt), 'p · PP')
    },
  },
  methods: {
    async toggleLike() {
      const response = await api.toggleLike(this.post._id)
      if (this.liked){
        let idx = this.post.likes.indexOf(this.user._id);
        if (idx > -1) {
        this.post.likes.splice(idx, 1);
        }
      } else {
        this.post.likes.push(this.user._id)
      }
      if (response.status == 200) {
        console.log('Nice')
      } else {
        //Handle error
      }
    },
    async submitReply() {
      let formData = new FormData()
      formData.append("content", this.replyToPost)
      formData.append("replyToWhich", this.post._id)
      const response = await api.createPost(formData)
      if (response.status == 201){
        this.replyToPost = ''
        this.post.comments.unshift(response.data)
      } else {
        //handle error
      }
    },
    async deletePost(id){
      const response = await api.deletePost(id)
      if (response.status == 200){
        console.log('Post removed sucesfully')
        const post = response.data
        this.post.content = 'deleted'
        this.post.deleted = true

      }
      
    },
    openProfile(link){
      this.$router.push(`/${link}`)
    }
  },
  async mounted(){
    this.user = JSON.parse(sessionStorage.getItem('user'))
    const response = await api.getPost(this.$router.currentRoute.value.params.id)
    if( response.status == 200 ) {
      console.log('Post loaded succesfully')
      this.post = response.data
      this.finishedLoading = true
    } else if (response.status == 404){
      console.log('404')
      this.error = 404
    } else {
      //handle error
    }
  }
})
</script>