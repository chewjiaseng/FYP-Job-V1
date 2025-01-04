<template>
  <v-container fluid>
    <h1>All Application</h1>

  <!-- Loading Indicator -->
  <v-progress-circular v-if="loading" indeterminate color="primary" class="ma-2"
  ></v-progress-circular>

  <!-- Search and Filters -->
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

      <v-col cols="4" sm="3" class="d-flex justify-start" style="margin-top: -30px;">
        <div class="d-flex flex-wrap align-center" style="flex-grow: 1;">
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

          <v-menu v-model="dateMenu" offset-y class="flex-grow-1">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="custom-date-btn" v-bind="attrs" v-on="on" style="min-width: 100px;">
                Date
              </v-btn>
            </template>
            <v-card>
              <v-list>
                <v-list-item>
                  <v-checkbox v-model="showAllDates" label="Show All Dates" @change="handleShowAllDatesChange" @click.stop />
                </v-list-item>
                <v-list-item>
                  <!-- v-model should bind to a string (in YYYY-MM-DD format) -->
                  <v-date-picker v-model="selectedDate" @input="handleDateChange"></v-date-picker>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>

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

    <!-- Updated Simple Table -->
    <v-simple-table class="aligned-table">
      <thead>
        <tr>
          <th style="width: 18%">Applicant Name</th>
          <th style="width: 15%">ID Card</th>
          <th style="width: 10%">Gender</th>
          <th style="width: 15%">Phone</th>
          <th style="width: 12%">Applied At</th>
          <th style="width: 12%">Job Name</th>
          <th style="width: 12%">Category</th>

          <th style="width: 15%">Status</th>
          <th style="width: 12%">Resume Status</th>

          <th style="width: 15%">Actions</th> <!-- Added Actions column -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="application in filteredApplications" :key="application.application_id">
          <td>{{ application.applicant_name }}</td>
          <td>{{ application.identification_card }}</td>
          <td>{{ application.gender }}</td>
          <td>{{ application.hp_number }}</td>
          <td>{{ new Date(application.applied_at).toLocaleDateString('en-GB', { timeZone: 'UTC' }) }}</td> 
          <td>{{ application.job_name }}</td>
          <td>{{ application.job_category }}</td>
          <td>{{ application.status }}</td>
          <td>
            <!-- New Resume Status Column -->
            <v-chip :color="application.resume_pdf ? 'green' : 'red'" dark small>
              {{ application.resume_pdf ? 'Available' : 'Not Available' }}

            </v-chip>
          </td>
          <td>
            <v-btn @click="viewResume(application.resume_pdf)" color="primary" style="margin-top: 10px;">
          View Resume
        </v-btn>
        <v-icon @click="editApplication(application)" style="margin-left: 15px;margin-top: 5px;">mdi-pencil</v-icon>
        <v-icon @click="confirmDelete(application)" style="margin-left: 10px; margin-top: 5px">mdi-delete</v-icon>
      </td>
        </tr>
      </tbody>
    </v-simple-table>

    <v-row justify="start" class="button-row" style="margin-bottom: 20px;">
      <v-btn color="primary" @click="goBack">Back</v-btn>
    </v-row>

    <!-- Edit Application Dialog -->
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title>Edit Application</v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field v-model="editApplicationData.applicant_name" label="Applicant Name"></v-text-field>
          <v-text-field v-model="editApplicationData.identification_card" label="ID Card"></v-text-field>
          
          <!-- Gender Selection -->
          <v-select
            v-model="editApplicationData.gender"
            :items="['Female', 'Male']"
            label="Gender"
          ></v-select>

          <v-text-field v-model="editApplicationData.hp_number" label="Phone"></v-text-field>

          <!-- Status Selection -->
          <v-select
            v-model="editApplicationData.status"
            :items="['Received', 'Pending']"
            label="Status"
          ></v-select>

          <!-- PDF Upload -->
          <v-file-input
            v-model="newResumePdf"
            label="Upload Resume (PDF)"
            accept=".pdf"
            hint="Leave blank to retain existing file"
            :prepend-icon="editApplicationData.resume_pdf ? 'mdi-paperclip' : ''"
          ></v-file-input>
          
          <!-- Display existing resume if available -->
          <div v-if="editApplicationData.resume_pdf">
            <p>Current Resume: <a :href="viewResumeUrl(editApplicationData.resume_pdf)" target="_blank">View</a></p>
            <!-- Remove Resume Checkbox -->
            <v-checkbox
              v-model="removeResume"
              label="Remove Current Resume"
            ></v-checkbox>
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="updateApplication" :loading="loading" :disabled="loading">Update</v-btn>
        <v-btn @click="dialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>


    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title>Confirm Delete</v-card-title>
        <v-card-text>Are you sure you want to delete this application?</v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="deleteApplicationConfirmed" :loading="loading" :disabled="loading">Yes</v-btn>
          <v-btn @click="deleteDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for notifications -->
    <v-snackbar v-model="snackbar" :color="snackbarType">
      {{ snackbarText }}
      <v-btn text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>


<script>
import axios from "axios";

