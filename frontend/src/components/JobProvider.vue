<template>
  <v-container class="job-provider-page" fluid padding="0">
    <Navbar />

    <h1 class="header-text">Job Provider </h1>
    <p class="description-text">
      In today's dynamic job market, job providers play a crucial role in connecting skilled individuals with part-time employment opportunities. Whether you are an individual seeking help for a specific task or an organization looking to fill short-term roles, our platform makes it easy to post job listings that attract the right candidates. Our user-friendly interface simplifies the process, allowing job providers to manage postings seamlessly and reach a diverse pool of potential hires. Join us in fostering flexible work opportunities that benefit both providers and seekers alike!
    </p>
    
    <v-row class="images-row">
      <v-col cols="12" md="6" class="image-container">
        <v-img src="@/assets/jobpro2.png" alt="Job Provider Image 2" class="image" />
      </v-col>
      <v-col cols="12" md="6" class="image-container">
        <v-img src="@/assets/jobpro3.png" alt="Job Provider Image 3" class="image" />
      </v-col>
    </v-row>
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
html, body {
  height: 100%; /* Ensure full height for background */
  margin: 0; /* Remove default margin */
  padding: 0; /* Remove default padding */
}

.job-provider-page {
  min-height: 100vh; /* Ensure minimum height to fill viewport */
  background-color: rgb(255, 240, 156); /* Background color for the page */
}

.header-text {
  font-size: 3em;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 20px; /* Space below the header */
}

.description-text {
  font-size: 1.2em;
  color: #34495e;
  text-align: center;
  margin-bottom: 40px; /* Space below the paragraph */
  max-width: 1200px; /* Maximum width for better readability */
  margin-left: auto; /* Centering */
  margin-right: auto; /* Centering */
}

.images-row {
  display: flex;
  justify-content: center; /* Center images in the row */
  margin-top: 20px; /* Space above images */
}

.image-container {
  display: flex;
  justify-content: center; /* Center image horizontally */
  align-items: center; /* Center image vertically */
}

.image {
  width: 100%; /* Make images responsive */
  max-width: 400px; /* Limit maximum width */
  height: auto; /* Maintain aspect ratio */
}
</style>
