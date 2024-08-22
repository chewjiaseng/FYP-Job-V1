<!-- src/components/HomePage.vue -->
<template>
  <v-container class="homepage" fill-height>
    <v-row align="center" justify="center">
      <v-col class="text-center">
        <h1>Welcome to Home Page</h1>
        <v-btn @click="goToResumeForm" class="mt-5" color="black">Go to Resume Form</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  methods: {
    goToResumeForm() {
      this.$router.push({ name: 'resumeForm' });
    }
  }
}
</script>

<style scoped>
.homepage {
  background-color: #f5f5f5;
}
</style>
