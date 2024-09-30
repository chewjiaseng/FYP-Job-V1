<template>
  <v-container class="custom-container khaki-background">
    <v-card class="pa-4 mb-6 khaki-card">
      <h1 class="text-h4 mb-4">Welcome, {{ username }} (ID: {{ userId }})</h1>

      <!-- Action Buttons -->
      <div class="action-buttons mb-4">
        <v-btn @click="goToCreateJob" class="create-job-button" color="primary" elevation="2" rounded>
          <v-icon left>mdi-plus</v-icon>Create New Job
        </v-btn>
        <v-btn @click="goToViewApplications" class="view-applications-button" color="blue darken-2" elevation="2" rounded>
          <v-icon left>mdi-file-document</v-icon>View Applications
        </v-btn>
      </div>

      <!-- Jobs Table -->
      <v-data-table
        :headers="headers"
        :items="jobs"
        item-key="id"
        class="elevation-1 full-width-table khaki-card"
        dense
      >
        <template v-slot:item="{ item }">
          <tr>
            <td>{{ item.job_name }}</td>
            <td>{{ item.job_category }}</td>
            <td>{{ item.salary }}</td>
            <td>{{ item.working_place }}</td>
            <td>{{ item.working_hours }}</td>
            <td>{{ item.job_description }}</td>
            <td>{{ new Date(item.created_at).toLocaleDateString() }}</td>
            <td>
              <!-- Edit Icon Button -->
              <v-btn icon small @click="openEditDialog(item)" color="primary">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <!-- Delete Icon Button -->
              <v-btn icon small @click="confirmDelete(item.id)" color="red">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>

    <!-- Logout Button -->
    <v-btn
      @click="logout"
      class="logout-button custom-logout-button"
      color="red darken-2"
      text
      :loading="loading" :disabled="loading"
      rounded
      elevation="2"
      style="color: white !important;"
    >
      <v-icon left>mdi-logout</v-icon>Logout
    </v-btn>

    <!-- Edit Job Dialog -->
    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h6">Edit Job</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field v-model="editedJob.job_name" label="Job Name" outlined></v-text-field>
            <v-text-field v-model="editedJob.job_category" label="Job Category" outlined></v-text-field>
            <v-text-field v-model="editedJob.salary" label="Salary" outlined></v-text-field>
            <v-text-field v-model="editedJob.working_place" label="Working Place" outlined></v-text-field>
            <v-text-field v-model="editedJob.working_hours" label="Working Hours" outlined></v-text-field>
            <v-textarea v-model="editedJob.job_description" label="Job Description" rows="2" outlined></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="success" @click="updateJob" :loading="loading" :disabled="loading" rounded>
            <v-icon left>mdi-content-save</v-icon>Save
          </v-btn>
          <v-btn @click="editDialog = false" rounded>Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for notifications -->
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
  name: "ProviderHome",
  data() {
    return {
      loading: false,
      username: "",
      userId: "",
      jobs: [],
      headers: [
        { text: "Job Name", value: "job_name", width: "150px" },
        { text: "Category", value: "job_category", width: "150px" },
        { text: "Salary", value: "salary", width: "120px" },
        { text: "Place", value: "working_place", width: "200px" },
        { text: "Hours", value: "working_hours", width: "150px" },
        { text: "Description", value: "job_description", width: "250px" },
        { text: "Created At", value: "created_at", width: "150px" },
        { text: "Actions", value: "actions", sortable: false, width: "150px" }
      ],
      editDialog: false,
      editedJob: {},
      snackbar: false,
      snackbarText: "",
      snackbarColor: "",
    };
  },
  mounted() {
    this.getUserInfo();
    this.getProviderJobs();
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
        })
        .catch((error) => {
          console.error("Error fetching user info:", error);
        });
    },
    getProviderJobs() {
      const apiUrl = process.env.VUE_APP_API_URL;
      axios
        .get(`${apiUrl}/provider-jobs`, { withCredentials: true })
        .then((response) => {
          this.jobs = response.data;
        })
        .catch((error) => {
          console.error("Error fetching provider jobs:", error);
        });
    },
    openEditDialog(job) {
      this.editedJob = { ...job };
      this.editDialog = true;
    },
    updateJob() {
      const apiUrl = process.env.VUE_APP_API_URL;
      this.loading = true;
      axios
        .put(
          `${apiUrl}/update-job/${this.editedJob.id}`,
          this.editedJob,
          { withCredentials: true }
        )
        .then((response) => {
          const index = this.jobs.findIndex((job) => job.id === this.editedJob.id);
          if (index !== -1) {
            this.jobs[index] = { ...this.editedJob };
          }
          this.editDialog = false;
          this.snackbarText = "Update successfully";
          this.snackbarColor = "green";
          this.snackbar = true;
          this.getProviderJobs(); // Reload the data to get the latest
        })
        .catch((error) => {
          console.error("Error updating job:", error);
          this.snackbarText = "Update failed";
          this.snackbarColor = "red";
          this.snackbar = true;
        }).finally(() => {
        // Reset loading state after the process is completed
        this.loading = false;
      });
    },
    confirmDelete(jobId) {
      if (confirm("Do you want to delete this job?")) {
        this.deleteJob(jobId);
      }
    },
    deleteJob(jobId) {
      const apiUrl = process.env.VUE_APP_API_URL;
      axios
        .delete(`${apiUrl}/delete-job/${jobId}`, { withCredentials: true })
        .then((response) => {
          this.jobs = this.jobs.filter((job) => job.id !== jobId);
          this.snackbarText = "Delete successfully";
          this.snackbarColor = "green";
          this.snackbar = true;
          this.getProviderJobs(); // Reload the data to get the latest
        })
        .catch((error) => {
          console.error("Error deleting job:", error);
          this.snackbarText = "Delete failed";
          this.snackbarColor = "red";
          this.snackbar = true;
        });
    },
    goToCreateJob() {
      this.$router.push("/create-job");
    },
    goToViewApplications() {
      this.$router.push("/view-applications"); // This will redirect to the new page
    },
    logout() {
      const apiUrl = process.env.VUE_APP_API_URL;
      this.loading = true;
      axios
        .get(`${apiUrl}/logout`, { withCredentials: true })
        .then((response) => {
          if (response.data.message) {
            localStorage.removeItem("isAuthenticated");
            localStorage.removeItem("userRole");
            sessionStorage.removeItem("userId");
            sessionStorage.removeItem("username");
            this.$router.push("/login");
          }
        })
        .catch((error) => {
          console.error("Error during logout:", error);
          alert("An error occurred. Please try again later.");
        }).finally(() => {
      // Reset loading state after the process is completed
      this.loading = false;
    });
    },
  },
};
</script>

