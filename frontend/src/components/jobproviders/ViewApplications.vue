<template>
  <v-app>
    <v-container>
      <v-btn @click="goBack" color="blue">
        Back to Provider Home
      </v-btn>

      <h1>Applications for Your Jobs</h1>

      <v-data-table
        :headers="headers"
        :items="applications"
        item-key="application_id"
        class="elevation-1"
        dense
      >
        <template v-slot:item="{ item }">
          <tr>
            <td>{{ item.applicant_name }}</td>
            <td>{{ item.identification_card }}</td>
            <td>{{ item.gender }}</td>
            <td>{{ item.hp_number }}</td>
            
            <td>{{ new Date(item.applied_at).toLocaleDateString() }}</td>
            <td>{{ item.job_name }}</td>
            <td>{{ item.job_category }}</td>
            <td>{{ item.working_place }}</td>
            <td>
              <!-- Status with edit icon -->
              {{ item.status }}
              <v-icon @click="editStatus(item)">mdi-pencil</v-icon>
            </td>
            <td>
              <v-btn @click="viewResume(item.resume_pdf)" color="primary">
                View Resume
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>

      <!-- Dialog for no resume -->
      <v-dialog v-model="noResumeDialog" max-width="500">
        <v-card>
          <v-card-title class="text-h5">Resume Not Available</v-card-title>
          <v-card-text>The user did not provide any resume.</v-card-text>
          <v-card-actions>
            <v-btn color="primary" text @click="noResumeDialog = false">
              OK
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Dialog for editing status -->
      <v-dialog v-model="editStatusDialog" max-width="400">
        <v-card>
          <v-card-title>Edit Status</v-card-title>
          <v-card-text>
            <v-select
              v-model="selectedStatus"
              :items="['Pending', 'Received']"
              label="Select Status"
            ></v-select>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="updateStatus">Save</v-btn>
            <v-btn text @click="editStatusDialog = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Snackbar for success message -->
      <v-snackbar v-model="successSnackbar" color="success" top>
        Update status successfully
        <v-btn color="white" text @click="successSnackbar = false">
          Close
        </v-btn>
      </v-snackbar>

      <!-- Snackbar for error message -->
      <v-snackbar v-model="errorSnackbar" color="error" top>
        Update status failed
        <v-btn color="white" text @click="errorSnackbar = false">
          Close
        </v-btn>
      </v-snackbar>

    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ViewApplications',
  data() {
    return {
      headers: [
        { text: 'Applicant Name', value: 'applicant_name' },
        { text: 'ID Card', value: 'identification_card' },
        { text: 'Gender', value: 'gender' },
        { text: 'Phone Number', value: 'hp_number' },
      
        { text: 'Applied At', value: 'applied_at' },
        { text: 'Job Name', value: 'job_name' },
        { text: 'Job Category', value: 'job_category' },
        { text: 'Working Place', value: 'working_place' },
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      applications: [],
      noResumeDialog: false, // For handling the dialog
      editStatusDialog: false,
      selectedStatus: '',
      currentApplication: null, // Store the current application to update
      successSnackbar: false, // Controls visibility of the success message
      errorSnackbar: false,   // Controls visibility of the error message
    };
  },
  mounted() {
    this.fetchApplications();
  },
  methods: {
    fetchApplications() {
      axios
        .get('http://localhost:5000/provider-applications', {
          withCredentials: true,
        })
        .then((response) => {
          this.applications = response.data;
        })
        .catch((error) => {
          console.error('Error fetching applications:', error);
        });
    },
    goBack() {
      this.$router.push('/provider-home');
    },
    viewResume(resumePdf) {
      if (!resumePdf) {
        // If the resume is empty, show the dialog
        this.noResumeDialog = true;
        return;
      }

      // Convert the base64 string back to a Blob
      const byteCharacters = atob(resumePdf); // Decode base64
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      // Create a URL for the blob and open it
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    },
    editStatus(item) {
      this.currentApplication = item;
      this.selectedStatus = item.status;
      this.editStatusDialog = true;
    },
     updateStatus() {
      if (this.currentApplication) {
        const updatedStatus = this.selectedStatus;
        const applicationId = this.currentApplication.application_id;

        axios
          .put(`http://localhost:5000/application/${applicationId}/status`, {
            status: updatedStatus,
          }, {
            withCredentials: true,
          })
          .then(() => {
            this.currentApplication.status = updatedStatus;
            this.editStatusDialog = false;
            this.successSnackbar = true; // Show success message
          })
          .catch((error) => {
            console.error('Error updating status:', error);
            this.errorSnackbar = true; // Show error message
          });
      }
    },
  },
};
</script>

<style scoped>
/* Add any additional styling for the component if needed */
</style>
