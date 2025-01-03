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

       <!-- Search Box and Location Filter -->
      <v-row class="mb-4" align="center">
        <v-col cols="8" sm="6">
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
                    <v-checkbox v-model="showAllDates" label="Show All Dates"  @click.stop/>
                  </v-list-item>
                  <v-list-item>
                    <v-date-picker v-model="selectedDate" @input="showAllDates = false"></v-date-picker>
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

      <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>

      <!-- Jobs Table -->
      <v-data-table
        :headers="headers"
        :items="filteredJobs"
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
            <td>{{ item.phone_num }}</td>  <!-- New phone_num field -->
            <td>{{ new Date(item.created_at).toLocaleDateString('en-GB', { timeZone: 'UTC' }) }}</td>
            <!-- <td>{{ new Date(item.created_at).toLocaleDateString('en-GB', { timeZone: 'Asia/Kuala_Lumpur' }) }}</td> -->

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
      :loading="logoutLoading" :disabled="logoutLoading"
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
            <v-text-field v-model="editedJob.phone_num" label="Phone Number" outlined></v-text-field>  <!-- New phone_num field -->
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
      logoutLoading: false,
      username: "",
      userId: "",
      jobs: [],
      searchQuery: "", // New property for search input
      selectedLocation: ['All'], // Selected location for filtering
      locations: ['Johor', 'Selangor', 'Melaka', 'Kuala Lumpur', 'Pahang', 'Pulau Pinang', 'Kelantan', 'Kedah', 'Perlis', 'Perak','Terengganu','Negeri Sembilan','Sarawak','Sabah'], // Available locations
      locationMenu: false, // State for location dropdown menu
      selectedCategories: ['All'], // Selected categories for filtering
      categories: ['Education', 'Designer', 'Sales', 'Finance', 'Information Technology', 'Food & Beverage', 'Transportation','Marketing', 'Arts', 'Customer Service', 'Human Resources', 'Accountant'], // Available categories
      categoryMenu: false,
      dateMenu: false, // State for date dropdown menu
      showAllDates: true, // New property to check if all dates are shown
      selectedDate: null, // Selected date from date picker
      headers: [
        { text: "Job Name", value: "job_name", width: "150px" },
        { text: "Category", value: "job_category", width: "150px" },
        { text: "Salary", value: "salary", width: "120px" },
        { text: "Place", value: "working_place", width: "200px" },
        { text: "Hours", value: "working_hours", width: "150px" },
        { text: "Description", value: "job_description", width: "250px" },
        { text: "Phone Number", value: "phone_num", width: "150px" },  // New phone_num column
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
  computed: {
    // Computed property to filter jobs based on the search query
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
  },
  mounted() {
    this.getUserInfo();
    this.getProviderJobs();
  },
  methods: {
    filterJobs() {
    // Optionally trigger reactivity or perform any required filtering setup here.
    // Since `filteredJobs` is computed, it will automatically react to changes.
  },
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
    resetFilters() {
        // Reset all filters to their default state
        this.searchQuery = "";
        this.selectedLocation = ['All'];
        this.selectedCategories = ['All'];
        this.showAllDates = true;
        this.selectedDate = null;
        this.filterJobs(); // Call the filtering method to refresh the job list
      },
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
    this.loading = true; // Start loading
    axios
      .get(`${apiUrl}/provider-jobs`, { withCredentials: true })
      .then((response) => {
        this.jobs = response.data;
      })
      .catch((error) => {
        console.error("Error fetching provider jobs:", error);
      })
      .finally(() => {
        this.loading = false; // Stop loading
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
      this.logoutLoading = true;
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
      this.logoutLoading = false;
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
