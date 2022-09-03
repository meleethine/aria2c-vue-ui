import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Aria2Client from "./aria2-client";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

// const aria2 = new Aria2Client({
//   host: "localhost",
//   port: 6800,
//   secret: "999"
// });
// window.aria2 = aria2;

Vue.config.productionTip = false;

let app=new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
window.app=app