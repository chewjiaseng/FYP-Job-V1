<template>
    <div class="resume-form">
      <div class="container" style="margin-top:20px;background:#013a5c;color:white;">
        <h1 class="text center">Resume Screening AI Base System</h1>
        <p>This system supports TXT and PDF files to be uploaded and will work on the following:</p>
        <ul>
          <li>Resume Categorization</li>
          <li>Resume Job Recommendation</li>
        </ul>
      </div>
  
      <div class="container" style="background:#013a5c;color:white;">
        <h2>Upload Your Resume</h2>
        <form @submit.prevent="submitResume">
          <input type="file" @change="onFileChange" required>
          <input type="submit" value="Submit">
        </form>
  
        <p v-if="message" class="text-center">{{ message }}</p>
        <div v-if="predictedCategory">
          <br><hr><br>
          <p class="text-center"><b><strong>Category:</strong></b> {{ predictedCategory }}</p>
          <p class="text-center"><b><strong>Recommended Job:</strong></b> {{ recommendedJob }}</p>
          <br><hr><br>
        </div>
      </div>
  
      <div class="container" style="background:#013a5c;color:white;">
        <h2>User List</h2>
        <table>
          <tr>
            <th>ID</th>
            <th>Name</th>
          </tr>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
          </tr>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        file: null,
        message: '',
        predictedCategory: '',
        recommendedJob: '',
        users: [],
      };
    },
    methods: {
      onFileChange(event) {
        this.file = event.target.files[0];
      },
      async submitResume() {
        if (!this.file) {
          this.message = "Please upload a file.";
          return;
        }
  
        const formData = new FormData();
        formData.append('resume', this.file);
  
        try {
          const response = await axios.post('/pred', formData);
          this.predictedCategory = response.data.predicted_category;
          this.recommendedJob = response.data.recommended_job;
          this.message = response.data.message || '';
        } catch (error) {
          this.message = "Error uploading file. Please try again.";
        }
      },
      async fetchUsers() {
        try {
          const response = await axios.get('/users');
          this.users = response.data.users;
        } catch (error) {
          this.message = "Error fetching users.";
        }
      }
    },
    mounted() {
      this.fetchUsers();
    }
  };
  </script>
  
  <style scoped>
  /* Add your custom styles here */
  </style>
  