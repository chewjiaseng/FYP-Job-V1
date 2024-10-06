<template>
  <v-container>
    <!-- Welcome Message -->
    <v-row align="center" justify="center" style="height: auto;">
      <v-col class="text-center">
        <h1>Welcome, {{ username }} (ID: {{ userId }})</h1>
      </v-col>
    </v-row>

    <!-- Loading Spinner -->
    <v-row justify="center" v-if="isLoading">
      <v-col class="text-center">
        <v-progress-circular indeterminate color="primary" />
        <p>Loading Data...</p>
      </v-col>
    </v-row>

    <!-- Bar Chart displaying counts -->
    <v-row v-else justify="center" class="my-5">
      <v-col cols="12" md="8">
        <BarChart :chart-data="chartData" />
      </v-col>
    </v-row>

    <!-- Buttons -->
    <v-row align="center" justify="center">
      <v-col class="text-center">
        <v-btn class="mx-2" color="primary" @click="goToManageUsers">Manage Users</v-btn>
        <v-btn class="mx-2" color="primary" @click="goToManageJobs">Manage Jobs</v-btn>
        <v-btn class="mx-2" color="primary" @click="goToManageApplications">Manage Applications</v-btn>
        <!-- Logout Button -->
        <v-btn class="mx-2" color="red" text-color="white" @click="logout">Logout</v-btn>
      </v-col>
    </v-row>

    <!-- Snackbar for logout notification -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000" class="custom-snackbar">
      <div class="snackbar-content">
        {{ snackbarText }}
        <v-btn color="white" text @click="snackbar = false">Close</v-btn>
      </div>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from "axios";
import BarChart from '@/components/admin/BarChart.vue'; // Correct import

export default {
  name: 'AdminHome',
  components: { 
    BarChart,
  },
  data() {
    return {
      username: "",
      userId: "",
      snackbar: false,
      snackbarText: "",
      snackbarColor: "",
      isLoading: true, // New loading state
      usersCount: 0,
      jobsCount: 0,
      applicationsCount: 0,
      chartData: {
        labels: ["Users", "Jobs", "Applications"],
        datasets: [
          {
            label: "Total Count",
            backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f"],
            data: [0, 0, 0], // Initial values for the chart
          },
        ],
      },
    };
  },
  mounted() {
    this.getUserInfo();
    this.fetchCounts(); 
  },
  methods: {
    getUserInfo() {
      const apiUrl = process.env.VUE_APP_API_URL;
      axios
        .get(`${apiUrl}/user-info`, { withCredentials: true })
        .then((response) => {
          this.username = response.data.username;
          this.userId = response.data.user_id;
          sessionStorage.setItem("userId", this.userId);
          sessionStorage.setItem("username", this.username);
          localStorage.setItem("isAuthenticated", "true"); 
        })
        .catch((error) => {
          console.error("Error fetching user info:", error);
        });
    },
    fetchCounts() {
      const apiUrl = process.env.VUE_APP_API_URL;
      axios
        .get(`${apiUrl}/counts`, { withCredentials: true })
        .then((response) => {
          this.usersCount = response.data.usersCount;
          this.jobsCount = response.data.jobsCount;
          this.applicationsCount = response.data.applicationsCount;

          // Update chart data after fetching counts
          this.chartData.datasets[0].data = [
            this.usersCount,
            this.jobsCount,
            this.applicationsCount,
          ];
        })
        .catch((error) => {
          console.error("Error fetching counts:", error);
        })
        .finally(() => {
          this.isLoading = false;  // Stop loading once data is fetched
        });
    },
    logout() {
      const apiUrl = process.env.VUE_APP_API_URL;
      axios
        .get(`${apiUrl}/logout`, { withCredentials: true })
        .then(() => {
          sessionStorage.removeItem("userId");
          sessionStorage.removeItem("username");
          localStorage.removeItem("isAuthenticated");

          this.username = "";
          this.userId = "";
          this.snackbarText = "Successfully logged out";
          this.snackbarColor = "green";
          this.snackbar = true;

          this.$router.push("/login");
        })
        .catch((error) => {
          console.error("Error during logout:", error);
        });
    },
    goToManageUsers() {
      this.$router.push("/manage-user-data");
    },
    goToManageJobs() {
      this.$router.push("/manage-jobs-data");
    },
    goToManageApplications() {
      this.$router.push("/manage-applications-data");
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
