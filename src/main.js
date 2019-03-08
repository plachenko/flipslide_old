import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

Vue.prototype.$eh = new Vue({
  data(){
    return{
      scale: 1
    }
  }
})

new Vue({
  render: h => h(App),
}).$mount('#app')
