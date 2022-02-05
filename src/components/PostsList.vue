<template>
  <q-list :separator="path!='parentreplies'" id="list">
      <q-item v-for="(post, index) in virtualPosts" :key="index" clickable v-ripple class="q-pt-sm"  v-on:click.stop="openPost(post.author.link, post._id)">
          <q-item-section avatar top class="q-mt-sm">
            <q-avatar rounded=true clickable v-on:click.stop="openProfile(post.author.link)">
              <img :src="post.author.pfpLink">
            </q-avatar>
          </q-item-section>
            <q-item-section>
              <q-item-label class="text-subtitle2" clickable>
                <strong>{{post.author.username}} </strong><span class="text-grey-7">@{{post.author.link}} · {{post.relativeDate}}</span>
              </q-item-label>
              <q-item-label :class="post.deleted ? 'text-body2 text-grey-7 text-bold' : 'text-body2'">{{post.content}}</q-item-label>
                <div class="row justify-between q-mt-sm" >
                  <div class="buttonDiv">
                    <q-btn flat round disable icon="far fa-comment" size="sm" color="grey-7"/>
                    <span class="buttonSpan text-grey-7 text-subtitle2">{{post.commentCount}}</span>
                  </div>
                  <div>
                    <q-btn flat round disable icon="fas fa-retweet" size="sm" color="grey-7"/>
                  </div>
                  <div class="buttonDiv">
                    <q-btn flat round :icon=" post.liked? 'fas fa-heart' : 'far fa-heart'" size="sm" :color="post.liked ? 'red' : 'grey-7'" v-on:click.stop="toggleLike(index)" />
                    <span class="buttonSpan text-grey-7 text-subtitle2">{{post.likesCount}}</span>
                  </div>
                  <div>
                    <q-btn flat round icon="far fa-trash-alt" size="sm" color="grey-7" v-if="postOwner(post.author)" v-on:click.stop="deletePost(index)"/>
                  </div>
              </div>
            </q-item-section>
        </q-item>
    </q-list>
  <q-separator/>
</template>

<script>
import { defineComponent } from 'vue';
import { formatDistanceToNow, parseISO} from 'date-fns'
const api = require('../API')
export default defineComponent({
  name: 'PostsList',
  props: {
    path: String
  },
  //Data
  data() {
    return {
      posts: [],
      user: {
        _id: '',
        pfpLink: ''
      }
    }
  },
  //Methods
  methods: {
    openPost(link,id){
      this.$router.push(`/${link}/status/${id}`)
    },
    async submitPost(){
      let formData = new FormData()
      formData.append("content", this.createPostContent)
      const response = await api.createPost(formData)
      if (response.status == 201){
        this.createPostContent = ''
        //load new post
      } else {
        //handle error
      }
    },
    async loadMorePosts() {
      const page = parseInt(sessionStorage.getItem('page'))
      const response = await api.myFeed(page + 1)
      if (response.data.length > 0) {
        Array.prototype.push.apply(this.posts, response.data)
        sessionStorage.setItem('posts', JSON.stringify(this.posts))
        sessionStorage.setItem('page', page + 1)
      }
    },
    async toggleLike(index){
      const response = await api.toggleLike(this.posts[index]._id)
      if (this.posts[index].liked){
        let idx = this.posts[index].likes.indexOf(this.user._id);
        if (idx > -1) {
        this.posts[index].likes.splice(idx, 1);
        }
      } else {
        this.posts[index].likes.push(this.user._id)
      }
      if (response.status == 200) {
        sessionStorage.setItem('posts', JSON.stringify(this.posts))
      } else {
        //Handle error
      }
    },
    openProfile(link){
      this.$router.push(`/${link}`)
    },
    postOwner(author){
      return author._id == this.user._id
    },
    async deletePost(idx){
      const response = await api.deletePost(this.posts[idx]._id)
      if (response.status == 200){
        console.log('Post removed sucesfully')
        const post = response.data
        if (post){
          this.posts[idx] = post
        } else {
          this.posts.splice(idx, 1)
        }

      }
      
    }
  },
  //Computed
  computed: {
    virtualPosts: function() {
      for ( let post of this.posts ){
          post.liked = post.likes.includes(this.user._id)
          post.likesCount = post.likes.length
          post.relativeDate = formatDistanceToNow((parseISO(post.createdAt)), { addSuffix: true })
          post.commentCount = post.comments.length
      }
      return this.posts
    },
  },
  //Mounted
  async mounted(){
    this.user = JSON.parse(sessionStorage.getItem('user'))

    //get Feed
    if (this.path == 'home'){
    window.onscroll = async () => {
      let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight
      if (bottomOfWindow) {
        this.loadMorePosts()
        }
      }
    if (sessionStorage.getItem('posts')){
      this.posts = JSON.parse(sessionStorage.getItem('posts'))
      return
    }
    sessionStorage.setItem('page', 0)
    const response = await api.myFeed(0)

    console.log(response.data)
    sessionStorage.setItem('posts', JSON.stringify(response.data))
    this.posts = response.data
    }
    //get Posts comments
    if (this.path == 'post') {
      this.posts = this.$parent.post.comments
    }

    // get User posts
    if (this.path == 'userposts') {
      const response = await api.getUserPosts(this.$router.currentRoute.value.params.link)
      if (response.status == 200){
        console.log('Posts load succesfully')
        this.posts = response.data
      } else {
        //error handling
      }
    }
    // get User replies
    if (this.path == 'userreplies') {
      const response = await api.getUserReplies(this.$router.currentRoute.value.params.link)
      if (response.status == 200){
        console.log('Posts load succesfully')
        this.posts = response.data
      } else {
        //error handling
      }
    }
    if (this.path == 'parentreplies'){
      const response = await api.getParentReplies(this.$route.params.id)
      if (response.status == 200){
        this.posts = response.data
      } else {
        //Handle error
      }
      
    }
  }
})
</script>


<style lang="sass">
.textInput
  textarea
    font-size: 19px
    line-height: 1.4 !important

.buttonDiv
  display: table

.buttonSpan
  display:table-cell
  vertical-align: middle
</style>