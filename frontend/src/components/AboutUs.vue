<!-- src/components/AboutUs.vue -->
<template>
    <v-container>
      <Navbar />
      <h1>About Us Page</h1>
      <h1>This is another thing i want to change to github</h1>
      <!-- Add about us information here -->
    </v-container>
  </template>
  
  <script>
  import Navbar from './Navbar.vue';
  export default {
    name: 'AboutUs',
    components: {
    Navbar,
  },
  };
  </script>
  
  <style scoped>
  /* Add styles if needed */
  </style>
  