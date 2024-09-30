<template>
  <div>
    <!-- Navbar should stay intact at the top -->
    <Navbar />

    <v-container fluid class="d-flex justify-center align-center login-container">
      <!-- Left side for the image with fixed ratio -->
      <v-row class="d-none d-md-flex left-image">
        <v-col>
          <v-img 
            src="@/assets/image3.jpg" 
            alt="Login Illustration" 
            class="fixed-ratio-image" 
            contain
          ></v-img>
        </v-col>
      </v-row>

      <v-row class="login-form right-background">
  <v-col>
    <h2 class="welcome-text">Welcome to EasyPart</h2>

    <!-- Username/Email Text Box -->
    <v-text-field
      v-model="identifier"
      style="background-color: white; border-radius: 8px;" 
      label="Username / E-mail"
      
      clearable
      class="input-field smaller-field"
    ></v-text-field>

    <!-- Password Text Box with Eye Icon -->
   <!-- Password Text Box with Eye Icon -->
    <v-text-field
      v-model="password"
      label="Password"
      :type="showPassword ? 'text' : 'password'"
      clearable
      class="input-field smaller-field"
      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append="togglePasswordVisibility"
      style="background-color: white; border-radius: 8px;" 
    ></v-text-field>


    <!-- Role Selection Box -->
    <v-select
      v-model="selectedRole"
      :items="roles"
      label="Select Your Role"
      
      class="role-select smaller-field"
    ></v-select>

    <!-- Login Button -->
    <v-btn
      @click="login"
      class="login-button smaller-field"
      style="background-color: black; color: white;"
      :loading="loading"
      :disabled="loading"
    >
      Login
    </v-btn>

    <!-- Create Account Link -->
    <v-btn text color="secondary" class="create-account" @click="goToSignup">
      Register a new account
    </v-btn>
  </v-col>
</v-row>
    </v-container>
  </div>
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
      showPassword: false,
      loading: false, // Loading state for the login process
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    
    login() {
      // Set loading to true when login is initiated
      this.loading = true;

      const apiUrl = process.env.VUE_APP_API_URL;

      const payload = {
        identifier: this.identifier,
        password: this.password,
        role: this.selectedRole // Include the role in the payload
      };

      fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          localStorage.setItem('isAuthenticated', 'true'); // Set authentication status
          sessionStorage.setItem('username', this.identifier); // Store username in sessionStorage
          localStorage.setItem('userRole', this.selectedRole); // Store user role

          console.log('Stored username:', sessionStorage.getItem('username')); // Debugging line
          this.$store.dispatch('updateUsername', this.identifier);
          this.$router.push(data.redirect);
        } else {
          alert(data.error);
        }
        this.loading = false;
      })
      .catch(error => {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again later.');
        this.loading = false;
      });
    },
    goToSignup() {
      this.$router.push('/signup');
    }
  }
};
</script>


<style scoped>
/* Ensure the v-container takes full height */
.login-container {
  height: 100vh;   /* Full page height */
  padding: 0 !important;      /* Remove padding */
  margin: 0 !important;       /* Remove margin */
  position: absolute; /* Set absolute positioning */
  top: 0;          /* Align to the top of the viewport */
  left: 0;
  right: 0;
}

.v-application--wrap {
  margin-top: 0 !important; /* Ensure no margin at the top */
}


/* Left image styling */
.left-image {
  flex: 6;          /* Set this for the 7:3 ratio */
  height: 100%;     /* Full height */
  margin: 0;        /* Remove margin */
  padding: 0;       /* Remove padding */
  overflow: hidden; /* Prevent overflow */
}

/* Adjust fixed-ratio-image to respect max height */
.fixed-ratio-image {
  width: 80%; /* Make image width 100% of its container */
  height: auto; /* Maintain aspect ratio */
  max-height: 100%; /* Ensure it doesn't exceed the height of its parent */
  object-fit: cover; /* Cover the area while maintaining aspect ratio */
}

/* Right side with new background color */
.right-background {
  flex: 4; /* Set this for the 7:3 ratio */
  background-color: #57b2e7; /* Set your preferred background color */
  padding: 40px; /* Add some padding to make the form look more structured */
  display: flex; /* Use flexbox to stretch content */
  flex-direction: column; /* Align children vertically */
  justify-content: center; /* Center elements vertically */
  height: 100vh !important; /* Ensure the right container takes full viewport height */
  margin: 0 !important;        /* Remove margin */
}

/* Smaller fields */
.smaller-field {
  font-size: 14px; /* Smaller font size */
  padding: 8px; /* Smaller padding */
}

/* Input fields and select styling */
.input-field {
  margin-bottom: 15px; /* Add margin at the bottom for spacing */
}

/* Adjust the input control container */
.input-field .v-input__control {
  background-color: white; /* Set white background for the input control */
  border: none; /* Remove the outer border */
  border-radius: 8px; /* Rounded corners */
  box-sizing: border-box; /* Ensure padding and border are included in width and height */
}

/* Style for the input itself */
.input-field input {
  background-color: white; /* White background for input */
  padding: 10px; /* Add padding for comfort */
  border: none; /* Remove inner border */
  border-radius: 8px; /* Rounded corners */
  width: 100%; /* Full width of the container */
}

/* Ensure that the input has no outline when focused */
.input-field input:focus {
  outline: none; /* Remove default outline */
}

/* Maintain the border color when focused */
.input-field .v-input__control:focus-within {
  border-color: #3f51b5; /* Maintain the border color when focused */
}

/* Role selection box styling */
.role-select {
  margin-bottom: 15px; /* Add margin at the bottom for spacing */
  background-color: white; /* Ensure background is white */
  border-radius: 8px; /* Rounded corners */
}


/* Ensure the button maintains a clean look */
.login-button {
  margin-top: 15px;
  padding: 12px; /* Adjust padding for a more spacious button */
  width: 100%; /* Make the button full width */
  font-size: 16px; /* Larger font size */
  font-weight: bold; /* Bold text */
  border-radius: 12px; /* Rounded corners */
  background-image: linear-gradient(45deg, #ff5858, #f857a6); /* Gradient background */
  color: white; /* White text */
  transition: transform 0.2s ease, box-shadow 0.2s ease; /* Smooth transition */
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16); /* Add subtle shadow */
}

/* Add hover effect for button interaction */
.login-button:hover {
  transform: translateY(-2px); /* Slightly lift the button on hover */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2); /* Increase shadow on hover */
}

/* Add active effect for pressing the button */
.login-button:active {
  transform: translateY(0); /* Return the button to its original position */
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16); /* Return shadow to original */
}


/* Create account link styling */
.create-account {
  margin-top: 15px;
  text-decoration: underline;
  cursor: pointer;
  color: #3f51b5; /* Primary color for text link */
  transition: color 0.3s; /* Transition effect */
}

.create-account:hover {
  color: #1a1a1a; /* Darken text on hover */
}

.welcome-text {
  font-size: 24px; /* Slightly smaller font for the welcome text */
  margin-bottom: 20px;
}

</style>