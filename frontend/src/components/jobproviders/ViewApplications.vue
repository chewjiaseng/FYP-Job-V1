<template>
  <!-- this is the comment: fluid class="pa-0" -->
  <v-container fluid class="pa-10">
    <h1 style="margin-bottom: 20px;">Applications for Your Jobs</h1>

    <!-- Loading Spinner -->
    <v-row v-if="loading" align="center" justify="center" class="pa-4">
          <v-progress-circular indeterminate color="blue" size="70"></v-progress-circular>
        </v-row>
    
    <!-- Search and Filters -->
    <v-row class="mb-4" align="center">
      <v-col cols="8" sm="5">
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

      <!-- Category Filter -->
  <v-col cols="3" sm="2">
    <v-menu v-model="categoryMenu" offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-bind="attrs"
          v-on="on"
          label="Filter by Category"
          readonly
          :value="selectedCategories.includes('All') ? 'All' : selectedCategories.join(', ')"
          outlined
        />
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
  </v-col>

  <!-- Date and Reset Buttons -->
  <v-col cols="auto" sm="auto" class="d-flex justify-start">
    <div class="d-flex flex-wrap align-center">
      <!-- Date Filter -->
      <v-menu v-model="dateMenu" offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="custom-date-btn" v-bind="attrs" v-on="on" style="min-width: 100px;">
            Date
          </v-btn>
        </template>
        <v-card>
          <v-list>
            <v-list-item>
              <v-checkbox v-model="showAllDates" label="Show All Dates" @click.stop />
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

    <v-data-table
      :headers="headers"
      :items="filteredApplications"
      item-key="application_id"
      class="elevation-1"
      dense
    >
      <template v-slot:item="{ item }">
        <tr>
          <td style="text-align: left;">{{ item.applicant_name }}</td>
          <td style="text-align: left;">{{ item.identification_card }}</td>
          <td style="text-align: left;">{{ item.seekeremail }}</td> <!-- Display seekeremail here -->

          <td style="text-align: left;">{{ item.gender }}</td>
          <td style="text-align: left;">{{ item.hp_number }}</td>
          <td style="text-align: left;">{{ new Date(item.applied_at).toLocaleDateString() }}</td>
          <td style="text-align: left;">{{ item.job_name }}</td>
          <td style="text-align: left;">{{ item.job_category }}</td>
          <td style="text-align: left;">{{ item.working_place }}</td>
          <td style="text-align: left;">
            {{ item.status }}
            <v-icon @click="editStatus(item)">mdi-pencil</v-icon>
          </td>
          <td>
            <!-- New Resume Status Column -->
            <v-chip
              :color="item.resume_pdf ? 'green' : 'red'"
              dark
              small
            >
              {{ item.resume_pdf ? 'Available' : 'Not Available' }}
            </v-chip>
          </td>
          <td>
            <v-btn @click="viewResume(item.resume_pdf)" color="primary" small>
              View Resume
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>

    <!-- Floating Action Button -->
    <v-btn
      fab
      color="blue"
      @click="goBack"
      class="back-button-fab"
    >
      <v-icon dark>mdi-arrow-left</v-icon>
    </v-btn>

      <!-- Dialog for no resume -->
      <v-dialog v-model="noResumeDialog" max-width="500">
        <v-card>
          <v-card-title class="text-h5">Resume Not Available</v-card-title>
          <v-card-text>The user did not provide any resume.</v-card-text>
          <v-card-actions>
            <v-btn color="primary" text @click="noResumeDialog = false">
              OK
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Dialog for editing status -->
      <v-dialog v-model="editStatusDialog" max-width="400">
        <v-card>
          <v-card-title>Edit Status</v-card-title>
          <v-card-text>
            <v-select
              v-model="selectedStatus"
              :items="['Pending', 'Received']"
              label="Select Status"
            ></v-select>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="updateStatus" :loading="loading" :disabled="loading">Save</v-btn>
            <v-btn text @click="editStatusDialog = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Snackbar for success message -->
      <v-snackbar v-model="successSnackbar" color="success" top>
        Update status successfully
        <v-btn color="white" text @click="successSnackbar = false">
          Close
        </v-btn>
      </v-snackbar>

      <!-- Snackbar for error message -->
      <v-snackbar v-model="errorSnackbar" color="error" top>
        Update status failed
        <v-btn color="white" text @click="errorSnackbar = false">
          Close
        </v-btn>
      </v-snackbar>

    </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ViewApplications',
  data() {
    return {
      loading: false,
      headers: [
        { text: 'Applicant Name', value: 'applicant_name' },
        { text: 'ID Card', value: 'identification_card' },
        { text: 'Email', value: 'seekeremail' },

        { text: 'Gender', value: 'gender' },
        { text: 'Phone Number', value: 'hp_number' },
        { text: 'Applied At', value: 'applied_at' },
        { text: 'Job Name', value: 'job_name' },
        { text: 'Job Category', value: 'job_category' },
        { text: 'Working Place', value: 'working_place' },
        { text: 'Status', value: 'status' ,width: '120px'},
        { text: 'Resume Status', value: 'resume_status', sortable: false }, // New Resume Status column
        { text: 'Actions', value: 'actions', sortable: false },


      ],
      searchQuery: "",
      selectedLocation: ["All"],
      locations: ['Johor', 'Selangor', 'Melaka', 'Kuala Lumpur', 'Pahang', 'Pulau Pinang', 'Kelantan', 'Kedah', 'Perlis', 'Perak','Terengganu','Negeri Sembilan','Sarawak','Sabah'], // Available locations
      locationMenu: false,
      selectedCategories: ["All"],
      categories: ['Education', 'Designer', 'Sales', 'Finance', 'Information Technology', 'Food & Beverage', 'Transportation','Marketing', 'Arts', 'Customer Service', 'Human Resources', 'Accountant'], // Available categories
      categoryMenu: false,
      dateMenu: false,
      showAllDates: true,
      selectedDate: null,

      applications: [],
      noResumeDialog: false, // For handling the dialog
      editStatusDialog: false,
      selectedStatus: '',
      currentApplication: null, // Store the current application to update
      successSnackbar: false, // Controls visibility of the success message
      errorSnackbar: false,   // Controls visibility of the error message
    };
  },
  computed: {
    filteredApplications() {
      return this.applications.filter((job) => {
        const matchesSearch = job.job_name.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesLocation = this.selectedLocation.includes("All") || this.selectedLocation.includes("All") || this.selectedLocation.some((location) => job.working_place.toLowerCase().includes(location.toLowerCase()));

        const matchesCategory = this.selectedCategories.includes("All") || this.selectedCategories.includes(job.job_category);
        let matchesDate = true;
        if (this.selectedDate) {
          // Convert the ISO string to a Date object for comparison
          const jobDate = new Date(job.applied_at).toISOString().split('T')[0]; // Convert job date to YYYY-MM-DD
          matchesDate = jobDate === this.selectedDate;
        } else if (!this.showAllDates) {
          matchesDate = false; // If "Show All Dates" is not selected, exclude jobs with no date
        }
        return matchesSearch && matchesLocation && matchesCategory && matchesDate;
      });
    },
  },
  mounted() {
    this.fetchApplications();
  },
  methods: {
    fetchApplications() {
      this.loading = true; // Set loading to true at the start
      const apiUrl = process.env.VUE_APP_API_URL;
      
      axios
        .get(`${apiUrl}/provider-applications`, {
          withCredentials: true,
        })
        .then((response) => {
          this.applications = response.data;
        })
        .catch((error) => {
          console.error('Error fetching applications:', error);
        })
        .finally(() => {
          this.loading = false; // Set loading to false once data is fetched
        });
    },
    goBack() {
      this.$router.push('/provider-home');
    },
    viewResume(resumePdf) {
      if (!resumePdf) {
        // If the resume is empty, show the dialog
        this.noResumeDialog = true;
        return;
      }

      // Convert the base64 string back to a Blob
      const byteCharacters = atob(resumePdf); // Decode base64
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      // Create a URL for the blob and open it
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    },
    editStatus(item) {
      this.currentApplication = item;
      this.selectedStatus = item.status;
      this.editStatusDialog = true;
    },
     updateStatus() {
      if (this.currentApplication) {
        const updatedStatus = this.selectedStatus;
        const applicationId = this.currentApplication.application_id;
        const apiUrl = process.env.VUE_APP_API_URL;
        this.loading = true;

        axios
          .put(`${apiUrl}/application/${applicationId}/status`, {
            status: updatedStatus,
          }, {
            withCredentials: true,
          })
          .then(() => {
            this.currentApplication.status = updatedStatus;
            this.editStatusDialog = false;
            this.successSnackbar = true; // Show success message
          })
          .catch((error) => {
            console.error('Error updating status:', error);
            this.errorSnackbar = true; // Show error message
          }).finally(() => {
          // Reset loading state after the process is completed
          this.loading = false;
        });
      }
    },

    filterJobs() {
      // Triggered on search input change
    },
    handleAllSelection() {
      if (this.selectedLocation.includes("All")) {
        this.selectedLocation = ["All"];
      }
    },
    handleLocationSelection() {
      this.selectedLocation = this.selectedLocation.filter((loc) => loc !== "All");
    },
    handleAllCategorySelection() {
      if (this.selectedCategories.includes("All")) {
        this.selectedCategories = ["All"];
      }
    },
    handleCategorySelection() {
      this.selectedCategories = this.selectedCategories.filter((cat) => cat !== "All");
    },
    
    resetFilters() {
      this.searchQuery = "";
      this.selectedLocation = ["All"];
      this.selectedCategories = ["All"];
      this.showAllDates = true;
      this.selectedDate = null;
    },
    handleDateChange(date) {
    if (date) {
      this.selectedDate = date; // Set selected date
      this.showAllDates = false; // Uncheck "Show All Dates" when a specific date is selected
      this.dateMenu = false; // Close the menu if you want (optional)
    } else {
      this.selectedDate = null;  // Reset the date if cleared
    }
    },
    handleShowAllDatesChange() {
      if (this.showAllDates) {
        this.selectedDate = null; // Reset selectedDate if "Show All Dates" is checked.
      }
      // Prevent the menu from closing when toggling the "Show All Dates" checkbox
    this.dateMenu = true;
    },
  },
};
</script>

<style scoped>
.back-button-fab {
  position: fixed; /* Fixed position */
  bottom: 20px; /* Distance from the bottom */
  left: 20px; /* Move to the left side */
  z-index: 1000; /* Ensure it appears above other elements */
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