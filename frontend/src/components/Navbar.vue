<template>
  <v-app-bar app class="custom-navbar">
    <v-container>
      <v-row no-gutters align="center">
        <v-col cols="auto">
          <v-toolbar-title class="custom-title">
            <img src="@/assets/logo.jpg" alt="Logo" class="logo-image" />
          </v-toolbar-title>
        </v-col>
        <v-spacer></v-spacer>
        <!-- Add v-btn-toggle to collapse buttons into a menu on small screens -->
        <v-col cols="auto" class="button-container d-none d-md-flex"> 
          <v-btn text class="custom-button" to="/">Home</v-btn>
          <v-btn text class="custom-button" to="/job-search">Job Seeker</v-btn>
          <v-btn text class="custom-button" to="/job-provide">Job Provide</v-btn>
          <!-- <v-btn text class="custom-button" to="/about-us">About Us</v-btn> -->
          <v-btn text class="custom-button" to="/login">Login</v-btn>
        </v-col>

        <!-- Mobile Hamburger Menu for smaller screens -->
        <v-col class="d-flex d-md-none">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-menu</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item link to="/">Home</v-list-item>
              <v-list-item link to="/job-search">Job Search</v-list-item>
              <v-list-item link to="/job-provide">Job Provide</v-list-item>
              <!-- <v-list-item link to="/about-us">About Us</v-list-item> -->
              <v-list-item link to="/login">Login</v-list-item>
            </v-list>
          </v-menu>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<style >
.custom-navbar {
  background-color: #201a94 !important; /* Replace with your favorite color */
}

.custom-title {
  font-size: 1.5rem;
  font-family: 'Arial', sans-serif;
}

.button-container {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.custom-button {
  color: white !important; /* Change text color to white */
  font-size: 1rem;
}

.custom-button:hover {
  color: #FFD700; /* Text color on hover */
}

.logo-image {
  margin-top: 20%;
  height: 55px;
  width: auto;
}

@media (max-width: 600px) {
  .logo-image {
    height: 45px;
  }

  .custom-button {
    font-size: 0.875rem;
  }
}
</style>
