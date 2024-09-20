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
import CreateJob from '@/components/jobproviders/CreateJob.vue';  // Import CreateJob
import AdminHome from '@/components/admin/AdminHome.vue'; // Import AdminHome
import ViewUserData from '@/components/admin/ViewUserData.vue';  // Add this import


Vue.use(Router);

const router = new Router({
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
      meta: { requiresAuth: true }
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
      path: '/seeker-home',
      name: 'SeekerHome',
      component: SeekerHome,
      meta: { requiresAuth: true } 
    },
    {
      path: '/provider-home',
      name: 'ProviderHome',
      component: ProviderHome,
      meta: { requiresAuth: true }  // Add meta field to require authentication
    },
    {
      path: '/admin-home',
      name: 'AdminHome',
      component: AdminHome,
    },
    {
      path: '/create-job',
      name: 'CreateJob',
      component: CreateJob,
    },
    {
      path: '/view-applications',
      name: 'ViewApplications',
      component: () => import('@/components/jobproviders/ViewApplications.vue'),  // Create this component
      meta: { requiresAuth: true }  // Protect the route with authentication
    },
    {
      path: '/view-user-data',
      name: 'ViewUserData',
      component: ViewUserData,
    }
  ],
});

// Add navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('isAuthenticated'); // Check if the user is authenticated
  const username = sessionStorage.getItem('username');

  console.log('Navigating to:', to.fullPath);
  console.log('Authenticated:', isAuthenticated);
  console.log('Username:', username);

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (isAuthenticated && username) {
      next(); // Allow access if authenticated
    } else {
      next('/login'); // Redirect to login if not authenticated
    }
  } else {
    next(); // Always allow access if the route does not require authentication
  }
}

);

export default router;
