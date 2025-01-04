import { createApp } from 'vue';  // Vue 3 syntax
import App from './App.vue';
import router from './router';
import store from './store';

// Import Vuetify and its styles
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css'; // Material Design Icons

// Import Vuetify components and directives
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// Initialize Vuetify
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
  },
});

// Create the Vue app
const app = createApp(App);

app.use(router); // Use router
app.use(store); // Use Vuex store
app.use(vuetify); // Use Vuetify

app.mount('#app'); // Mount the app
