<template>
  <v-container>
    <h1>Welcome, {{ username }} (ID: {{ userId }})</h1>

    <!-- Create New Job Button -->
    <v-btn
      @click="goToCreateJob"
      class="create-job-button"
      color="green"
    >
      Create New Job
    </v-btn>

    <!-- Logout Button -->
    <v-btn
      @click="logout"
      class="logout-button"
      style="background-color: red; color: white;"
    >
      Logout
    </v-btn>

    <!-- Jobs Table -->
    <v-data-table
      :headers="headers"
      :items="jobs"
      item-key="id"
      class="elevation-1"
    >
      <template v-slot:items="{ item }">
        <tr>
          <td>{{ item.job_name }}</td>
          <td>{{ item.job_category }}</td>
          <td>{{ item.salary }}</td>
          <td>{{ item.working_place }}</td>
          <td>{{ item.working_hours }}</td>
          <td>{{ item.job_description }}</td>
          <td>{{ new Date(item.created_at).toLocaleDateString() }}</td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ProviderHome',
  data() {
    return {
      username: '',
      userId: '',
      jobs: [],
      headers: [
        { text: 'Job Name', value: 'job_name' },
        { text: 'Category', value: 'job_category' },
        { text: 'Salary', value: 'salary' },
        { text: 'Place', value: 'working_place' },
        { text: 'Hours', value: 'working_hours' },
        { text: 'Description', value: 'job_description' },
        { text: 'Created At', value: 'created_at' }
      ]
    };
  },
  mounted() {
    this.getUserInfo();
    this.getProviderJobs();
  },
  methods: {
    getUserInfo() {
      axios
        .get('http://localhost:5000/user-info', { withCredentials: true })
        .then(response => {
          this.username = response.data.username;
          this.userId = response.data.user_id;
          // Store the userId in sessionStorage
          sessionStorage.setItem('userId', this.userId);
        })
        .catch(error => {
          console.error('Error fetching user info:', error);
        });
    },
    getProviderJobs() {
      axios
        .get('http://localhost:5000/provider-jobs', { withCredentials: true })
        .then(response => {
          this.jobs = response.data;
        })
        .catch(error => {
          console.error('Error fetching provider jobs:', error);
        });
    },
    goToCreateJob() {
      this.$router.push('/create-job');
    },
    logout() {
      axios.get('http://localhost:5000/logout', { withCredentials: true })
        .then(response => {
          if (response.data.message) {
            localStorage.removeItem('isAuthenticated'); // Clear authentication status
            localStorage.removeItem('userRole'); // Clear user role

            this.$router.push('/login');
          }
        })
        .catch(error => {
          console.error('Error during logout:', error);
          alert('An error occurred. Please try again later.');
        });
    }
  }
};
</script>

<style scoped>
.logout-button {
  margin-top: 20px;
}

.create-job-button {
  margin-right: 10px;
  margin-top: 20px;
}
</style>
