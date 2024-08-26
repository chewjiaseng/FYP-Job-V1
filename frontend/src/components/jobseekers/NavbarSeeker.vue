<template>
    <v-app-bar app class="custom-navbar">
      <v-container>
        <v-row no-gutters class="custom-row">
          <v-col cols="auto">
            <v-toolbar-title class="custom-title">
              <img src="@/assets/logo.jpg" alt="Logo" class="logo-image" />
            </v-toolbar-title>
          </v-col>
          <v-col class="text-right">
            <v-btn text class="custom-button" to="/seeker-home">Home</v-btn>
            <v-btn text class="custom-button" to="/job-recommendation">Job Recommendation</v-btn>
            <v-btn text class="custom-button logout-button" @click="logout">Logout</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
  </template>
  
  <script>
  export default {
    methods: {
      logout() {
        localStorage.removeItem('userRole'); // Clear user role from storage
        this.$router.push('/login'); // Redirect to login page
      },
    },
  };
  </script>
  
  <style scoped>
  .custom-navbar {
    background-color: #4caf50; /* Customize navbar background color */
  }
  
  .custom-title {
    font-size: 1.5rem; /* Customize title font size */
    font-family: 'Arial', sans-serif; /* Customize title font family */
  }
  
  .custom-row {
    align-items: center; /* Center align items vertically */
  }
  
  .custom-button {
    color: rgb(0, 0, 0); /* Customize button text color */
    font-size: 0.75rem; /* Customize button text size to be smaller */
    margin: 0 8px; /* Space between buttons (reduced margin) */
  }
  
  .custom-button:hover {
    color: #ffd700; /* Customize button text color on hover */
  }
  
  .logo-image {
    height: 55px; /* Adjust the height of the logo as needed */
    margin-top: 15px;
    width: auto; /* Keep aspect ratio */
  }
  
  .logout-button {
    color: red;
  }
  </style>
  