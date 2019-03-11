import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

Vue.prototype.$eh = new Vue({
  data(){
    return{
      scale: 1,
      curFrame: 0,
      color: {
        red: 0,
        green: 0,
        blue: 0
      }
    }
  }
})

new Vue({
  render: h => h(App),
}).$mount('#app')
