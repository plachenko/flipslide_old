import Vue from 'vue'
import FS_App from './FS_App.vue'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.config.productionTip = false

Vue.prototype.$eventHub = new Vue({
  methods: { },

  data () {
    return {
      debug: false,
      size: {w: 3, h: 3},
      colors: [
        "#00000",
        "#FFFFF"
      ]
    }
  },
})

Vue.use(Vuetify)

new Vue({
  render: h => h(FS_App),
}).$mount('#app')
