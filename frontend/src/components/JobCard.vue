<template>
    <div class="job-card">
      <h3>{{ jobTitle }}</h3>
      <button @click="toggleDescription">{{ isDescriptionVisible ? 'Hide' : 'Show' }} Description</button>
      <p v-if="isDescriptionVisible">{{ jobDescription }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: "JobCard",
    props: {
      jobTitle: {
        type: String,
        required: true,
      },
      jobDescription: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        isDescriptionVisible: false,
      };
    },
    methods: {
      toggleDescription() {
        this.isDescriptionVisible = !this.isDescriptionVisible;
      },
    },
  };
  </script>
  
  <style scoped>
  .job-card {
    padding: 10px;
    border: 1px solid #ddd;
    margin: 10px;
  }
  button {
    margin-top: 10px;
  }
  </style>
  