<template>
  <v-container class="signup-container">
    <!-- Include the Navbar component -->
    <Navbar />

    <v-row class="justify-center">
      <v-col cols="12" md="6" class="signup-form">
        <h1 class="signup-title">Create Your Account</h1>

        <!-- Username Text Box -->
        <v-text-field
          label="Username"
          outlined
          clearable
          class="input-field"
          v-model="username"
        ></v-text-field>

        <!-- Email Text Box -->
        <v-text-field
          label="Email"
          outlined
          clearable
          class="input-field"
          v-model="email"
        ></v-text-field>

        <!-- Password Text Box with Eye Icon -->
        <v-text-field
          label="Password"
          :type="showPassword ? 'text' : 'password'"
          outlined
          clearable
          class="input-field"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="togglePasswordVisibility"
          v-model="password"
        ></v-text-field>

        <!-- Role Selection Box with Placeholder -->
        <v-select
          v-model="selectedRole"
          :items="roles"
          label="Select Your Role"
          outlined
          class="input-field"
        ></v-select>

        <!-- Register Button -->
        <v-btn
          class="register-button"
          @click="register"
          :loading="loading"
          :disabled="loading"
        >
          Register
        </v-btn>

        <!-- Already have an account Link -->
        <v-btn text class="already-account" @click="goToLogin">
          Already have an account? Log In
        </v-btn>

        <!-- Error Message -->
        <v-alert v-if="errorMessage" type="error" dismissible>
          {{ errorMessage }}
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Navbar from './Navbar.vue';
import axios from 'axios';

export default {
  name: 'SignUp',
  components: {
    Navbar,
  },
  data() {
    return {
      username: '',
      email: '',
      password: '',
      roles: ['Job Seeker', 'Job Provider'],
      selectedRole: '',
      showPassword: false,
      loading: false,
      errorMessage: '',  // To store error messages
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    async register() {
  // Reset error message before starting the registration process
  this.errorMessage = '';

  if (!this.username || !this.email || !this.password || !this.selectedRole) {
    alert('Please fill in all fields');
    return;
  }

  this.loading = true;

  const payload = {
    username: this.username,
    email: this.email,
    password: this.password,
    role: this.selectedRole,
  };

  const apiUrl = process.env.VUE_APP_API_URL;

  try {
    const response = await axios.post(`${apiUrl}/signup`, payload);
    
    if (response.data.success) {
      alert('Registration successful');
      this.clearForm();
    } else {
      // Show error message from backend response
      this.errorMessage = response.data.error || 'Registration failed';
    }
  } catch (error) {
    console.error('Error during registration:', error);
    // If there's an error, show the message returned from the backend
    this.errorMessage = error.response?.data?.error || 'An error occurred. Please try again later.';
  } finally {
    this.loading = false;
  }
},
    clearForm() {
      this.username = '';
      this.email = '';
      this.password = '';
      this.selectedRole = '';
    },
    goToLogin() {
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
.signup-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f4f7f9;
  padding: 0 20px;
}

.signup-form {
  background-color: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.signup-title {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.input-field {
  margin-bottom: 20px;
}

.register-button {
  width: 100%;
  background-image: linear-gradient(45deg, #42a5f5, #478ed1);
  color: white;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.register-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.already-account {
  display: block;
  text-align: center;
  margin-top: 20px;
  color: #42a5f5;
  font-weight: bold;
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.2s ease;
}

.already-account:hover {
  color: #1e88e5;
}

.signup-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('@/assets/image1.jpg'); /* Path to the image */
  background-size: cover; /* Ensure the image covers the entire area */
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Prevent the image from repeating */
}

</style>
