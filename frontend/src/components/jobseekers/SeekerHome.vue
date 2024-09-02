<template>
  <div>
    <!-- Include the NavbarSeeker component and pass the username -->
    <NavbarSeeker :username="username" />

    <!-- Main content -->
    <v-container class="seeker-home">
      <v-row>
        <v-col>
          <h1>Welcome {{ username }}</h1> <!-- Display the username here -->
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
  },
  data() {
    return {
      username: '' // Initialize the username data property
    };
  },
  created() {
    this.username = sessionStorage.getItem('username') || ''; // Retrieve the username from sessionStorage
  }
}
</script>

<style scoped>
.seeker-home {
  text-align: center;
  margin-top: 20px;
}

.seeker-home h1 {
  font-family: 'Arial', sans-serif;
  color: #4CAF50;
}
</style>
