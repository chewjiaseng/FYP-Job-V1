<template>
  <v-container class="admin-container" fluid>
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
        <v-card class="chart-card" style="margin-top: -30px;">
          <BarChart :chart-data="chartData" />
        </v-card>
      </v-col>
    </v-row>

    <!-- Buttons -->
    <v-row align="center" justify="center" style="margin-top: -20px;">
      <v-col class="text-center">
        <v-btn class="manage-users-btn mx-2" @click="goToManageUsers">
          <v-icon left>mdi-account</v-icon> Manage Users
        </v-btn>
        <v-btn class="manage-jobs-btn mx-2" @click="goToManageJobs">
          <v-icon left>mdi-briefcase</v-icon> Manage Jobs
        </v-btn>
        <v-btn class="manage-applications-btn mx-2" @click="goToManageApplications">
          <v-icon left>mdi-file-document</v-icon> Manage Applications
        </v-btn>
        <v-btn class="logout-btn mx-2" @click="logout">
          <v-icon left>mdi-logout</v-icon> Logout
        </v-btn>
      </v-col>
    </v-row>

    <!-- Snackbar for logout notification -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
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
/* Add a colorful gradient background */
.admin-container {
  background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
  min-height: 100vh;
  padding: 0; /* Remove padding for full-width */
}

h1 {
  font-family: 'Roboto', sans-serif;
  font-size: 2rem;
  color: #34495e;
  margin-bottom: 20px;
}

.chart-card {
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.3s ease-in-out;
}

.chart-card:hover {
  transform: translateY(-5px);
}

/* Button colors with previous design */
.manage-users-btn, .manage-jobs-btn, .manage-applications-btn, .logout-btn {
  margin: 10px; /* Add margin for spacing between buttons */
  padding: 12px 24px; /* Consistent padding */
  border-radius: 8px; /* Rounded corners */
  font-weight: bold; /* Bold text */
  color: white; /* White text color */
}

.manage-users-btn {
  background-color: #4CAF50 !important; /* Green */
}

.manage-users-btn:hover {
  background-color: #388E3C !important;
}

.manage-jobs-btn {
  background-color: #2196F3 !important; /* Blue */
}

.manage-jobs-btn:hover {
  background-color: #1976D2 !important;
}

.manage-applications-btn {
  background-color: #FFC107 !important; /* Amber */
}

.manage-applications-btn:hover {
  background-color: #FFA000 !important;
}

.logout-btn {
  background-color: #e74c3c !important; /* Red */
}

.logout-btn:hover {
  background-color: #c0392b !important;
}

/* Styling for the snackbar */
.snackbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.v-btn.v-btn--is-icon {
  margin-right: 8px;
}
</style>