<style scoped>
html, body, #app{
  margin: 0;
  padding: 0;
  height: 100%; /* Ensure body takes full height */
}


.custom-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  background-color: #f0e68c; /* Soft khaki color */
  min-height: 100vh; /* Ensure container takes full viewport height */
  box-sizing: border-box; /* Ensure padding is included in height calculation */
}

.v-container {
  margin: 0 !important;
  padding: 0 !important;
}

.khaki-background {
  background-color: #f0e68c; /* Apply khaki background */
}

/*This is the container color */
.khaki-card {
  background-color: rgba(255, 249, 230, 0.85); /* Semi-transparent khaki */
  box-shadow: none;
}

/*This is the table color*/
.full-width-table {
  background-color: #f8f8f8 !important; /* Light grey */
  border-radius: 8px;
  text-align: left; /* Ensures content is aligned to the left */
}

.full-width-table td,
.full-width-table th {
  padding: 10px;
  font-size: 0.95em;
}

.logout-button {
  margin-top: 20px;
  margin-bottom: 40px;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
}

.custom-snackbar {
  display: flex !important;
  justify-content: center !important;
}

.snackbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  width: 100%;
  max-width: 300px;
}

.v-btn {
  transition: all 0.3s ease;
}

.v-btn:hover {
  filter: brightness(1.1);
}

.v-application--wrap {
  padding: 0 !important;  /* Remove any padding applied by Vuetify */
  margin: 0 !important;
}

.custom-logout-button {
  background-color: #ff6b6b; /* Custom logout button color */
  color: white !important; /* Text color */
}

.custom-logout-button:hover {
  background-color: #ff4c4c; /* Darker color on hover */
}


</style>
