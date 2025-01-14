<template>
  <div>
    <NavbarSeeker :username="username" />

    <v-container class="seeker-home" fluid>
      <v-row>
        <v-col>
          <h1>Welcome {{ username }}</h1>
        </v-col>
      </v-row>

      <v-row class="d-flex align-center">
        <!-- Job Search Bar with 'X' Icon to Clear -->
        <v-col cols="12" sm="5">
          <v-text-field
            v-model="searchText"
            label="Search Job"
            append-icon="mdi-close"
            @click:append="clearSearch"
            @keyup.enter="searchJob"
            class="custom-text-field"
            outlined
          />
        </v-col>

        <!-- This is for the filter location -->
        <v-col cols="12" sm="3">
        <v-menu v-model="locationMenu" offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-bind="attrs"
              v-on="on"
              label="Filter by Location"
              readonly
              :value="selectedLocation.includes('All') ? 'All' : selectedLocation.join(', ')"
              class="custom-text-field"
              outlined
            />
          </template>
          <v-card style="max-height: 300px; overflow-y: auto;"> <!-- Adjust height here -->
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

        <!-- Spacer to push buttons to the right -->

        <!-- This is for the filter category -->
        <v-col cols="12" sm="3">
          <v-menu v-model="categoryMenu" offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-bind="attrs"
                v-on="on"
                label="Filter by Category"
                readonly
                :value="selectedCategories.includes('All') ? 'All' : selectedCategories.join(', ')"
                class="custom-text-field"
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

        <!-- Search Button -->
        <v-col cols="auto" class="pl-1">
            <v-btn color="custom-search-btn" @click="combinedFilter" style="min-width: 100px; margin-top: -25px;">Search</v-btn>
          </v-col>
        </v-row>

      <v-progress-circular v-if="loading" indeterminate color="primary" class="ma-2"></v-progress-circular>
  
      <!-- Jobs listing -->
      <v-row v-if="!loading">
        <v-col v-for="job in filteredJobs" :key="job.id" cols="12" sm="6" md="4" class="job-col">
          <v-card class="job-card" compact-card>
            <v-card-title class="job-title">
              <v-icon class="mr-2">{{ categoryIcons[job.job_category] || 'mdi-briefcase' }}</v-icon>
              {{ job.job_name }}
            </v-card-title>
            <v-card-subtitle class="job-category">{{ job.job_category }}</v-card-subtitle>
            <v-card-text>
              <p class="job-detail left-align" v-if="isExpanded(job.id)"><strong>Description:</strong> {{ job.job_description }}</p>
              <p class="job-detail left-align"><strong>Place:</strong> {{ job.working_place }}</p>
              <p class="job-detail left-align"><strong>Hours:</strong> {{ job.working_hours }}</p>
              <p class="job-detail left-align" v-if="isExpanded(job.id)"><strong>Created At:</strong> {{ new Date(job.created_at).toLocaleDateString('en-GB', { timeZone: 'UTC' }) }}</p> 
              <p class="job-detail left-align" v-if="isExpanded(job.id)"><strong>Provider:</strong> {{ job.provider_name }}</p>
              <p class="job-detail left-align" v-if="isExpanded(job.id)"><strong>Contact:</strong> {{ job.phone_num }}</p> <!-- Add Contact here -->
              <p class="job-detail left-align" v-if="isExpanded(job.id)"><strong>Salary Range:</strong> {{ job.salary }}</p>

              <v-btn text class="expand-btn" @click="toggleExpand(job.id)">
                {{ isExpanded(job.id) ? 'Show Less' : 'Show More' }}
              </v-btn>
              <v-btn color="brown" @click="openApplyDialog(job.id)" class="apply-btn" style="color: aliceblue;">Apply</v-btn>
            </v-card-text>
          </v-card>
        </v-col>
        <!-- Display message if no jobs match the criteria -->
        <v-col v-if="filteredJobs.length === 0" cols="12">
          <div class="text-center">
            <v-btn disabled class="grey lighten-2">Sorry, no jobs found matching your criteria</v-btn>
          </div>
        </v-col>
      </v-row>

    </v-container>

    <!-- Apply Dialog -->
    <v-dialog v-model="applyDialog" max-width="500px">
      <v-card>
        <v-card-title>Apply for Job</v-card-title>
        <v-card-text>
          <v-form ref="applyForm">
            <v-text-field v-model="application.name" label="Full Name" required></v-text-field>
            <v-text-field v-model="application.identification_card" label="Identification Card / Passport Number" required></v-text-field>
            <v-text-field v-model="application.seekeremail" label="Email Address" required></v-text-field> <!-- New email field -->
            <v-select v-model="application.gender" :items="['Male', 'Female']" label="Gender" required></v-select>
            <v-text-field v-model="application.hp_number" label="Phone Number" required></v-text-field>
            <v-file-input v-model="application.resume_pdf" label="Upload Resume (optional)" accept=".pdf" prepend-icon="mdi-paperclip"></v-file-input>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="green" @click="submitApplication" :loading="loading" :disabled="loading">Send</v-btn>
          <v-btn @click="applyDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for success or error messages -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" top>
      {{ snackbar.message }}
      <v-btn text @click="snackbar.show = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import NavbarSeeker from './NavbarSeeker.vue';

