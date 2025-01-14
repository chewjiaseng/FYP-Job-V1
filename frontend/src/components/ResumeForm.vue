<template>
    <div class="resume-background">
      <NavbarSeeker :username="username" />
      <v-container class="resume-form" style="margin-top: 20px;">
        <v-card class="pa-5 custom-card1" style="background-color: #f9f9f9; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
          <!-- Card Title with contrasting color -->
          <v-card-title class="headline text-center" style="color: #2c3e50; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; font-family: 'Montserrat', sans-serif;">
            Resume Screening AI-Based System</v-card-title>
          <v-card-text>
            <p style="color: #34495e; font-size: 16px; font-family: 'Roboto', sans-serif; line-height: 1.6;">This system supports TXT and PDF files to be uploaded and will work on the following:</p>
            
            <div style="text-align: center; color: black; font-size: 15px; font-family: 'Roboto', sans-serif;">
              <div style="margin-bottom: 10px;">Resume Job Categorization</div>
              <div>Resume Job Recommendation</div>
            </div>

          </v-card-text>
        </v-card>

        <div style="height: 30px;"></div> <!-- Spacer -->

        <v-card class="mt-5 pa-5 custom-card2" color="white">
          <v-card-title class="headline" style="color:black ">Upload Your Resume</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="submitResume">
              <v-file-input v-model="file" label="Choose file" required accept=".pdf,.txt"></v-file-input>
              <div style="margin-bottom: 20px;"> <!-- Add margin-bottom to the wrapper -->
                <v-btn type="submit" class="mt-3" style="background-color: #4CAF50; color: white;" :loading="loading" :disabled="loading">Submit</v-btn>
              </div>
            </v-form>

            <!-- Conditionally display category and recommended job -->
            <div v-if="predictedCategory">
              <v-divider class="my-3" style="margin-top: 5px;"></v-divider>
              <p class="text-center" style="margin-top: 5px; margin-bottom: 5px;"><strong>Category:</strong> {{ predictedCategory }}</p>
              <p class="text-center"  style="margin-top: 0px; margin-bottom: 0px;"><strong>Recommended Job:</strong> {{ recommendedJob }}</p>
              <v-divider class="my-3" style="margin-bottom: 5px;"></v-divider>
            </div>

            <v-alert v-if="message" type="error" class="text-center mt-3" style="background-color: red; color: white;">{{ message }}</v-alert>
          </v-card-text>
        </v-card>

        <div style="height: 30px;"></div> <!-- Spacer -->

        <!-- Conditionally display the "Recommended Jobs" card if jobs are available -->
        <v-card v-if="jobs.length > 0" class="mt-2 pa-2 custom-card3" color="black">
          <v-card-text>
            <p class="text-center headline">Recommended Jobs</p>
          </v-card-text>
        </v-card>

        <div style="height: 30px;"></div> <!-- Spacer -->

        <!-- Display jobs -->
        <v-row>
          <v-col v-for="job in jobs" :key="job.id" cols="12" sm="6" md="4">
            <v-card class="job-card">
              <v-card-title class="job-title">
                <v-icon class="mr-2">{{ categoryIcons[job.job_category] || 'mdi-briefcase' }}</v-icon>
                {{ job.job_name }}
              </v-card-title>
              <v-card-subtitle>{{ job.job_category }}</v-card-subtitle>
              <v-card-text>
                <p class="job-detail left-align" v-if="isExpanded(job.id)"><strong>Description:</strong> {{ job.job_description }}</p>
                <p class="job-detail left-align"><strong>Place:</strong> {{ job.working_place }}</p>
                <p class="job-detail left-align"><strong>Hours:</strong> {{ job.working_hours }}</p>
                <p class="job-detail left-align" v-if="isExpanded(job.id)"><strong>Created At:</strong> {{ new Date(job.created_at).toLocaleDateString('en-GB', { timeZone: 'UTC' }) }}</p>
                <p class="job-detail left-align" v-if="isExpanded(job.id)"><strong>Provider:</strong> {{ job.provider_name }}</p>
                <p class="job-detail left-align" v-if="isExpanded(job.id)"><strong>Contact:</strong> {{ job.phone_num }}</p>
                <p class="job-detail left-align" v-if="isExpanded(job.id)"><strong>Salary Range:</strong> {{ job.salary }}</p>

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
                  style="color: aliceblue;"
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
                <v-text-field v-model="application.name" label="Full Name" required></v-text-field>
                <v-text-field v-model="application.identification_card" label="Identification Card / Passport Number" required></v-text-field>
                <v-text-field v-model="application.seekeremail" label="Email Address" required></v-text-field> <!-- New email field -->

                <v-select
                  v-model="application.gender"
                  :items="['Male', 'Female']"
                  label="Gender"
                  required
                ></v-select>
                <v-text-field v-model="application.hp_number" label="Phone Number" required></v-text-field>
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
</template>

<script>
import NavbarSeeker from './jobseekers/NavbarSeeker.vue';
import axios from 'axios';

// Set the base URL for all axios requests
axios.defaults.baseURL = process.env.VUE_APP_API_URL;

