<template>
  <v-container fluid class="manage-user-container" style="padding-top: 0px; margin:0;">
    <!-- Search Box and Location Filter -->
    <div style="margin-top: 20px; padding: 0;">
    <v-row class="search-row no-vertical-spacing" align="center" >
        <v-col cols="8" sm="6" style="padding: 0;">
          <v-text-field
            v-model="searchQuery"
            label="Search Job Name"
            outlined
            @input="filterJobs"
          >
            <template v-slot:append>
              <v-btn v-if="searchQuery" icon @click="searchQuery = ''">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-col>

        <v-col cols="3" sm="3">
          <v-menu v-model="locationMenu" offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-bind="attrs"
                v-on="on"
                label="Filter by Location"
                readonly
                :value="selectedLocation.includes('All') ? 'All' : selectedLocation.join(', ')"
                outlined
              />
            </template>
            <v-card style="max-height: 300px; overflow-y: auto;">
              <v-list>
                <v-list-item>
                  <v-checkbox
                    v-model="selectedLocation"
                    :value="'All'"
                    label="All"
                    @change="handleAllSelection"
                    @click.stop
                  />
                </v-list-item>
                <v-list-item v-for="location in locations" :key="location">
                  <v-checkbox
                    v-model="selectedLocation"
                    :value="location"
                    :label="location"
                    @change="handleLocationSelection"
                    @click.stop
                  />
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </v-col>

        <!-- Button Container for Category and Date Filters -->
        <v-col cols="4" sm="3" class="d-flex justify-start" style="margin-top: -30px;">
          <div class="d-flex flex-wrap align-center" style="flex-grow: 1;">
            <!-- Category Filter -->
            <v-menu v-model="categoryMenu" offset-y class="flex-grow-1">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="custom-category-btn" v-bind="attrs" v-on="on" style="min-width: 100px; margin-right: 10px;">
                  Category
                </v-btn>
              </template>
              <v-card style="max-height: 300px; overflow-y: auto;">
                <v-list>
                  <v-list-item>
                    <v-checkbox
                      v-model="selectedCategories"
                      :value="'All'"
                      label="All"
                      @change="handleAllCategorySelection"
                      @click.stop
                    />
                  </v-list-item>
                  <v-list-item v-for="category in categories" :key="category">
                    <v-checkbox
                      v-model="selectedCategories"
                      :value="category"
                      :label="category"
                      @change="handleCategorySelection"
                      @click.stop
                    />
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>

            <!-- Date Filter -->
            <v-menu v-model="dateMenu" offset-y class="flex-grow-1">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="custom-date-btn" v-bind="attrs" v-on="on" style="min-width: 100px;">
                  Date
                </v-btn>
              </template>
              <v-card>
                <v-list>
                  <v-list-item>
                    <v-checkbox v-model="showAllDates" label="Show All Dates" @change="filterByDate" @click.stop/>
                  </v-list-item>
                  <v-list-item>
                    <v-date-picker v-model="selectedDate" @input="filterByDate"></v-date-picker>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
            <!-- Reset Button -->
            <v-btn
              small
              @click="resetFilters"
              color="grey lighten-2"
              style="margin-left: 10px;"
            >
              Reset
            </v-btn>
          </div>
        </v-col>
      </v-row>
      </div>

    <v-simple-table class="aligned-table">
      <thead>
        <tr>
          <th @click="sortTable('job_name')" style="color: white;">Job Name
            <v-icon>{{ sortBy === 'job_name' && sortDesc ? 'mdi-arrow-down' : 'mdi-arrow-up' }}</v-icon>
          </th>
          <th @click="sortTable('job_category')" style="color: white;">Category
            <v-icon>{{ sortBy === 'job_category' && sortDesc ? 'mdi-arrow-down' : 'mdi-arrow-up' }}</v-icon>
          </th>
          <th @click="sortTable('salary')" style="color: white;">Salary
            <v-icon>{{ sortBy === 'salary' && sortDesc ? 'mdi-arrow-down' : 'mdi-arrow-up' }}</v-icon>
          </th>
          <th @click="sortTable('working_place')" style="color: white;">Working Place
            <v-icon>{{ sortBy === 'working_place' && sortDesc ? 'mdi-arrow-down' : 'mdi-arrow-up' }}</v-icon>
          </th>
          <th @click="sortTable('working_hours')" style="color: white;">Working Hours
            <v-icon>{{ sortBy === 'working_hours' && sortDesc ? 'mdi-arrow-down' : 'mdi-arrow-up' }}</v-icon>
          </th>
          <th @click="sortTable('created_at')" style="color: white;">Created At
            <v-icon>{{ sortBy === 'created_at' && sortDesc ? 'mdi-arrow-down' : 'mdi-arrow-up' }}</v-icon>
          </th>
          <th style="color: white;">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="job in filteredJobs" :key="job.id">
          <td>{{ job.job_name }}</td>
          <td>{{ job.job_category }}</td>
          <td>{{ job.salary }}</td>
          <td>{{ job.working_place }}</td>
          <td>{{ job.working_hours }}</td>
          <td>{{ new Date(job.created_at).toLocaleDateString() }}</td>
          <td>
            <v-btn icon small @click="openEditDialog(job)">
              <v-icon color="blue">mdi-pencil</v-icon>
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
      <v-btn color="blue" @click="goBack">Back</v-btn>
      <v-btn icon @click="openCreateJobDialog">
        <v-icon color="green">mdi-plus-circle</v-icon>
      </v-btn>
    </v-row>

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

        searchQuery: "", // New property for search input
      selectedLocation: ['All'], // Selected location for filtering
      locations: ['Johor', 'Selangor', 'Melaka', 'Kuala Lumpur', 'Pahang', 'Pulau Pinang', 'Kelantan', 'Kedah', 'Perlis', 'Perak','Terengganu','Negeri Sembilan','Sarawak','Sabah'], // Available locations
      locationMenu: false, // State for location dropdown menu
      selectedCategories: ['All'], // Selected categories for filtering
      categories: ['Education', 'Designer', 'Sales', 'Finance', 'Information Technology', 'Food & Beverage','Transportation', 'Marketing', 'Arts', 'Customer Service', 'Human Resources', 'Accountant'], // Available categories
      categoryMenu: false,
      dateMenu: false, // State for date dropdown menu
      showAllDates: true, // New property to check if all dates are shown
      selectedDate: null, // Selected date from date picker
      
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
      filteredJobs() {
      let filtered = this.jobs;

      // Filter by search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(job => job.job_name.toLowerCase().includes(query));
      }

      // Filter by selected locations
      if (!this.selectedLocation.includes('All')) {
        filtered = filtered.filter(job =>
          this.selectedLocation.some(location =>
            job.working_place.toLowerCase().includes(location.toLowerCase())
          )
        );
      }

      // Filter by selected categories
      if (!this.selectedCategories.includes('All')) {
        filtered = filtered.filter(job =>
          this.selectedCategories.some(category => job.job_category === category)
        );
      }

      // Filter by selected date
      if (this.selectedDate && !this.showAllDates) {
        const selectedDate = new Date(this.selectedDate).toISOString().split('T')[0]; // Format to YYYY-MM-DD
        filtered = filtered.filter(job => {
          const jobDate = new Date(job.created_at).toISOString().split('T')[0]; // Format to YYYY-MM-DD
          return jobDate === selectedDate; // Compare dates
        });
      }

      return filtered; // Return the filtered jobs
    },
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
      handleAllSelection(isChecked) {
      if (isChecked) {
        // If 'All' is checked, clear other selections
        this.selectedLocation = ['All'];
      } else {
        // If 'All' is unchecked, remove it from selectedLocation
        const index = this.selectedLocation.indexOf('All');
        if (index > -1) {
          this.selectedLocation.splice(index, 1);
        }
      }
      this.locationMenu = true; // Keep dropdown open
      this.filterLocation(); // Re-filter jobs based on updated selection
    },

    handleLocationSelection() {
      // Check if any location is selected
      if (this.selectedLocation.length > 1 && this.selectedLocation.includes('All')) {
        // If 'All' is selected along with other locations, remove 'All'
        const index = this.selectedLocation.indexOf('All');
        if (index > -1) {
          this.selectedLocation.splice(index, 1); // Deselect 'All'
        }
      }

      this.locationMenu = true; // Keep dropdown open
      this.filterLocation(); // Re-filter jobs based on updated selection
    },
    filterLocation() {
      if (this.selectedLocation.includes('All')) {
        this.filteredJobs = this.jobs; // Show all jobs if 'All' is selected
      } else {
        this.filteredJobs = this.jobs.filter(job =>
          this.selectedLocation.some(location =>
            job.working_place.toLowerCase().includes(location.toLowerCase())
          )
        );
      }
    },
    handleAllCategorySelection(isChecked) {
      if (isChecked) {
        this.selectedCategories = ['All'];
      } else {
        const index = this.selectedCategories.indexOf('All');
        if (index > -1) {
          this.selectedCategories.splice(index, 1);
        }
      }
    },
    handleCategorySelection() {
      if (this.selectedCategories.length > 1 && this.selectedCategories.includes('All')) {
        const index = this.selectedCategories.indexOf('All');
        if (index > -1) {
          this.selectedCategories.splice(index, 1);
        }
      }
    },
    filterByDate() {
      // Check if 'Show All Dates' is selected
      if (this.showAllDates) {
        // If all dates are to be shown, no filtering needed
        this.filteredJobs = this.jobs; // Reset to all jobs
        return;
      }

      // If a specific date is selected
      if (this.selectedDate) {
        // Format the selected date to YYYY-MM-DD
        const selectedDate = new Date(this.selectedDate).toISOString().split('T')[0];

        // Filter the jobs based on the selected date
        this.filteredJobs = this.jobs.filter(job => {
          const jobDate = new Date(job.created_at).toISOString().split('T')[0]; // Get job creation date in the same format
          return jobDate === selectedDate; // Compare dates
        });
      } else {
        // If no specific date is selected, reset the filtered jobs to all jobs
        this.filteredJobs = this.jobs;
      }
    },
    resetFilters() {
        // Reset all filters to their default state
        this.searchQuery = "";
        this.selectedLocation = ['All'];
        this.selectedCategories = ['All'];
        this.showAllDates = true;
        this.selectedDate = null;
        this.filterJobs(); // Call the filtering method to refresh the job list
      },
      fetchJobs() {
        const apiUrl = process.env.VUE_APP_API_URL;
        axios.get(`${apiUrl}/getjobs`, { withCredentials: true })
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
.manage-user-container {
  background-color: #f4f6f8; /* Light gray background */
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-height: 100vh; /* Ensures the container covers the full screen height */
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Keeps the buttons at the bottom */
  margin: 0; /* Ensures no outer margin */
}

.aligned-table {
  margin-top: 10px;
  
}

.aligned-table th {
  cursor: pointer;
  background-color: #1976d2; /* Blue header background */
  color: white;
}

.aligned-table th,
.aligned-table td {
  text-align: left;
  padding: 10px;
}

.button-row {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 10px 20px; /* Adjust padding as needed */
  margin-top: auto; /* Pushes the button row to the bottom */
}

.v-btn {
  transition: background-color 0.3s;
}

.v-btn:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.v-container {
  padding: 0; /* Remove padding */
  margin: 0; /* Remove margin */
}
.custom-category-btn {
  background: linear-gradient(45deg, #ff4081, #ff80ab); /* Fancy gradient color */
  color: white !important;
  border-radius: 8px;
  }

.custom-date-btn {
  background: linear-gradient(45deg, #ffd82c, #ffdf80); /* Fancy gradient color */
  color: white !important;
  border-radius: 8px;
  }
</style>
