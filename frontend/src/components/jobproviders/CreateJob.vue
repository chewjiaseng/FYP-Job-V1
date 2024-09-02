<template>
  <v-container fluid>
    <v-layout column align-center justify-center class="form-container">
      <v-flex xs12 sm10 md8 lg6 xl4>
        <v-form @submit.prevent="createJob">
          <v-text-field v-model="job_name" label="Job Name" required></v-text-field>
          <v-text-field v-model="job_category" label="Job Category" required></v-text-field>
          <v-text-field v-model="salary" label="Salary" required></v-text-field>
          <v-text-field v-model="working_place" label="Working Place" required></v-text-field>
          <v-text-field v-model="working_hours" label="Working Hours" required></v-text-field>

          <v-textarea v-model="job_description" label="Job Description" required></v-textarea>

          <!-- Display User ID -->
          <div>
            <v-chip>
              <span>User ID: {{ userId }}</span>
            </v-chip>
          </div>

          <!-- Button Container -->
          <div class="button-container">
            <v-btn @click="goBack" class="back-button" color="blue">Back</v-btn>
            <v-btn color="black" type="submit" class="create-button">Create</v-btn>
          </div>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'CreateJob',
  data() {
    return {
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
    const jobData = {
      job_name: this.job_name,
      job_category: this.job_category,
      salary: this.salary,
      working_place: this.working_place,
      working_hours: this.working_hours,
      job_description: this.job_description,
      user_id: this.userId,  // Include user ID in the job data
    };

    fetch('http://localhost:5000/create-job', {
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
      });
  },
  goBack() {
    this.$router.push('/provider-home');
  }
},
};
</script>

<style scoped>
.form-container {
  max-width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

/* Button Container for positioning the buttons */
.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px; /* Space between the textarea and buttons */
}

/* Styling the Back button */
.back-button {
  margin-right: auto;
}

/* Styling the Create button */
.create-button {
  margin-left: auto;
}
</style>
