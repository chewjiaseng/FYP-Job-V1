<template>
  <v-container fluid class="manage-user-container">
    <!-- User Table -->
    <v-simple-table class="aligned-table">
      <thead>
        <tr>
          <th style="width: 18%">Username</th>
          <th style="width: 30%">Email</th>
          <th style="width: 17%">Role</th>
          <th style="width: 20%">Password</th>
          <th style="width: 15%">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.username">
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>{{ user.password ? '******' : 'N/A' }}</td>
          <td>
            <v-icon @click="editUser(user)" class="action-icon">mdi-pencil</v-icon>
            <v-icon @click="confirmDelete(user)" class="action-icon">mdi-delete</v-icon>
          </td>
        </tr>
      </tbody>
    </v-simple-table>

    <!-- Back Button -->
    <v-row justify="space-between" class="button-row">
      <v-btn color="primary" @click="goBack" class="back-button">Back</v-btn>
      <v-btn color="green" icon @click="dialogAddUser = true" class="add-button" style="border-radius: 50%;">
        <v-icon style="color: white;">mdi-plus</v-icon>
      </v-btn>

    </v-row>

    <!-- Edit User Dialog -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title class="dialog-title">Edit User</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field v-model="editUserData.username" label="Username"></v-text-field>
            <v-text-field v-model="editUserData.email" label="Email"></v-text-field>

            <v-text-field
              v-model="editUserData.password"
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="togglePasswordVisibility"
            ></v-text-field>

            <v-text-field v-model="editUserData.role" label="Role" :readonly="true" class="readonly-field"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="updateUser" :loading="loading" :disabled="loading">Update</v-btn>
          <v-btn @click="dialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="dialog-title">Confirm Delete</v-card-title>
        <v-card-text>Are you sure you want to delete this user?</v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="deleteUser(deleteUserData)" :loading="loading" :disabled="loading">Yes</v-btn>
          <v-btn @click="deleteDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add User Dialog -->
    <v-dialog v-model="dialogAddUser" max-width="600px">
      <v-card>
        <v-card-title class="dialog-title">Add User</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field v-model="newUser.username" label="Username"></v-text-field>
            <v-text-field v-model="newUser.email" label="Email"></v-text-field>

            <v-text-field
              v-model="newUser.password"
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="togglePasswordVisibility"
            ></v-text-field>

            <v-select
              v-model="newUser.role"
              :items="roles"
              label="Role"
              placeholder="Select Role"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="addUser" :loading="loading" :disabled="loading">Add</v-btn>
          <v-btn @click="dialogAddUser = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for Notifications -->
    <v-snackbar v-model="snackbar" :color="snackbarType">
      {{ snackbarText }}
      <v-btn text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>


<script>
import axios from 'axios';

export default {
  data() {
    return {
      loading: false,
      users: [],
      dialog: false,
      deleteDialog: false,  // For delete confirmation
      deleteUserData: {},   // Holds the user to be deleted
      editUserData: {},
      showPassword: false,  // State to control password visibility
      snackbar: false,
      snackbarText: '',
      snackbarType: 'info', // 'info', 'success', 'error'

      dialogAddUser: false,
      newUser: {
        username: '',
        email: '',
        password: '',
        role: ''
      },
      roles: ['Job Seeker', 'Job Provider'], // Or fetch dynamically if needed
      showPassword: false,
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    fetchUsers() {
      const apiUrl = process.env.VUE_APP_API_URL;
      axios
        .get(`${apiUrl}/users`, { withCredentials: true })
        .then((response) => {
          this.users = response.data;
        })
        .catch((error) => {
          this.snackbarText = 'Error fetching users';
          this.snackbarType = 'error';
          this.snackbar = true;
          console.error(error);
        });
    },
    goBack() {
      this.$router.push('/admin-home'); // Adjust the path as needed
    },
    editUser(user) {
      this.editUserData = { ...user }; // Pre-fill the dialog with current user data
      this.showPassword = false; // Reset password visibility to hidden
      this.dialog = true;
    },
    updateUser() {
      this.loading = true;
      const apiUrl = process.env.VUE_APP_API_URL;
      axios
        .put(`${apiUrl}/update-user/${this.editUserData.username}`, this.editUserData, { withCredentials: true })
        .then((response) => {
          this.dialog = false;
          this.fetchUsers(); // Refresh the user list
          this.snackbarText = 'User updated successfully';
          this.snackbarType = 'success';
          this.snackbar = true;
        })
        .catch((error) => {
          this.snackbarText = 'Update failed';
          this.snackbarType = 'error';
          this.snackbar = true;
          console.error(error);
        }).finally(() => {
          // Reset loading state after the process is completed
          this.loading = false;
        });
    },
    confirmDelete(user) {
      this.deleteUserData = user;
      this.deleteDialog = true; // Show confirmation dialog
    },
    deleteUser(user) {
      this.loading = true;
      const apiUrl = process.env.VUE_APP_API_URL;
      axios
        .delete(`${apiUrl}/delete-user/${user.username}`, { withCredentials: true })
        .then((response) => {
          this.fetchUsers(); // Refresh the user list
          this.snackbarText = 'User deleted successfully';
          this.snackbarType = 'success';
          this.snackbar = true;
          this.deleteDialog = false; // Close the dialog
        })
        .catch((error) => {
          this.snackbarText = 'Delete failed';
          this.snackbarType = 'error';
          this.snackbar = true;
          console.error(error);
        }).finally(() => {
          // Reset loading state after the process is completed
          this.loading = false;
        });
    },
    addUser() {
    this.loading = true;
    const apiUrl = process.env.VUE_APP_API_URL;
    axios.post(`${apiUrl}/signup`, this.newUser, { withCredentials: true })
      .then((response) => {
        this.snackbarText = 'User added successfully';
        this.snackbarType = 'success';
        this.snackbar = true;
        this.dialogAddUser = false;
        this.fetchUsers(); // Refresh user list
      })
      .catch((error) => {
        this.snackbarText = 'Failed to add user';
        this.snackbarType = 'error';
        this.snackbar = true;
        console.error(error);
      })
      .finally(() => {
        this.loading = false;
      });
  }
  },
  created() {
    this.fetchUsers(); // Fetch users when component is created
  },
};
</script>

<style scoped>
.manage-user-container {
  background-color: #f4f6f8; /* Light gray background for the entire container */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.aligned-table {
  margin-top: 20px;
  max-width: 800px; /* Set max width for the table */
  margin-left: auto;
  margin-right: auto;
}

.action-icon {
  cursor: pointer;
  margin: 0 8px;
}

.button-row {
  margin-top: 20px;
}

.dialog-title {
  font-weight: bold;
  font-size: 20px;
  color: #3f51b5; /* Darker shade for title */
}

.back-button {
  background-color: #3f51b5;
  color: white;
}

.add-button {
  background-color: #4caf50;
  color: white;
}

.readonly-field {
  background-color: #f4f6f8; /* Light grey background for readonly fields */
  color: #888; /* Grey text color */
}

</style>