export default {
  data() {
    return {
      searchQuery: "",
      selectedLocation: ["All"],
      locations: ['Johor', 'Selangor', 'Melaka', 'Kuala Lumpur', 'Pahang', 'Pulau Pinang', 'Kelantan', 'Kedah', 'Perlis', 'Perak', 'Terengganu', 'Negeri Sembilan', 'Sarawak', 'Sabah'],
      locationMenu: false,
      selectedCategories: ["All"],
      categories: ['Education', 'Designer', 'Sales', 'Finance', 'Information Technology', 'Food & Beverage', 'Transportation', 'Marketing', 'Arts', 'Customer Service', 'Human Resources', 'Accountant'],
      categoryMenu: false,
      dateMenu: false,
      showAllDates: true,
      selectedDate: null,
      applications: [],
      dialog: false,
      deleteDialog: false,
      editApplicationData: {},
      applicationToDelete: null,
      loading: false,
      snackbar: false,
      snackbarText: "",
      snackbarType: "",
      removeResume: false, // New property for managing resume removal
      newResumePdf: null, // Declare newResumePdf here

    };
  },
  computed: {
    filteredApplications() {
      return this.applications.filter((job) => {
        const matchesSearch = job.job_name.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesLocation = this.selectedLocation.includes("All") || this.selectedLocation.some((location) => job.working_place.toLowerCase().includes(location.toLowerCase()));
        const matchesCategory = this.selectedCategories.includes("All") || this.selectedCategories.includes(job.job_category);
        
        let matchesDate = true;
        if (this.selectedDate) {
          const jobDate = new Date(job.applied_at).toISOString().split('T')[0]; // Format to YYYY-MM-DD
          matchesDate = jobDate === this.selectedDate;
        } else if (!this.showAllDates) {
          matchesDate = false; // Exclude jobs with no date if "Show All Dates" is not selected
        }
        return matchesSearch && matchesLocation && matchesCategory && matchesDate;
      });
    },
  },
  methods: {
    fetchApplications() {
      this.loading = true; // Start loading
      const apiUrl = process.env.VUE_APP_API_URL;
      axios
        .get(`${apiUrl}/all-applications`, { withCredentials: true })
        .then((response) => {
          this.applications = response.data;
        })
        .catch((error) => {
          this.snackbarText = "Failed to load applications";
          this.snackbarType = "error";
          this.snackbar = true;
        })
        .finally(() => {
          this.loading = false; // End loading
        });
    },
    viewResume(resumePdf) {
      if (!resumePdf) {
        this.snackbarText = "No resume available";
        this.snackbarType = "warning";
        this.snackbar = true;
        return;
      }
      // Open the resume in a new tab for view or download
      const blob = new Blob([this.base64ToArrayBuffer(resumePdf)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.click();
    },
    base64ToArrayBuffer(base64) {
      const binaryString = window.atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
    },
    editApplication(application) {
      this.dialog = true;
      this.editApplicationData = { ...application }; // Clone the application data for editing
      this.newResumePdf = null; // Reset the file input
      this.removeResume = false; // Reset remove checkbox
    },
    viewResumeUrl(resumePdf) {
    return URL.createObjectURL(new Blob([this.base64ToArrayBuffer(resumePdf)], { type: "application/pdf" }));
  },
    updateApplication() {
      this.loading = true;
      const apiUrl = process.env.VUE_APP_API_URL;

      const formData = new FormData();
      formData.append('name', this.editApplicationData.applicant_name);
      formData.append('identification_card', this.editApplicationData.identification_card);
      formData.append('gender', this.editApplicationData.gender);
      formData.append('hp_number', this.editApplicationData.hp_number);
      formData.append('status', this.editApplicationData.status);

      // Include the new resume if uploaded
      if (this.newResumePdf) {
        formData.append('resume_pdf', this.newResumePdf);
      }

      // Include a flag to remove the current resume
      if (this.removeResume) {
        formData.append('remove_resume', true);
      }

      axios
        .put(`${apiUrl}/update-application/${this.editApplicationData.application_id}`, formData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(() => {
          this.snackbarText = "Application updated successfully";
          this.snackbarType = "success";
          this.snackbar = true;
          this.dialog = false;
          this.fetchApplications(); // Refresh data after update
        })
        .catch((error) => {
          this.snackbarText = "Failed to update application: " + error.response.data.error || "Unknown error";
          this.snackbarType = "error";
          this.snackbar = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    confirmDelete(application) {
      this.applicationToDelete = application;
      this.deleteDialog = true;
    },
    deleteApplicationConfirmed() {
      this.loading = true;
      const apiUrl = process.env.VUE_APP_API_URL;
      axios
        .delete(`${apiUrl}/delete-application/${this.applicationToDelete.application_id}`, { withCredentials: true })
        .then(() => {
          this.snackbarText = "Application deleted successfully";
          this.snackbarType = "success";
          this.snackbar = true;
          this.deleteDialog = false;
          this.fetchApplications(); // Refresh data after deletion
        })
        .catch((error) => {
          this.snackbarText = "Failed to delete application";
          this.snackbarType = "error";
          this.snackbar = true;
        })
        .finally(() => {
          this.loading = false;
        });
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
    handleDateChange(date) {
      if (date) {
        this.selectedDate = date;
        this.showAllDates = false;
      } else {
        this.selectedDate = null;
        this.showAllDates = true;
      }
    },
    handleShowAllDatesChange() {
      if (this.showAllDates) {
        this.selectedDate = null;
      }
    },
    resetFilters() {
      this.searchQuery = "";
      this.selectedLocation = ["All"];
      this.selectedCategories = ["All"];
      this.showAllDates = true;
      this.selectedDate = null;
    },
    filterJobs() {
      // Optional: Add additional filtering logic if needed.
    },
    goBack() {
      this.$router.push('/admin-home'); // Adjust the path as needed
    },
  },
  mounted() {
    this.fetchApplications();
  },
};
</script>

<style scoped>
.elevation-1 {
  margin-top: 20px;
}

.button-row {
    margin-top: 20px;
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
  
  th, td {
  text-align: center !important;
  padding: 10px;
}
</style>
