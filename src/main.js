import { createApp } from 'vue'
import App from "./App.vue";
import router from "./router";
import store from "./store";
import '@/shared/styles/global.scss';
// import 'bootstrap';
// import { library } from '@fortawesome/fontawesome-svg-core'
// import { faEllipsisH } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// library.add(faEllipsisH)

// Vue.component('font-awesome-icon', FontAwesomeIcon)

// Vue.config.productionTip = false;

createApp(App)
  .use(store)
  .use(router)
  .mount("#app");
