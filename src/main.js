import { createApp } from 'vue'
import App from "./App.vue";
import router from "./router";
import store from "./store";
import '@/shared/styles/global.scss';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faEllipsisH, faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { faCaretLeft, faCaretRight, fas, faExclamation, faTimes, faSearch, faHome, faMusic, faCompactDisc, faSignOutAlt, faBars, faPlay, faPause, faForward, faBackward } from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faTwitter } from "@fortawesome/free-brands-svg-icons";
import FontAwesomeIcon from "@/components/FontAwesomeIcon.vue";

library.add(faEllipsisH, faExclamation, faShoppingCart, fas, faTwitter, faInstagram, faPlay, faPause, faForward, faBackward,
  faTimes, faSearch, faHome, faMusic, faCompactDisc, faBars, faSignOutAlt, faCaretLeft, faCaretRight);

// Vue.config.productionTip = false;

createApp(App)
  .use(store)
  .use(router)
  .component("fa", FontAwesomeIcon)
  .mount("#app");
