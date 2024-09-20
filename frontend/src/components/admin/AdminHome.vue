<template>
  <v-container>
    <v-row align="center" justify="center" style="height: 100vh;">
      <v-col class="text-center">
        <h1>Welcome, {{ username }} (ID: {{ userId }})</h1>
        
        <!-- Buttons -->
        <v-btn class="mx-2" color="primary" @click="goToViewUsers">Manage Users</v-btn>
        <v-btn class="mx-2" color="primary" @click="goToViewJobs">Manage Jobs</v-btn>
        <v-btn class="mx-2" color="primary" @click="goToViewApplications">Manage Applications</v-btn>

        <!-- Logout Button -->
        <v-btn class="mx-2" color="red" text-color="white" @click="logout">
          Logout
        </v-btn>
      </v-col>
    </v-row>

    <!-- Snackbar for logout notification -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="3000"
      class="custom-snackbar"
    >
      <div class="snackbar-content">
        {{ snackbarText }}
        <v-btn color="white" text @click="snackbar = false">Close</v-btn>
      </div>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: 'AdminHome',
  data() {
    return {
      username: "",
      userId: "",
      snackbar: false,
      snackbarText: "",
      snackbarColor: "",
    };
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    // Fetch user info
    getUserInfo() {
  const apiUrl = process.env.VUE_APP_API_URL;
  axios
    .get(`${apiUrl}/user-info`, { withCredentials: true })
    .then((response) => {
      this.username = response.data.username;
      this.userId = response.data.user_id;
      sessionStorage.setItem("userId", this.userId);
      sessionStorage.setItem("username", this.username);
      localStorage.setItem("isAuthenticated", "true"); // Set authentication flag in localStorage
    })
    .catch((error) => {
      console.error("Error fetching user info:", error);
    });
},

    // Logout method
    logout() {
  const apiUrl = process.env.VUE_APP_API_URL;
  axios
    .get(`${apiUrl}/logout`, { withCredentials: true })  // Change POST to GET
    .then(() => {
      // Clear session and local storage
      sessionStorage.removeItem("userId");
      sessionStorage.removeItem("username");
      localStorage.removeItem("isAuthenticated");
      
      this.username = "";
      this.userId = "";
      this.snackbarText = "Successfully logged out";
      this.snackbarColor = "green";
      this.snackbar = true;
      
      // Redirect to login page
      this.$router.push("/login");
    })
    .catch((error) => {
      console.error("Error during logout:", error);
    });
},

    // Navigation methods
    goToViewUsers() {
      this.$router.push("/view-user-data");
    },
    goToViewJobs() {
      this.$router.push("/admin-view-jobs");
    },
    goToViewApplications() {
      this.$router.push("/admin-view-applications");
    },
  },
};
</script>

<style scoped>
h1 {
  font-family: Arial, sans-serif;
  font-size: 2rem;
  color: #2c3e50;
}
</style>
