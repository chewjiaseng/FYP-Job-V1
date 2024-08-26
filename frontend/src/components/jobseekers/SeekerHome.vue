<template>
    <div>
      <!-- Include the NavbarSeeker component -->
      <NavbarSeeker />
  
      <!-- Main content -->
      <v-container class="seeker-home">
        <v-row>
          <v-col>
            <h1>Welcome Job Seekers</h1>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </template>
  
  <script>
  // Import the NavbarSeeker component
  import NavbarSeeker from './NavbarSeeker.vue';
  
  export default {
    name: 'SeekerHome',
    components: {
      NavbarSeeker
    }
  }
  </script>
  
  <style scoped>
  .seeker-home {
    text-align: center; /* Center-align the text */
    margin-top: 20px; /* Add some margin to the top */
  }
  
  .seeker-home h1 {
    font-family: 'Arial', sans-serif;
    color: #4CAF50; /* Customize the text color */
  }
  </style>
  