<template>
  <v-app>
    <v-container class="custom-container">
      <h1>Welcome, {{ username }} (ID: {{ userId }})</h1>

      <!-- Create New Job Button -->
      <!-- <v-btn @click="goToCreateJob" class="create-job-button" color="green">
        Create New Job
      </v-btn> -->

      <!-- Create New Job Button and View Applications Button -->
      <div class="action-buttons">
        <v-btn @click="goToCreateJob" class="create-job-button" color="green">
          Create New Job
        </v-btn>
        <v-btn @click="goToViewApplications" class="view-applications-button" color="blue">
          View Applications
        </v-btn>
      </div>

      <!-- Logout Button -->
      <v-btn
        @click="logout"
        class="logout-button"
        color="red"
        text-color="white !important;"
      >
        Logout
      </v-btn>

      <!-- Jobs Table -->
      <v-data-table
        :headers="headers"
        :items="jobs"
        item-key="id"
        class="elevation-1 full-width-table"
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
              <v-btn icon small @click="openEditDialog(item)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <!-- Delete Icon Button -->
              <v-btn icon small @click="confirmDelete(item.id)">
                <v-icon color="red">mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>

      <!-- Edit Job Dialog -->
      <v-dialog v-model="editDialog" max-width="500px">
        <v-card>
          <v-card-title>Edit Job</v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field v-model="editedJob.job_name" label="Job Name"></v-text-field>
              <v-text-field v-model="editedJob.job_category" label="Job Category"></v-text-field>
              <v-text-field v-model="editedJob.salary" label="Salary"></v-text-field>
              <v-text-field v-model="editedJob.working_place" label="Working Place"></v-text-field>
              <v-text-field v-model="editedJob.working_hours" label="Working Hours"></v-text-field>
              <v-textarea v-model="editedJob.job_description" label="Job Description" rows="2"></v-textarea>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="green" @click="updateJob">Save</v-btn>
            <v-btn @click="editDialog = false">Cancel</v-btn>
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
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  name: "ProviderHome",
  data() {
    return {
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
      axios
        .get("http://localhost:5000/user-info", { withCredentials: true })
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
      axios
        .get("http://localhost:5000/provider-jobs", { withCredentials: true })
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
      axios
        .put(
          `http://localhost:5000/update-job/${this.editedJob.id}`,
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
        });
    },
    confirmDelete(jobId) {
      if (confirm("Do you want to delete this job?")) {
        this.deleteJob(jobId);
      }
    },
    deleteJob(jobId) {
      axios
        .delete(`http://localhost:5000/delete-job/${jobId}`, { withCredentials: true })
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
      axios
        .get("http://localhost:5000/logout", { withCredentials: true })
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
        });
    },
  },
};
</script>

<style scoped>
.custom-container {
  max-width: 100%; /* Ensure the container width remains full */
  margin: 0 auto; /* Center the container on the page */
}

.full-width-table {
  width: 100%; /* Keep the table width 100% to fill the container */
  transform: scale(0.9); /* Scale down the table to 90% of its original size */
  transform-origin: center; /* Scale the table from the center */
}

.full-width-table td,
.full-width-table th {
  padding: 8px; /* Adjust padding if needed to reduce size further */
  font-size: 0.9em; /* Slightly reduce font size */
}

.logout-button {
  margin-top: 20px;
  background-color: red !important;
  color: white !important; /* Ensure text color is visible */
}

.create-job-button {
  margin-right: 10px;
  margin-top: 20px;
}

.custom-snackbar {
  padding: 0 !important;
  display: flex !important;
  justify-content: center !important;
}

.view-applications-button {
  /* position: absolute; */
  top: 10px;
  left: 10px;
  background-color: blue !important;
  color: white !important;
}

/* Flexbox to control content inside snackbar */
.snackbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  width: 100%;
  max-width: 300px; /* Set the desired width */
}
</style>
