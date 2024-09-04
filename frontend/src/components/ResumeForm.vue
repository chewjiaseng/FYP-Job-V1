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
              <v-list-item-content>Resume Categorization</v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>Resume Job Recommendation</v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>

      <div style="height: 30px;"></div> <!-- Spacer -->

      <v-card class="mt-5 pa-5" color="white" >
        <v-card-title class="headline">Upload Your Resume</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="submitResume">
            <v-file-input v-model="file" label="Choose file" required></v-file-input>
            <div style="margin-bottom: 20px;"> <!-- Add margin-bottom to the wrapper -->
              <v-btn type="submit" class="mt-3" style="background-color: #4CAF50; color: white;">Submit</v-btn>
            </div>
          </v-form>

          <v-alert v-if="message" type="info" class="text-center mt-3" style="background-color: red ; color: white;">{{ message }}</v-alert>

          <div v-if="predictedCategory">
            <v-divider class="my-5"style="margin-top: 10px;"></v-divider>
            <p class="text-center" style="margin-top: 15px;"><strong>Category:</strong> {{ predictedCategory }}</p>
            <p class="text-center"><strong>Recommended Job:</strong> {{ recommendedJob }}</p>
            <v-divider class="my-5"></v-divider>
          </div>
        </v-card-text>
      </v-card>
      
      <div style="height: 30px;"></div> <!-- Spacer -->

      <v-card class="mt-5 pa-5" color="primary" dark>
        <v-card-title class="headline">User List</v-card-title>
        <v-card-text>
          <v-simple-table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.name }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</v-app>
</template>

<script>
import NavbarSeeker from './jobseekers/NavbarSeeker.vue';
import axios from 'axios';

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
    this.username = sessionStorage.getItem('username');
  }
};
</script>

<style scoped>
.resume-form {
  max-width: 800px;
  margin: auto;
}
</style>
