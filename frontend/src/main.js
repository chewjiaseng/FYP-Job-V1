import Vue from 'vue';
import App from './App.vue';
import router from './router';  // This should match the router file

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
