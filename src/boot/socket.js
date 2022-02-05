import { boot } from 'quasar/wrappers'
const io = require('socket.io')
import Vue from 'vue'
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async (/* { app, router, ... } */) => {
  // something to do
  const socket = io(process.env.APIURL)
  export default ({ Vue }) => {
    Vue.prototype.$socket = socket;
  }
  export { socket }  
})
