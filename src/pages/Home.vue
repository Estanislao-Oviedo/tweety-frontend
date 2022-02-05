<template>
     <q-input placeholder="What's happenning?" v-model="createPostContent" counter maxlength="280" class="q-ma-md textInput" autogrow spellcheck="false">
        <template v-slot:before>
          <q-avatar rounded=true size="xl">
            <img :src="user.pfpLink">
          </q-avatar>
        </template>
        <template v-slot:after>
          <q-btn unelevated rounded color="primary" label="Post" no-caps :disable="!createPostContent" @click="submitPost"/>
        </template>
      </q-input>
      <q-separator />

      <posts-list path="home"/>
    
</template>
<script>

import { defineComponent } from 'vue';
const api = require('../API')
import postsList from '../components/PostsList.vue'
export default defineComponent({
  name: 'PageHome',
  components: {
    'posts-list': postsList
  },
  data() {
    return {
      createPostContent: '',
      user: {}
    }
  },
  methods: {
    async submitPost(){
      let formData = new FormData()
      formData.append("content", this.createPostContent)
      const response = await api.createPost(formData)
      if (response.status == 201){
        this.createPostContent = ''
        this.$router.push(`/${this.user.link}/status/${response.data._id}`)
        //load new post
      } else {
        //handle error
      }
    },
  },
  async mounted(){
    this.user = JSON.parse(sessionStorage.getItem('user'))
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