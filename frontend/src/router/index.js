import Vue from 'vue';
import VueRouter from 'vue-router';
import HomePage from '../components/HomePage.vue'; // Adjust the path to your components


Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  // Add more routes here
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
