<template>
  <v-container>
    <!-- Include the Navbar component -->
    <Navbar />

    <h1>Login Page</h1>

    <!-- Username/Email Text Box -->
    <v-text-field
      v-model="identifier"
      label="Username / E-mail"
      outlined
      clearable
      class="input-field"
    ></v-text-field>

    <!-- Password Text Box with Eye Icon -->
    <v-text-field
      v-model="password"
      label="Password"
      :type="showPassword ? 'text' : 'password'"
      outlined
      clearable
      class="input-field"
      append-icon="mdi-eye"
      @click:append="togglePasswordVisibility"
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

    <!-- Login Button -->
    <v-btn
      @click="login"
      class="login-button"
      style="background-color: black; color: white;"
    >
      Login
    </v-btn>

    <!-- Create Account Link -->
    <v-btn text color="secondary" class="create-account" @click="goToSignup">
      Create a new account
    </v-btn>
  </v-container>
</template>

<script>
import axios from 'axios';
import Navbar from './Navbar.vue';

export default {
  name: 'Login',
  components: {
    Navbar
  },
  data() {
    return {
      identifier: '',  // Username or email
      password: '',
      roles: ['Job Seeker', 'Job Provider'],
      selectedRole: '',
      showPassword: false
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    async login() {
      try {
        const response = await axios.post('http://localhost:5000/login', {
          identifier: this.identifier,
          password: this.password,
          role: this.selectedRole
        });

        if (response.data.redirect) {
          localStorage.setItem('userRole', this.selectedRole);
          this.$router.push(response.data.redirect);
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        if (error.response) {
          alert(error.response.data.error);
        } else {
          alert('An error occurred. Please try again later.');
        }
      }
    },
    goToSignup() {
      this.$router.push('/signup');
    }
  }
};
</script>

<style scoped>
.input-field {
  margin-bottom: 20px;
}

.login-button {
  margin-top: 20px;
}

.create-account {
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
  box-sizing: border-box;
}
</style>
