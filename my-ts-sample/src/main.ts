import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import hub from "@/hub";

Vue.config.productionTip = false

Vue.use(hub);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
