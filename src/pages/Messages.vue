<template>
    <q-separator/>
    <q-splitter
    v-model="splitterModel"
      style="height: 100vh">
        <template v-slot:before>
            <q-tabs
                v-model="tab"
                vertical
                indicator-color="primary"
                style="width: 380px">

                <q-tab v-for="(conversation, index) in conversations"
                :key="index"
                :name="index"
                style="justify-content:flex-start"
                no-caps>
                    <div style="display:flex" class="q-pa-sm">
                        <q-item-section avatar top class="q-mt-sm">
                        <q-avatar rounded=true clickable v-on:click.stop="openProfile(conversation.user.link)">
                        <img :src="conversation.user.pfpLink">
                        </q-avatar>
                        </q-item-section>
                        <q-item-section>
                            <q-item-label clickable v-on:click.stop="openProfile(conversation.user.link)">
                                <strong >{{conversation.user.username}}</strong><span class="text-grey-7">@{{conversation.user.link}}</span>
                            </q-item-label>
                        </q-item-section>
                    </div>
                </q-tab>
            </q-tabs>
        </template>
        <template v-slot:after>
            <q-tab-panels
                v-model="tab">
                <q-tab-panel v-for="(conversation, index) in conversations"
                    :key="index"
                    :name="index"
                    style="justify-content:flex-start"
                    no-caps>
                    <div class="text-subtitle1">{{conversation.user.link}}</div>
                </q-tab-panel>
            </q-tab-panels>
        </template>
    </q-splitter>
</template>
<script>
import { defineComponent, ref } from 'vue';
import { formatDistanceToNow, parseISO} from 'date-fns'
const api = require('../API')
export default defineComponent({
  name: 'MessagesPage',
  //Data
  data() {
      return {
          tab: ref(''),
      conversations: [
          {
            user: {
                pfpLink: 'https://pbs.twimg.com/profile_images/1473692752873463819/XOgEAx9B_400x400.jpg',
                username: 'Necko',
                link: 'NeckoLol'
            }
        },
        {
          user: {
              pfpLink: 'https://pbs.twimg.com/profile_images/1487993964225511428/hbs4NQ96_400x400.jpg',
              username: 'asyc',
              link: 'AsycLol'
          }
        }
      ],
      user: {}
      }
  },
  //Methods
  methods: {
  },
  //Computed
  computed: {
  },
  //Mounted
  async mounted(){
    this.user = JSON.parse(sessionStorage.getItem('user'))

    //load conversations
  }
})
</script>


<style lang="sass">
</style>