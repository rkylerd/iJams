import { createApp } from 'vue'
import App from "./App.vue";
import router from "./router";
import store from "./store";
import '@/shared/styles/global.scss';
// import 'bootstrap';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEllipsisH, faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { fas } from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faTwitter } from "@fortawesome/free-brands-svg-icons";
import FontAwesomeIcon from "@/components/FontAwesomeIcon.vue";

library.add(faEllipsisH, faShoppingCart, fas, faTwitter, faInstagram);

// Vue.config.productionTip = false;

createApp(App)
  .use(store)
  .use(router)
  .component("fa", FontAwesomeIcon)
  .mount("#app");
