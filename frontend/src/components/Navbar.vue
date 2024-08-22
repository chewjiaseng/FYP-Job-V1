<template>
    <v-app-bar app class="custom-navbar">
      <v-container>
        <v-row no-gutters class="custom-row">
          <v-col cols="auto">
            <v-toolbar-title class="custom-title">Easy Part</v-toolbar-title>
          </v-col>
          <v-col class="text-right">
            <v-btn text class="custom-button" to="/">Home</v-btn>
            <v-btn text class="custom-button" to="/job-search">Job Search</v-btn>
            <v-btn text class="custom-button" to="/job-provide">Job Provide</v-btn>
            <v-btn text class="custom-button" to="/job-recommendation">Job Recommendation</v-btn>
            <v-btn text class="custom-button" to="/about-us">About Us</v-btn>
            <v-btn text class="custom-button" to="/login">Login</v-btn>
             <!-- Added button -->
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
  </template>
  
  <style scoped>
  .custom-navbar {
    background-color: #4CAF50; /* Customize navbar background color */
  }
  
  .custom-title {
    font-size: 1.5rem; /* Customize title font size */
    font-family: 'Arial', sans-serif; /* Customize title font family */
  }
  
  .custom-row {
    align-items: center; /* Center align items vertically */
  }
  
  .custom-button {
    color: white; /* Customize button text color */
    font-size: 0.75rem; /* Customize button text size to be smaller */
    margin: 0 8px; /* Space between buttons (reduced margin) */
  }
  
  .custom-button:hover {
    color: #FFD700; /* Customize button text color on hover */
  }
  </style>
  