import { createRouter, createWebHistory } from 'vue-router'; // Vue Router 4 imports
import HomePage from '@/components/HomePage.vue';
import ResumeForm from '@/components/ResumeForm.vue';
import JobSearch from '@/components/JobSearch.vue';
import Login from '@/components/Login.vue';
import JobProvider from '@/components/JobProvider.vue';
import SignUp from '@/components/SignUp.vue';
import SeekerHome from '@/components/jobseekers/SeekerHome.vue';
import ProviderHome from '@/components/jobproviders/ProviderHome.vue';
import CreateJob from '@/components/jobproviders/CreateJob.vue';
import AdminHome from '@/components/admin/AdminHome.vue';
import ManageUserData from '@/components/admin/ManageUserData.vue';
import ManageJobsData from '@/components/admin/ManageJobsData.vue';
import ManageApplicationsData from '@/components/admin/ManageApplicationsData.vue';
import CheckApplications from '@/components/jobseekers/CheckApplications.vue';

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
  },
  {
    path: '/job-recommendation',
    name: 'ResumeForm',
    component: ResumeForm,
    meta: { requiresAuth: true },
  },
  {
    path: '/job-search',
    name: 'JobSearch',
    component: JobSearch,
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
    meta: { requiresAuth: true },
  },
  {
    path: '/provider-home',
    name: 'ProviderHome',
    component: ProviderHome,
    meta: { requiresAuth: true, hideNavbar: true, noMargin: true },
  },
  {
    path: '/admin-home',
    name: 'AdminHome',
    component: AdminHome,
    meta: { noMargin: true },
  },
  {
    path: '/create-job',
    name: 'CreateJob',
    component: CreateJob,
    meta: { noMargin: true },
  },
  {
    path: '/view-applications',
    name: 'ViewApplications',
    component: () => import('@/components/jobproviders/ViewApplications.vue'),
    meta: { requiresAuth: true, noMargin: true },
  },
  {
    path: '/manage-user-data',
    name: 'ManageUserData',
    component: ManageUserData,
    meta: { noMargin: true },
  },
  {
    path: '/manage-jobs-data',
    name: 'ManageJobsData',
    component: ManageJobsData,
    meta: { noMargin: true },
  },
  {
    path: '/manage-applications-data',
    name: 'ManageApplicationsData',
    component: ManageApplicationsData,
    meta: { noMargin: true },
  },
  {
    path: '/check-applications',
    name: 'CheckApplications',
    component: CheckApplications,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(), // Use history mode
  routes,
});

// Add navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('isAuthenticated'); // Check if the user is authenticated
  const username = sessionStorage.getItem('username');

  console.log('Navigating to:', to.fullPath);
  console.log('Authenticated:', isAuthenticated);
  console.log('Username:', username);

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (isAuthenticated && username) {
      next(); // Allow access if authenticated
    } else {
      next('/login'); // Redirect to login if not authenticated
    }
  } else {
    next(); // Always allow access if the route does not require authentication
  }
});

export default router;
