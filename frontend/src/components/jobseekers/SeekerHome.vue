<template>
  <div>
    <NavbarSeeker :username="username" />

    <v-container class="seeker-home">
      <v-row>
        <v-col>
          <h1>Welcome {{ username }}</h1>
        </v-col>
        <!-- Filter Dropdown with Checkboxes -->
        <v-col class="text-right">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" v-bind="attrs" v-on="on">
                Filter Jobs
              </v-btn>
            </template>
            <v-card style="max-height: 300px; overflow-y: auto;">
              <v-list>
                <v-list-item>
                  <v-checkbox v-model="selectedCategories" value="All" label="All" @change="filterJobs"></v-checkbox>
                </v-list-item>
                <v-list-item>
                  <v-checkbox v-model="selectedCategories" value="Education" label="Education" @change="filterJobs"></v-checkbox>
                </v-list-item>
                <v-list-item>
                  <v-checkbox v-model="selectedCategories" value="Designer" label="Designer" @change="filterJobs"></v-checkbox>
                </v-list-item>

                <v-list-item>
                  <v-checkbox v-model="selectedCategories" value="Others" label="Others" @change="filterJobs"></v-checkbox>
                </v-list-item>

                <v-list-item>
                  <v-checkbox v-model="selectedCategories" value="Sales" label="Sales" @change="filterJobs"></v-checkbox>
                </v-list-item>
                <v-list-item>
                  <v-checkbox v-model="selectedCategories" value="Finance" label="Finance" @change="filterJobs"></v-checkbox>
                </v-list-item>
                <v-list-item>
                  <v-checkbox v-model="selectedCategories" value="Information Technology" label="Information Technology" @change="filterJobs"></v-checkbox>
                </v-list-item>
                <v-list-item>
                  <v-checkbox v-model="selectedCategories" value="Food & Beverage" label="Food & Beverage" @change="filterJobs"></v-checkbox>
                </v-list-item>
                <v-list-item>
                  <v-checkbox v-model="selectedCategories" value="Marketing" label="Marketing" @change="filterJobs"></v-checkbox>
                </v-list-item>
                <v-list-item>
                  <v-checkbox v-model="selectedCategories" value="Arts" label="Arts" @change="filterJobs"></v-checkbox>
                </v-list-item>
                <v-list-item>
                  <v-checkbox v-model="selectedCategories" value="Customer Service" label="Customer Service" @change="filterJobs"></v-checkbox>
                </v-list-item>
                <v-list-item>
                  <v-checkbox v-model="selectedCategories" value="Human Resources" label="Human Resources" @change="filterJobs"></v-checkbox>
                </v-list-item>
                <v-list-item>
                  <v-checkbox v-model="selectedCategories" value="Accountant" label="Accountant" @change="filterJobs"></v-checkbox>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </v-col>
      </v-row>

      <v-row>
        <v-col v-for="job in filteredJobs" :key="job.id" cols="12" sm="6" md="4">
          <v-card>
            <v-card-title>{{ job.job_name }}</v-card-title>
            <v-card-subtitle>{{ job.job_category }}</v-card-subtitle>
            <v-card-text>
              <p class="mb-2"><strong>Place:</strong> {{ job.working_place }}</p>
              <p class="mb-2"><strong>Hours:</strong> {{ job.working_hours }}</p>
              <p class="mb-2" v-if="isExpanded(job.id)"><strong>Description:</strong> {{ job.job_description }}</p>
              <p class="mb-2" v-if="isExpanded(job.id)"><strong>Created At:</strong> {{ new Date(job.created_at).toLocaleString() }}</p>
              <p class="mb-2" v-if="isExpanded(job.id)"><strong>Provider:</strong> {{ job.provider_name }}</p>
              <v-btn
                text
                @click="toggleExpand(job.id)"
                :style="{ fontSize: '10px', textDecoration: 'underline', padding: '0', minWidth: '0' }"
              >
                {{ isExpanded(job.id) ? 'Show Less' : 'Show More' }}
              </v-btn>
              <v-btn color="brown" @click="openApplyDialog(job.id)" class="ml-2">
                Apply
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Apply Dialog -->
    <v-dialog v-model="applyDialog" max-width="500px">
      <v-card>
        <v-card-title>Apply for Job</v-card-title>
        <v-card-text>
          <v-form ref="applyForm">
            <v-text-field v-model="application.name" label="Name" required></v-text-field>
            <v-text-field v-model="application.identification_card" label="Identification Card" required></v-text-field>
            <v-select v-model="application.gender" :items="['Male', 'Female']" label="Gender" required></v-select>
            <v-text-field v-model="application.hp_number" label="HP Number" required></v-text-field>
            <v-file-input
              v-model="application.resume_pdf"
              label="Upload Resume (optional)"
              accept=".pdf"
              prepend-icon="mdi-paperclip"
            ></v-file-input>
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
    };
  },
  created() {
    this.username = sessionStorage.getItem('username') || '';
    this.fetchJobs();
  },
  methods: {
    fetchJobs() {
      const apiUrl = process.env.VUE_APP_API_URL;
      fetch(`${apiUrl}/getjobs`, {
        credentials: 'include',
      })
        .then(response => response.json())
        .then(data => {
          this.jobs = data;
          this.filteredJobs = data; // Set default filtered jobs
        })
        .catch(error => {
          console.error('Error fetching jobs:', error);
        });
    },
    filterJobs() {
      if (this.selectedCategories.includes('All')) {
        this.filteredJobs = this.jobs;
      } else {
        this.filteredJobs = this.jobs.filter(job =>
          this.selectedCategories.includes(job.job_category)
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
  margin-top: 20px;
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
</style>
