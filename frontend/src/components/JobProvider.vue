<!-- src/components/JobProvider.vue -->
<template>
    <v-container>
      <Navbar />

      <h1>Job Provider Page</h1>
      <!-- Add job search functionality here -->
    </v-container>
  </template>
  
  <script>
  import Navbar from './Navbar.vue';

  export default {
    name: 'JobProvider',
    components: {
    Navbar,
  },
  };
  </script>
  
  <style scoped>
  /* Add styles if needed */
  </style>
  