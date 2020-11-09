import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import '@/shared/styles/global.scss';
// import 'bootstrap';
import AsyncComputed from 'vue-async-computed'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faEllipsisH)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(AsyncComputed)

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: function(h) {
    return h(App);
  }
}).$mount("#app");
