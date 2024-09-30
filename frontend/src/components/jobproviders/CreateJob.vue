<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col xs12 sm10 md8 lg6 xl4>
        <v-card class="create-job-card">
          <v-card-title class="title">
            <h2>Create Job</h2>
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="createJob">
              <v-text-field
                v-model="job_name"
                label="Job Name"
                required
                outlined
                class="compact-text-field"
              ></v-text-field>
              <v-text-field
                v-model="job_category"
                label="Job Category"
                required
                outlined
                class="compact-text-field"
              ></v-text-field>
              <v-text-field
                v-model="salary"
                label="Salary"
                required
                outlined
                class="compact-text-field"
              ></v-text-field>
              <v-text-field
                v-model="working_place"
                label="Working Place"
                required
                outlined
                class="compact-text-field"
              ></v-text-field>
              <v-text-field
                v-model="working_hours"
                label="Working Hours"
                required
                outlined
                class="compact-text-field"
              ></v-text-field>
              <v-textarea
                v-model="job_description"
                label="Job Description"
                required
                outlined
                class="compact-text-area"
              ></v-textarea>
              
              <!-- Display User ID -->
              <v-chip class="ma-2 user-id-chip">
                <span>User ID: {{ userId }}</span>
              </v-chip>

              <!-- Button Container -->
              <div class="button-container">
                <v-btn @click="goBack" class="back-button" color="blue">Back</v-btn>
                <v-btn color="green" type="submit" class="create-button" :loading="loading" :disabled="loading">Create</v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'CreateJob',
  data() {
    return {
      loading: false,
      job_name: '',
      job_category: '',
      salary: '',
      working_place: '',
      working_hours: '',
      job_description: '',
      userId: sessionStorage.getItem('userId') || '',  // Retrieve the user ID from sessionStorage
    };
  },
  methods: {
  createJob() {
    this.loading = true;

    // Check if any required fields are empty
    if (!this.job_name || !this.job_category || !this.salary || 
        !this.working_place || !this.working_hours || !this.job_description) {
      this.loading = false; // Reset loading state
      alert('Please fill in the information!'); // Display alert
      return; // Prevent further execution
    }

    const jobData = {
      job_name: this.job_name,
      job_category: this.job_category,
      salary: this.salary,
      working_place: this.working_place,
      working_hours: this.working_hours,
      job_description: this.job_description,
      user_id: this.userId,  // Include user ID in the job data
    };

    // Use VUE_APP_API_URL from the environment
    const apiUrl = process.env.VUE_APP_API_URL;
    fetch(`${apiUrl}/create-job`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',  // Ensure the server knows you're expecting JSON
        'Authorization': `Bearer ${sessionStorage.getItem('token')}` // If you're using token-based auth
      },
      body: JSON.stringify(jobData),
      credentials: 'include',  // Include credentials to maintain session
    })
      .then((response) => {
        if (!response.ok) {
          // Handle non-2xx HTTP responses
          return response.json().then((errorData) => {
            throw new Error(errorData.error || 'An error occurred');
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data.message) {
          alert('Job created successfully!');
          this.$router.push('/provider-home');
        } else {
          alert('Error creating job: ' + data.error);
        }
      })
      .catch((error) => {
        console.error('Error creating job:', error.message);
      }).finally(() => {
        // Reset loading state after the process is completed
        this.loading = false;
      });
  },
  goBack() {
    this.$router.push('/provider-home');
  }
},
};
</script>

<style scoped>
.create-job-card {
  background-color: #f9f9f9; /* Light grey background */
  border-radius: 12px; /* Rounded corners */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* Soft shadow */
  padding: 15px; /* Reduced inner padding */
}

.title {
  margin-bottom: 15px; /* Reduced bottom margin */
  color: #333; /* Darker text color for the title */
  text-align: center; /* Centered title */
}

.user-id-chip {
  background-color: #d1e7dd; /* Light green background for user ID */
  color: #0f5132; /* Darker text color */
}

.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 15px; /* Space between the textarea and buttons */
}

.back-button {
  background-color: rgb(0, 183, 255) !important;
  color: white !important;
}

.create-button {
  background-color: #28a745 !important; /* Green color */
  color: white !important; /* White text */
  transition: background-color 0.3s ease; /* Transition effect */
}

.create-button:hover {
  background-color: #218838 !important; /* Darker green on hover */
}

.v-text-field, .v-textarea {
  margin-bottom: 15px; /* Reduced space between fields */
  max-width: 100%; /* Ensure text fields use full width */
  width: 100%; /* Optional: Make it responsive */
}

.compact-text-field {
  min-height: 45px; /* Reduced height for text fields */
}

.compact-text-area {
  min-height: 100px; /* Adjust height for the text area */
}

.v-card-title {
  background-color: #e9ecef; /* Light grey background for title */
  padding: 10px; /* Reduced padding for the title */
  border-radius: 10px;
}
</style>