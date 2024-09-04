<template>
  <v-app-bar app class="custom-navbar">
    <v-container>
      <v-row no-gutters align="center">
        <v-col cols="auto">
          <v-toolbar-title class="custom-title">
            <img src="@/assets/logo.jpg" alt="Logo" class="logo-image" />
          </v-toolbar-title>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="auto" class="button-container">
          <v-btn text class="custom-button" to="/seeker-home">Home</v-btn>
          <v-btn text class="custom-button" to="/job-recommendation">Job Recommendation</v-btn>
          <v-btn text class="custom-button logout-button" @click="logout">Logout</v-btn>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="auto" class="right-user">
          <span v-if="username" class="username">{{ username }}</span>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['username']),
    username() {
      console.log('Navbar username:', this.$store.getters.username);
      return this.$store.getters.username;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('updateUsername', ''); // Clear username from Vuex store
      sessionStorage.removeItem('username'); // Clear username from sessionStorage
      sessionStorage.removeItem("userId");
      sessionStorage.removeItem("username");
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole'); // Clear user role


      this.$router.push('/login'); // Redirect to login page
    }
  }
}
</script>


<style scoped>
.custom-navbar {
  background-color: #4caf50; /* Customize navbar background color */
}

.custom-title {
  font-size: 1.5rem; /* Customize title font size */
  font-family: 'Arial', sans-serif; /* Customize title font family */
}

.button-container {
  display: flex;
  gap: 16px; /* Space between buttons */
  justify-content: center; /* Center the buttons */
}

.custom-button {
  margin-top: 20px;
  color: rgb(0, 0, 0); /* Customize button text color */
  font-size: 1rem; /* Customize button text size */
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

.right-user {
  display: flex;
  align-items: center; /* Vertically center-aligns the username */
  justify-content: flex-end; /* Pushes the username to the right */
  margin-top: 20px;
  height: 100% /* Align user text to the right */
}

.username {
  padding-top: 5px;  /* Adds space above the username text */
  margin-top: 0;     /* Reset margin-top to avoid negative impact */
  color: black;      /* Set the color to black */
  font-size: 1rem; /* Adjust the font size if needed */
  line-height: 1.5; /* Adjust the font size if needed */
}
</style>
