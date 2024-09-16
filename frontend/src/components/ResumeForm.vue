<template>
  <v-app>
    <div>
      <NavbarSeeker :username="username" />
      <v-container class="resume-form" style="margin-top: 20px;">
        <v-card color="black" dark class="pa-5">
          <v-card-title class="headline text-center">Resume Screening AI Base System</v-card-title>
          <v-card-text>
            <p>This system supports TXT and PDF files to be uploaded and will work on the following:</p>
            <v-list dense>
              <v-list-item>
                <v-list-item-content>Resume Job Categorization</v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>Resume Job Recommendation</v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <div style="height: 30px;"></div> <!-- Spacer -->

        <v-card class="mt-5 pa-5" color="white">
          <v-card-title class="headline">Upload Your Resume</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="submitResume">
              <v-file-input v-model="file" label="Choose file" required></v-file-input>
              <div style="margin-bottom: 20px;"> <!-- Add margin-bottom to the wrapper -->
                <v-btn type="submit" class="mt-3" style="background-color: #4CAF50; color: white;">Submit</v-btn>
              </div>
            </v-form>

            <!-- Conditionally display category and recommended job -->
            <div v-if="predictedCategory">
              <v-divider class="my-5" style="margin-top: 10px;"></v-divider>
              <p class="text-center" style="margin-top: 15px;"><strong>Category:</strong> {{ predictedCategory }}</p>
              <p class="text-center"><strong>Recommended Job:</strong> {{ recommendedJob }}</p>
              <v-divider class="my-5"></v-divider>
            </div>

            <v-alert v-if="message" type="info" class="text-center mt-3" style="background-color: red; color: white;">{{ message }}</v-alert>
          </v-card-text>
        </v-card>

        <div style="height: 30px;"></div> <!-- Spacer -->

        <!-- Conditionally display the "Recommended Jobs" card if jobs are available -->
        <v-card v-if="jobs.length > 0" class="mt-5 pa-3" color="white">
          <v-card-text>
            <p class="text-center headline">Recommended Jobs</p>
          </v-card-text>
        </v-card>

        <div style="height: 30px;"></div> <!-- Spacer -->

        <!-- Display jobs -->
        <v-row>
          <v-col v-for="job in jobs" :key="job.id" cols="12" sm="6" md="4">
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
                <v-btn
                  color="brown"
                  @click="openApplyDialog(job.id)"
                  class="ml-2"
                >
                  Apply
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Apply Dialog and Snackbar -->
        <v-dialog v-model="applyDialog" max-width="500px">
          <v-card>
            <v-card-title>Apply for Job</v-card-title>
            <v-card-text>
              <v-form ref="applyForm">
                <v-text-field v-model="application.name" label="Name" required></v-text-field>
                <v-text-field v-model="application.identification_card" label="Identification Card" required></v-text-field>
                <v-select
                  v-model="application.gender"
                  :items="['Male', 'Female']"
                  label="Gender"
                  required
                ></v-select>
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
              <v-btn color="green" @click="submitApplication">Send</v-btn>
              <v-btn @click="applyDialog = false">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar.show" :color="snackbar.color" top>
          {{ snackbar.message }}
          <v-btn text @click="snackbar.show = false">Close</v-btn>
        </v-snackbar>

        <!-- Display message if no jobs are found -->
        <!-- <v-alert v-if="message && !jobs.length" type="info" class="text-center mt-3" style="background-color: red; color: white;">
          {{ message }}
        </v-alert> -->
      </v-container>
    </div>
  </v-app>
</template>

<script>
import NavbarSeeker from './jobseekers/NavbarSeeker.vue';
import axios from 'axios';

// Set the base URL for all axios requests
axios.defaults.baseURL = 'http://localhost:5000';

export default {
  components: {
    NavbarSeeker
  },
  data() {
    return {
      file: null,
      message: '',
      predictedCategory: '',
      recommendedJob: '',
      jobs: [],
      username: '',
      expandedJob: null, // To keep track of the currently expanded job
      selectedJobId: null,
      applyDialog: false,
      application: {
        name: '',
        identification_card: '',
        gender: '',
        hp_number: '',
        resume_pdf: null,
      },
      snackbar: {
        show: false,
        message: '',
        color: '',
      }
    };
  },
  methods: {
    onFileChange(event) {
      this.file = event.target.files[0];
    },
    fetchUsername() {
      // Return the username from some source (e.g., localStorage, API, Vuex store, etc.)
      return localStorage.getItem('username') || '';
    },
    async submitResume() {
      if (!this.file) {
        this.message = "Please upload a file.";
        return;
      }

      const formData = new FormData();
      formData.append('resume', this.file);

      try {
        const response = await axios.post('/jobs', formData, { withCredentials: true });
        console.log("Jobs response:", response.data); // Log the response data

        // Set the predicted category and recommended job regardless of whether jobs are found
        this.predictedCategory = response.data.predicted_category;
        this.recommendedJob = response.data.recommended_job;

        // Check if jobs are found
        if (response.data.jobs && response.data.jobs.length) {
          this.jobs = response.data.jobs;
          this.message = '';  // Clear any previous messages
        } else {
          this.jobs = [];  // Clear the jobs list if no jobs are found
          this.message = response.data.message || "No jobs found.";
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.message = error.response.data.message;  // Display the backend error message
        } else {
          this.message = "Error fetching jobs.";
        }
      }
    },
    async fetchJobsByCategory(category) {
      try {
        const response = await axios.get(`/jobs?category=${category}`, { withCredentials: true });
        this.jobs = response.data;

        // Check if the response contains a message instead of job data
        if (response.data.message) {
          this.message = response.data.message; // Display the "no jobs found" message
          this.jobs = [];  // Clear the jobs list
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.message = error.response.data.message;  // Display the backend error message
        } else {
          this.message = "Error fetching jobs.";
        }
      }
    },
    isExpanded(jobId) {
      return this.expandedJob === jobId;
    },
    toggleExpand(jobId) {
      this.expandedJob = this.expandedJob === jobId ? null : jobId;
    },
    openApplyDialog(jobId) {
      this.applyDialog = true;
      this.selectedJobId = jobId; // Store the selected job ID
      // Optionally, you can store the jobId here to link the application to the job
      // this.application.jobId = jobId;
    },
    submitApplication() {
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

      fetch('http://localhost:5000/apply', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            // Application was successful
            this.snackbar = {
              show: true,
              message: 'You have successfully applied for the part-time job',
              color: 'blue'
            };
            this.applyDialog = false;
          } else {
            // Application failed
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
        });
    }
  },
  mounted() {
    this.username = this.fetchUsername();

    // Check if user is authenticated (example for session-based login)
    if (!this.username) {
      this.$router.push('/login'); // Redirect to login if not authenticated
    }
  }
};
</script>

<style scoped>
.resume-form {
  max-width: 800px;
  margin: auto;
}
</style>