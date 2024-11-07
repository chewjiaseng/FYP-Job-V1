<template>
  <v-container>
    <!-- Include the NavbarSeeker component -->
    <NavbarSeeker />
    <h1>Your Job Applications</h1>

    <!-- Loading Indicator -->
    <v-progress-circular v-if="loading" indeterminate color="primary" class="ma-2"></v-progress-circular>

    <!-- Simple Table for Applications -->
    <v-simple-table class="aligned-table">
      <thead>
        <tr>
          <th style="width: 18%">Applicant Name</th>
          <th style="width: 15%">ID Card</th>
          <th style="width: 10%">Gender</th>
          <th style="width: 15%">Phone</th>
          <th style="width: 12%">Applied At</th>
          <th style="width: 12%">Job Name</th>
          <th style="width: 15%">Status</th>
          <th style="width: 12%">Resume Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(application, index) in applications" :key="index">
          <td>{{ application.name }}</td>
          <td>{{ application.identification_card }}</td>
          <td>{{ application.gender }}</td>
          <td>{{ application.hp_number }}</td>
          <td>{{ new Date(application.applied_at).toLocaleDateString() }}</td>
          <td>{{ application.job_name }}</td>
          <td :style="{ fontWeight: 'bold' }">
  {{ application.status }}
</td>
          <td>
            <!-- New Resume Status Column -->
            <v-chip :color="application.resume_pdf ? 'green' : 'red'" dark small>
              {{ application.resume_pdf ? 'Available' : 'Not Available' }}
            </v-chip>
          </td>
          <td>
            <v-btn @click="viewResume(application.resume_pdf)" color="primary" style="margin-top: 10px;">
              View Resume
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-simple-table>
    
    <div v-if="applications.length === 0">
      <p>No applications found for you.</p>
    </div>

    <!-- Snackbar for notifications -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarType"
      bottom
      multi-line
    >
      {{ snackbarText }}
      <v-btn text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import NavbarSeeker from './NavbarSeeker.vue';

export default {
  components: {
    NavbarSeeker,
  },
  data() {
    return {
      applications: [],  // To hold the applications data
      loading: false,    // To show loading indicator
      snackbar: false,   // Snackbar visibility
      snackbarText: '',  // Snackbar message
      snackbarType: '',  // Snackbar type ('success', 'warning', etc.)
    };
  },
  mounted() {
    this.fetchApplications(); // Fetch applications when the component is mounted
  },
  methods: {
    async fetchApplications() {
      this.loading = true; // Start loading
      const apiUrl = process.env.VUE_APP_API_URL;
      try {
        const response = await fetch(`${apiUrl}/checkcurrentapplications`, {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();

        if (data.error) {
          alert(data.error);
        } else {
          this.applications = data;  // Set the applications data from the response
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        this.loading = false; // End loading
      }
    },
    viewResume(resumePdf) {
      if (!resumePdf) {
        this.snackbarText = "No resume available";
        this.snackbarType = "warning";
        this.snackbar = true;
        return;
      } 
      // Decode the base64 PDF and open it in a new tab
      const blob = new Blob([this.base64ToArrayBuffer(resumePdf)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.click();
    },
    base64ToArrayBuffer(base64) {
      const binaryString = atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
    }
  },
};
</script>

<style scoped>
h1 {
  color: #201a94;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
</style>
