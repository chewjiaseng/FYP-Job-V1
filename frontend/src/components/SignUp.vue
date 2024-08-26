<template>
    <v-container>
      <!-- Include the Navbar component -->
      <Navbar />
  
      <h1>Sign Up Page</h1>
  
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
        append-icon="mdi-eye"
        @click:append="togglePasswordVisibility"
        v-model="password"
      ></v-text-field>
  
      <!-- Role Selection Box with Placeholder -->
      <div class="role-select">
        <select v-model="selectedRole" class="select-field">
          <option disabled value="">Select Your Role</option>
          <option v-for="role in roles" :key="role" :value="role">
            {{ role }}
          </option>
        </select>
      </div>
  
      <!-- Register Button -->
      <v-btn
        class="register-button"
        style="background-color: black; color: white;"
        @click="register"
      >
        Register
      </v-btn>
  
      <!-- Already have an account Link -->
      <v-btn text color="secondary" class="already-account" @click="goToLogin">
        Already have an account? Log In
      </v-btn>
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
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    async register() {
      if (!this.username || !this.email || !this.password || !this.selectedRole) {
        alert('Please fill in all fields');
        return;
      }

      const payload = {
        username: this.username,
        email: this.email,
        password: this.password,
        role: this.selectedRole,
      };

      try {
        const response = await axios.post('http://127.0.0.1:5000/signup', payload);
        if (response.data.success) {
          alert('Registration successful');
          this.$router.push('/login');
        } else {
          alert(response.data.message || 'Registration failed');
        }
      } catch (error) {
        console.error('Error during registration:', error);
        alert('An error occurred. Please try again later.');
      }
    },
    goToLogin() {
      this.$router.push('/login');
    },
  },
};

  </script>
  
  <style scoped>
  .input-field {
    margin-bottom: 20px;
  }
  
  .register-button {
    margin-top: 20px;
  }
  
  .already-account {
    margin-top: 10px;
    text-decoration: underline;
    cursor: pointer;
  }
  
  .role-select {
    margin-bottom: 20px;
  }
  
  .select-field {
    width: 100%;
    padding: 8px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box; /* Ensures padding and border are included in the total width */
  }
  </style>
  