export default {
  name: 'SeekerHome',
  components: {
    NavbarSeeker
  },
  data() {
    return {
      loading: false,
      username: '',
      jobs: [],
      filteredJobs: [],
      expandedJobs: {},
      applyDialog: false,
      selectedJobId: null,
      application: {
        name: '',
        identification_card: '',
        gender: '',
        hp_number: '',
        resume_pdf: null
      },
      snackbar: {
        show: false,
        message: '',
        color: ''
      },
      selectedCategories: ['All'], // Selected categories for filtering
      allSelected: false, // Track if 'All' is selected
      categories: [ 'Education', 'Designer', 'Sales', 'Finance', 'Information Technology', 'Food & Beverage','Transportation', 'Marketing', 'Arts', 'Customer Service', 'Human Resources', 'Accountant','Others'], // Available categories
      searchText: '', // Search text for job names
      selectedLocation: ['All'], // Selected location for filtering
      locations: ['Johor', 'Selangor', 'Melaka','Kuala Lumpur','Pahang','Pulau Pinang','Kelantan','Kedah','Perlis','Perak','Terengganu','Negeri Sembilan','Sarawak','Sabah'], // Available locations
      locationMenu: false, // State for location dropdown menu
      categoryMenu: false,
      categoryIcons: {
        'Education': 'mdi-school',                 // Icon for Education
        'Designer': 'mdi-pencil',                  // Icon for Designer
        'Sales': 'mdi-cart',                       // Icon for Sales
        'Finance': 'mdi-cash',                     // Icon for Finance
        'Information Technology': 'mdi-laptop',    // Icon for IT
        'Food & Beverage': 'mdi-food',             // Icon for Food & Beverage
        'Marketing': 'mdi-bullhorn',               // Icon for Marketing
        'Arts': 'mdi-palette',                     // Icon for Arts
        'Customer Service': 'mdi-account-tie',     // Icon for Customer Service
        'Human Resources': 'mdi-account-group',     // Icon for Human Resources
        'Accountant': 'mdi-calculator',            // Icon for Accountant
        'Transportation': 'mdi-motorbike',         // Icon for Transportation

        // Add more mappings as needed
      },

    };
  },
  created() {
    this.username = sessionStorage.getItem('username') || '';
    this.fetchJobs();
  },
  methods: {
    fetchJobs() {
      this.loading = true; // Start loading
      const apiUrl = process.env.VUE_APP_API_URL;
      fetch(`${apiUrl}/getjobs`, {
        credentials: 'include',
      })
        .then(response => response.json())
        .then(data => {
          this.jobs = data;
          this.filteredJobs = data; // Set default filtered jobs
          this.loading = false; // Stop loading after data is set

        })
        .catch(error => {
          console.error('Error fetching jobs:', error);
          this.loading = false; // Stop loading even if there's an error

        });
    },
    clearSearch() {
      this.searchText = '';
      this.searchJob();
    },

    // Method for searching jobs by name
    searchJob() {
      this.filteredJobs = this.jobs.filter(job =>
        job.job_name.toLowerCase().includes(this.searchText.toLowerCase())
      );
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

  // Method for filtering jobs by location
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

    // Method for handling the "All" selection
    selectAllLocations() {
      if (this.selectedLocation.includes('All')) {
        this.selectedLocation = ['All']; // Keep only 'All' selected
        this.filteredJobs = this.jobs; // Display all jobs
      } else {
        this.selectedLocation = []; // Deselect all
      }
    },

    // Combined filter for both search and location
    combinedFilter() {
      let filteredByText = this.jobs.filter(job =>
        job.job_name.toLowerCase().includes(this.searchText.toLowerCase())
      );

      if (this.selectedLocation.includes('All') || this.selectedLocation.length === 0) {
        this.filteredJobs = filteredByText; // If 'All' or no location is selected, just use search results
      } else {
        this.filteredJobs = filteredByText.filter(job =>
          this.selectedLocation.some(location =>
            job.working_place.toLowerCase().includes(location.toLowerCase())
          )
        );
      }
    },
    handleAllCategorySelection(isChecked) {
    if (isChecked) {
      // If 'All' is checked, clear other selections
      this.selectedCategories = ['All'];
    } else {
      // If 'All' is unchecked, remove it from selectedCategories
      const index = this.selectedCategories.indexOf('All');
      if (index > -1) {
        this.selectedCategories.splice(index, 1);
      }
    }
    this.categoryMenu = true; // Keep dropdown open
    this.filterCategory(); // Re-filter jobs based on updated selection
  },

  handleCategorySelection() {
    // Check if 'All' is selected
    if (this.selectedCategories.length > 1 && this.selectedCategories.includes('All')) {
      // If 'All' is selected along with other categories, remove 'All'
      const index = this.selectedCategories.indexOf('All');
      if (index > -1) {
        this.selectedCategories.splice(index, 1); // Deselect 'All'
      }
    }

    this.categoryMenu = true; // Keep dropdown open
    this.filterCategory(); // Re-filter jobs based on updated selection
  },

  filterCategory() {
    if (this.selectedCategories.includes('All')) {
      this.filteredJobs = this.jobs; // Show all jobs when 'All' is selected
    } else {
      this.filteredJobs = this.jobs.filter(job =>
        this.selectedCategories.some(category => job.job_category === category)
      );
    }
  },
  
    toggleExpand(jobId) {
      this.$set(this.expandedJobs, jobId, !this.expandedJobs[jobId]);
    },
    isExpanded(jobId) {
      return !!this.expandedJobs[jobId];
    },
    openApplyDialog(jobId) {
      this.selectedJobId = jobId;
      this.applyDialog = true;
    },
    submitApplication() {
      const apiUrl = process.env.VUE_APP_API_URL;
      const formData = new FormData();
      formData.append('job_seeker_id', sessionStorage.getItem('user_id'));
      formData.append('job_id', this.selectedJobId);
      formData.append('name', this.application.name);
      formData.append('identification_card', this.application.identification_card);
      formData.append('gender', this.application.gender);
      formData.append('hp_number', this.application.hp_number);
      formData.append('seekeremail', this.application.seekeremail);  // Add email to formData
      if (this.application.resume_pdf) {
        formData.append('resume_pdf', this.application.resume_pdf);
      }
      this.loading = true;

      fetch(`${apiUrl}/apply`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            this.snackbar = {
              show: true,
              message: 'You have successfully applied for the part-time job',
              color: 'blue'
            };
            this.applyDialog = false;
          } else {
            this.snackbar = {
              show: true,
              message: 'Sorry, application failed. Please try again.',
              color: 'red'
            };
          }
        })
        .catch(error => {
          console.error('Error submitting application:', error);
          this.snackbar = {
            show: true,
            message: 'Sorry, application failed. Please try again.',
            color: 'red'
          };
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
}
</script>

<style scoped>

.seeker-home {
  text-align: center;
  position: relative;
  overflow: hidden;
  text-align: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #fff1eb, #ace0f9);
}
.seeker-home::before,
.seeker-home::after {
  content: '';
  position: absolute;
  width: 200px;
  height: 200px;
  background: rgba(255, 87, 34, 0.4);
  border-radius: 50%;
  animation: float 10s infinite ease-in-out;
}

.seeker-home::before {
  top: -50px;
  left: -50px;
}

.seeker-home::after {
  bottom: -50px;
  right: -50px;
}

@keyframes float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(20px);
  }
  100% {
    transform: translateY(0);
  }
}
.seeker-home h1 {
  font-family: 'Arial', sans-serif;
  color: #4CAF50;
}

v-card {
  margin-bottom: 20px; /* Spacing between job containers */
}

.show-more-btn {
  font-size: 5px;
  text-decoration: underline;
  padding: 0;
  min-width: 0;
}

.custom-category-btn {
  background: linear-gradient(45deg, #ff4081, #ff80ab); /* Fancy gradient color */
  color: white !important;
  border-radius: 8px;
}

.custom-search-btn {
  background: linear-gradient(45deg, #ffa726, #ffeb3b); /* From orange to yellow */
  color: white;
  border-radius: 8px;
}

.custom-category-btn:hover, .custom-search-btn:hover {
  opacity: 0.8; /* Slight opacity on hover */
}

.job-col {
  padding: 28px; /* Add space between columns */
}


.job-card {
  background: linear-gradient(135deg, #f7f8fa, #ffe37d); /* Light gradient background */
  border-radius: 12px; /* Rounded corners */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Hover animation */
  margin-bottom: 20px; /* Spacing between job containers */
}

.job-card:hover {
  transform: translateY(-5px); /* Lifting effect on hover */
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.job-title {
  font-size: 1.3em; /* Increase font size */
  font-weight: bold;
  color: #3f51b5; /* Primary color for the job title */
}

.job-category {
  color: #757575; /* Grey color for the category */
  font-size: 1.1em;
  font-weight: bold;
}

.job-detail {
  color: #555; /* Darker text for details */
  font-size: 1.0em;
  margin-bottom: 15px;
}

.job-detail:last-child {
  margin-bottom: 0; /* Remove margin on the last paragraph */
}

.expand-btn {
  font-size: 0.8em;
  text-decoration: underline;
  color: #009688; /* Teal color for the 'Show More/Less' link */
}

.apply-btn {
  background-color: #ff5722; /* Deep orange color */
  color: white;
  font-weight: bold;
  border-radius: 20px;
  padding: 6px 12px;
  transition: background-color 0.3s ease;
}

.apply-btn:hover {
  background-color: #e64a19; /* Darker orange on hover */
}

.left-align {
  text-align: left; /* Ensure text is aligned to the left */
}


</style>
