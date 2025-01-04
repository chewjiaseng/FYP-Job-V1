<template>
  <v-app-bar app class="custom-navbar">
    <v-container class="pa-0">
      <v-row no-gutters align="center">
        <v-col cols="auto">
          <v-toolbar-title class="custom-title">
            <img src="@/assets/logo.jpg" alt="Logo" class="logo-image" />
          </v-toolbar-title>
        </v-col>
        <v-spacer></v-spacer>

        <!-- Desktop buttons -->
        <v-col cols="auto" class="button-container d-none d-md-flex"> 
          <v-btn text class="custom-button" to="/seeker-home">Home</v-btn>
          <v-btn text class="custom-button" to="/job-recommendation">Job Recommendation</v-btn>
          <v-btn text class="custom-button" to="/check-applications">Applications</v-btn> <!-- Updated Route -->

          <v-btn text class="custom-button logout-button" @click="logout">Logout</v-btn>
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
              <v-list-item link to="/seeker-home">Home</v-list-item>
              <v-list-item link to="/job-recommendation">Job Recommendation</v-list-item>
              <v-list-item link @click="logout">Logout</v-list-item>
            </v-list>
          </v-menu>
        </v-col>
        <v-spacer></v-spacer>

        <!-- Username on the right side -->
        <v-col cols="auto" class="right-user">
          <span v-if="username" class="username" style="color: aliceblue;">{{ username }}</span>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['username']),
  },
  methods: {
    logout() {
      this.$store.dispatch('updateUsername', '');
      sessionStorage.removeItem('username');
      sessionStorage.removeItem("userId");
      sessionStorage.removeItem("username");
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');

      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.custom-navbar {
  background-color: #201a94 !important;
  margin: 0;
  padding: 0;
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
  color: black;
  font-size: 1rem;
}

.custom-button:hover {
  color: #ffd700;
}

.logout-button {
  color: red !important;
}

.logo-image {
  margin-top: 20%;
  height: 55px;
  width: auto;
}

.right-user {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 5px;
  height: 100%;
}

.username {
  padding-top: 5px;
  color: black;
  font-size: 1rem;
  line-height: 1.5;
}

@media (max-width: 600px) {
  .logo-image {
    height: 45px;
  }

  .custom-button {
    font-size: 0.875rem;
  }

  .right-user {
    justify-content: center;
    font-size: 0.875rem;
  }
}
</style>