export default {
  components: {
    NavbarSeeker
  },
  data() {
    return {
      loading: false, // Loading state
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
      },
      categoryIcons: {
        'Education': 'mdi-school',
        'Designer': 'mdi-pencil',
        'Sales': 'mdi-cart',
        'Finance': 'mdi-cash',
        'Information Technology': 'mdi-laptop',
        'Food & Beverage': 'mdi-food',
        'Marketing': 'mdi-bullhorn',
        'Arts': 'mdi-palette',
        'Customer Service': 'mdi-account-tie',
        'Human Resources': 'mdi-account-group',
        'Accountant': 'mdi-calculator',
      },
    };
  },
  methods: {
    onFileChange(event) {
      this.file = event.target.files[0];
    },
    fetchUsername() {
      const username = sessionStorage.getItem('username') || '';
      console.log('Username from fetchUsername:', username);
      return username;
    },
    async submitResume() {
      this.loading = true;
      console.log('Submitting resume with username:', this.username);

      if (!this.file) {
        this.message = "Please upload a file.";
        this.loading = false;
        return;
      }

      const formData = new FormData();
      formData.append('resume', this.file);

      try {
        const response = await axios.post('/jobs', formData, { withCredentials: true });
        console.log("Jobs response:", response.data); // Log the response data

        // Check if the backend detected that the file is not a valid resume
        if (response.data.message === "The uploaded file does not appear to be a valid resume.") {
          this.message = response.data.message;  // Display the error message from the backend
          this.predictedCategory = '';  // Clear category and job recommendations
          this.recommendedJob = '';
          this.jobs = [];
        } else {
          // Set the predicted category and recommended job if valid resume
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
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.message = error.response.data.message;  // Display the backend error message
          // Clear category and job recommendations on error
          this.predictedCategory = '';  
          this.recommendedJob = '';
          this.jobs = [];
        } else {
          this.message = "Error fetching jobs.";
          // Clear category and job recommendations on error
          this.predictedCategory = '';  
          this.recommendedJob = '';
          this.jobs = [];
        }
      } finally {
        this.loading = false; // Reset loading at the end
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
    async submitApplication() {
      this.loading = true;
      const formData = new FormData();
      formData.append('job_seeker_id', sessionStorage.getItem('user_id'));
      formData.append('job_id', this.selectedJobId);
      formData.append('name', this.application.name);
      formData.append('identification_card', this.application.identification_card);
      formData.append('seekeremail', this.application.seekeremail);
      formData.append('gender', this.application.gender);
      formData.append('hp_number', this.application.hp_number);
      if (this.application.resume_pdf) {
        formData.append('resume_pdf', this.application.resume_pdf);
      }

      try {
        const response = await axios.post('/apply', formData, { withCredentials: true });
        if (response.data.success) {
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
      } catch (error) {
        console.error('Error submitting application:', error);
        this.snackbar = {
          show: true,
          message: 'Sorry, application failed. Please try again.',
          color: 'red'
        };
      }finally {
        this.loading = false; // Reset loading at the end
      }
    }
  },
  async mounted() {
  this.username = this.fetchUsername();
  console.log('Fetched username:', this.username);

  try {
    if (!this.username && this.$route.path !== '/login') {
      console.log('Redirecting to /login');
      await this.$router.push('/login');
    }
  } catch (error) {
    if (error.name !== 'NavigationDuplicated') {
      console.error('Navigation error:', error);
    }
  }
}
};
</script>

<style scoped>
.resume-form {
  max-width: 800px;
  margin: auto;
}

.resume-background {
  background: url('@/assets/resumebackground1.jpg') no-repeat center center fixed;
  background-size: cover;
  min-height: 100vh; /* Ensure it takes the full viewport height */
  display: flex;
  justify-content: center;
  align-items: center;
}

.custom-card1 {
  background: linear-gradient(to bottom, rgba(131, 231, 126, 0.8), rgba(178, 183, 255, 0.8)) !important; /* Vertical gradient */
  border-radius: 30px !important; /* Increased radius for rounder corners */
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.15) !important; /* Softer shadow for depth */
  padding: 20px !important; /* Added padding for breathing space */
}

.custom-card2{
  background: linear-gradient(to bottom, rgba(255, 229, 144, 0.93), rgba(249, 239, 190, 0.908)) !important; /* Vertical gradient */
  border-radius: 30px !important; /* Increased radius for rounder corners */
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.15) !important; /* Softer shadow for depth */
  padding: 20px !important; /* Added padding for breathing space */
}

.custom-card3 {
  background-color: black !important; /* Solid black background */
  border-radius: 30px !important;
  
  color: white !important;
  width: 40%; /* Set a custom width */
  height: 80px !important; /* Fixed height */
  max-width: 400px; /* Limit the maximum width */
  margin: 0 auto !important; /* Center the card horizontally */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Keep the shadow effect */
}

.headline {
  color: #4CAF50; /* Green accent color */
}

.v-card-text p {
  color: #333; /* Dark gray text for readability */
}

.v-list-item-content span {
  color: blue !important; /* Green text for important items */
}

/* Copy the same styles from seekerhome.vue */

.job-card {
  background: linear-gradient(135deg, #e9f2ab, #77f6e1); /* Light gradient background */
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
  font-size: 1.2em; /* Increase font size */
  font-weight: bold;
  color: #3f51b5; /* Primary color for the job title */
}

.job-category {
  color: #757575; /* Grey color for the category */
  font-size: 0.9em;
}

.job-detail {
  color: #555; /* Darker text for details */
  font-size: 0.9em;
  margin-bottom: 5px;
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