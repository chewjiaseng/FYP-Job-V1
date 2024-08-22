import Vue from 'vue';
import App from './App.vue';
import router from './router';

// Import Vuetify and the necessary styles
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';  // For icons

Vue.config.productionTip = false;

// Use Vuetify as a plugin
Vue.use(Vuetify);

new Vue({
  router,
  vuetify: new Vuetify({
    theme: {
      dark: false  // Set to false to use the light theme
    }
  }),
  render: h => h(App),
}).$mount('#app');
