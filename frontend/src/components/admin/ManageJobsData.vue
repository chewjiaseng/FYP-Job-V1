<template>
    <v-container>
  
      <!-- Jobs Table with Sorting -->
      <v-simple-table class="aligned-table">
        <thead>
      <tr>
        <th @click="sortTable('job_name')">Job Name
          <v-icon>{{ sortBy === 'job_name' && sortDesc ? 'mdi-arrow-down' : 'mdi-arrow-up' }}</v-icon>
        </th>
        <th @click="sortTable('job_category')">Category
          <v-icon>{{ sortBy === 'job_category' && sortDesc ? 'mdi-arrow-down' : 'mdi-arrow-up' }}</v-icon>
        </th>
        <th @click="sortTable('salary')">Salary
          <v-icon>{{ sortBy === 'salary' && sortDesc ? 'mdi-arrow-down' : 'mdi-arrow-up' }}</v-icon>
        </th>
        <th @click="sortTable('working_place')">Working Place
          <v-icon>{{ sortBy === 'working_place' && sortDesc ? 'mdi-arrow-down' : 'mdi-arrow-up' }}</v-icon>
        </th>
        <th @click="sortTable('working_hours')">Working Hours
          <v-icon>{{ sortBy === 'working_hours' && sortDesc ? 'mdi-arrow-down' : 'mdi-arrow-up' }}</v-icon>
        </th>
        <th @click="sortTable('created_at')">Created At
          <v-icon>{{ sortBy === 'created_at' && sortDesc ? 'mdi-arrow-down' : 'mdi-arrow-up' }}</v-icon>
        </th>
        <th>Actions</th>
      </tr>
    </thead>
        <tbody>
          <tr v-for="job in sortedJobs" :key="job.id">
            <td>{{ job.job_name }}</td>
            <td>{{ job.job_category }}</td>
            <td>{{ job.salary }}</td>
            <td>{{ job.working_place }}</td>
            <td>{{ job.working_hours }}</td>
            <td>{{ new Date(job.created_at).toLocaleDateString() }}</td>
            <td>
              <v-btn icon small @click="openEditDialog(job)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small @click="confirmDelete(job.id)">
                <v-icon color="red">mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
  
      <!-- Edit Job Dialog -->
      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-title>Edit Job</v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field v-model="editJobData.job_name" label="Job Name"></v-text-field>
              <v-text-field v-model="editJobData.job_category" label="Category"></v-text-field>
              <v-text-field v-model="editJobData.salary" label="Salary"></v-text-field>
              <v-text-field v-model="editJobData.working_place" label="Working Place"></v-text-field>
              <v-text-field v-model="editJobData.working_hours" label="Working Hours"></v-text-field>
              <v-textarea v-model="editJobData.job_description" label="Job Description"></v-textarea>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="updateJob" :loading="loading" :disabled="loading">Update</v-btn>
            <v-btn @click="dialog = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- Create Job Dialog -->
      <v-dialog v-model="createDialog" max-width="600px">
        <v-card>
          <v-card-title>Create Job</v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field v-model="newJob.job_name" label="Job Name"></v-text-field>
              <v-text-field v-model="newJob.job_category" label="Category"></v-text-field>
              <v-text-field v-model="newJob.salary" label="Salary"></v-text-field>
              <v-text-field v-model="newJob.working_place" label="Working Place"></v-text-field>
              <v-text-field v-model="newJob.working_hours" label="Working Hours"></v-text-field>
              <v-textarea v-model="newJob.job_description" label="Job Description"></v-textarea>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="createJob" :loading="loading" :disabled="loading">Create</v-btn>
            <v-btn @click="createDialog = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- Delete Confirmation Dialog -->
      <v-dialog v-model="deleteDialog" max-width="400px">
        <v-card>
          <v-card-title>Confirm Delete</v-card-title>
          <v-card-text>Are you sure you want to delete this job?</v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="deleteJob" :loading="loading" :disabled="loading">Yes</v-btn>
            <v-btn @click="deleteDialog = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Back and Create Job Button -->
      <v-row justify="space-between" class="button-row">
        <v-btn color="primary" @click="goBack">Back</v-btn>
        <v-btn icon @click="openCreateJobDialog">
          <v-icon>mdi-plus-circle</v-icon>
        </v-btn>
      </v-row>
  
      <!-- Snackbar for Notifications -->
      <v-snackbar v-model="snackbar" :color="snackbarType">
        {{ snackbarText }}
        <v-btn text @click="snackbar = false">Close</v-btn>
      </v-snackbar>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        jobs: [],
        sortBy: 'job_name', // default sorting by job name
        sortDesc: false, // default ascending
        dialog: false,
        createDialog: false,
        deleteDialog: false,
        loading: false,
        editJobData: {},
        newJob: {
          job_name: '',
          job_category: '',
          salary: '',
          working_place: '',
          working_hours: '',
          job_description: ''
        },
        deleteJobId: null,
        snackbar: false,
        snackbarText: '',
        snackbarType: ''
      };
    },
    mounted() {
      this.fetchJobs();
      
    },
    computed: {
      sortedJobs() {
        return this.jobs.slice().sort((a, b) => {
          let modifier = this.sortDesc ? -1 : 1;
          if (a[this.sortBy] < b[this.sortBy]) return -1 * modifier;
          if (a[this.sortBy] > b[this.sortBy]) return 1 * modifier;
          return 0;
        });
      },
    },
    methods: {
      fetchJobs() {
        const apiUrl = process.env.VUE_APP_API_URL;
        axios.get(`${apiUrl}/jobs`, { withCredentials: true })
          .then(response => {
            this.jobs = response.data;
          })
          .catch(error => {
            console.error('Error fetching jobs:', error);
          });
      },
      sortTable(field) {
        if (this.sortBy === field) {
          this.sortDesc = !this.sortDesc;
        } else {
          this.sortBy = field;
          this.sortDesc = false;
        }
      },
      openEditDialog(job) {
        this.editJobData = { ...job };
        this.dialog = true;
      },
      openCreateJobDialog() {
        this.createDialog = true;
      },
      updateJob() {
  this.loading = true;
  const apiUrl = process.env.VUE_APP_API_URL;
  console.log("Updating job with data:", this.editJobData); // Debugging

  axios.put(`${apiUrl}/update-job/${this.editJobData.id}`, this.editJobData, { withCredentials: true })
    .then(() => {
      this.snackbarText = 'Job updated successfully!';
      this.snackbarType = 'success';
      this.snackbar = true;
      this.dialog = false;
      this.fetchJobs();
    })
    .catch(error => {
      this.snackbarText = 'Failed to update job.';
      this.snackbarType = 'error';
      this.snackbar = true;
      console.error('Error updating job:', error);
    })
    .finally(() => {
      this.loading = false;
    });
},
      createJob() {
  this.loading = true;

  // Check if any required fields are empty
  if (!this.newJob.job_name || !this.newJob.job_category || !this.newJob.salary || 
      !this.newJob.working_place || !this.newJob.working_hours || !this.newJob.job_description) {
    this.loading = false; // Reset loading state
    alert('Please fill in the information!'); // Display alert
    return; // Prevent further execution
  }

  const apiUrl = process.env.VUE_APP_API_URL;
  axios.post(`${apiUrl}/create-job`, this.newJob, { withCredentials: true })
    .then(() => {
      this.snackbarText = 'Job created successfully!';
      this.snackbarType = 'success';
      this.snackbar = true;
      this.createDialog = false;
      this.fetchJobs();
    })
    .catch(error => {
      this.snackbarText = 'Failed to create job.';
      this.snackbarType = 'error';
      this.snackbar = true;
      console.error('Error creating job:', error);
    })
    .finally(() => {
      this.loading = false;
    });
},
      confirmDelete(jobId) {
        this.deleteJobId = jobId;
        this.deleteDialog = true;
      },
      deleteJob() {
  this.loading = true;
  const apiUrl = process.env.VUE_APP_API_URL;
  console.log("Deleting job with ID:", this.deleteJobId); // Debugging

  axios.delete(`${apiUrl}/delete-job/${this.deleteJobId}`, { withCredentials: true })
    .then(() => {
      this.snackbarText = 'Job deleted successfully!';
      this.snackbarType = 'success';
      this.snackbar = true;
      this.deleteDialog = false;
      this.fetchJobs();
    })
    .catch(error => {
      this.snackbarText = 'Failed to delete job.';
      this.snackbarType = 'error';
      this.snackbar = true;
      console.error('Error deleting job:', error);
    })
    .finally(() => {
      this.loading = false;
    });
},
      goBack() {
        this.$router.go(-1);
      }
    }
  };
  </script>
  
  <style scoped>
  .aligned-table th {
    cursor: pointer;
  }
  
  .button-row {
    margin-top: 20px;
  }

  .aligned-table th,
.aligned-table td {
  text-align: left;
}


  </style>
  