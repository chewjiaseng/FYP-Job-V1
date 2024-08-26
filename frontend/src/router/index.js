import Vue from 'vue';
import Router from 'vue-router';
import HomePage from '@/components/HomePage.vue';
import ResumeForm from '@/components/ResumeForm.vue';
import JobSearch from '@/components/JobSearch.vue';
import AboutUs from '@/components/AboutUs.vue';
import Login from '@/components/Login.vue';
import JobProvider from '@/components/JobProvider.vue';
import SignUp from '@/components/SignUp.vue';
import SeekerHome from '@/components/jobseekers/SeekerHome.vue';  // Import SeekerHome
import ProviderHome from '@/components/jobproviders/ProviderHome.vue';  // Import ProviderHome
import AdminHome from '@/components/admin/AdminHome.vue'; // Import AdminHome


Vue.use(Router);

export default new Router({
  mode: 'history', // Use history mode here
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage,
    },
    {
      path: '/job-recommendation',
      name: 'ResumeForm',
      component: ResumeForm,
    },
    {
      path: '/job-search',
      name: 'JobSearch',
      component: JobSearch,
    },
    {
      path: '/about-us',
      name: 'AboutUs',
      component: AboutUs,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/job-provide',
      name: 'JobProvider',
      component: JobProvider,
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp,
    },
    {
      path: '/seeker-home',  // Add the new route
      name: 'SeekerHome',
      component: SeekerHome,
    },
    {
      path: '/provider-home',  // Add the new route for ProviderHome
      name: 'ProviderHome',
      component: ProviderHome,
    },
    {
      path: '/admin-home',
      name: 'AdminHome',
      component: AdminHome,
    }
  ],
});
