import { mount, flushPromises } from '@vue/test-utils';
import { vi } from 'vitest';
import axios from 'axios';
import { createVuetify } from 'vuetify'; // Vuetify v3
import 'vuetify/styles';

import ManageUserData from '@/components/admin/ManageUserData.vue';

// Mock axios
vi.mock('axios');

describe('ManageUserData.vue', () => {
  let wrapper;
  let vuetify;

  beforeEach(() => {
    vuetify = createVuetify(); // Initialize Vuetify (Vuetify v3)

    wrapper = mount(ManageUserData, {
      global: {
        plugins: [vuetify], // Include Vuetify as a plugin
      },
    });

    // Mock fetchUsers to prevent actual API calls
    vi.spyOn(wrapper.vm, 'fetchUsers').mockResolvedValue();
  });

  afterEach(() => {
    vi.restoreAllMocks(); // Restore original implementations after each test
  });

  it('displays success message in snackbar on successful user creation', async () => {
    // Mock axios.post to resolve successfully
    axios.post.mockResolvedValueOnce({ data: { success: true } });

    // Call addUser
    await wrapper.vm.addUser();
    await flushPromises();

    // Assertions
    expect(wrapper.vm.snackbarText).toBe('User added successfully');
    expect(wrapper.vm.snackbarType).toBe('success');
    expect(wrapper.vm.snackbar).toBe(true);
    expect(wrapper.vm.dialogAddUser).toBe(false); // Ensure dialog closes
    expect(wrapper.vm.fetchUsers).toHaveBeenCalled(); // Verify fetchUsers was called
  });

  it('displays error message in snackbar when user creation fails', async () => {
    // Mock axios.post to reject with an error
    const mockError = {
      response: {
        data: { error: 'Backend error message' },
      },
    };
    axios.post.mockRejectedValueOnce(mockError);

    // Call addUser
    await wrapper.vm.addUser();
    await flushPromises();

    // Assertions
    expect(wrapper.vm.snackbarText).toBe('Backend error message');
    expect(wrapper.vm.snackbarType).toBe('error');
    expect(wrapper.vm.snackbar).toBe(true);
  });

  
});
