<template>
    <q-input debounce="500" outlined v-model="searchContent" @update:model-value="submit" rounded standout dense disable=false placeholder="Search" @focus="focusIcon" @blur="focusIcon">
              <template v-slot:prepend>
                <q-icon name="fas fa-search" :color="highlighted ? 'primary' : ''"  size="xs"/>
              </template>
              <template v-slot:append v-if="searchContent && highlighted">
                <q-icon color="primary" name="close" @click="searchContent = ''" class="cursor-pointer" />
              </template>
            </q-input>
        <q-scroll-area style="height: 483.5px; max-width: 300px;">
                <q-list v-if="searchContent && users.length" separator id="list" bordered class="list">
                 <q-item v-for="user in users" :key="user.link" clickable v-ripple class="q-pt-sm" v-on:click.stop="openProfile(user.link)">
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
                </q-item>
            </q-list>
        </q-scroll-area>
</template>

<script>
import { defineComponent } from 'vue'
const api = require('../API')

export default defineComponent({
    data() {
        return {
            searchContent: '',
            highlighted : false,
            users: []
        }
    },
    methods: {
        focusIcon(){
            this.highlighted = !this.highlighted
        },
        openProfile(link){
            this.$router.push(`/${link}`)
        },
        async submit(value){
            if (this.searchContent == '') return
            const response = await api.searchUser(this.searchContent)
            if (response.status == 200){
                this.users = response.data
            } else{
                //Handle Erorr
            }
        }
    }
    
})
</script>

<style lang="sass">
.list
    border-radius: 25px
</style>