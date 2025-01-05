import { mount, flushPromises } from '@vue/test-utils';
import { vi } from 'vitest';
import axios from 'axios';
import ManageUserData from '@/components/admin/ManageUserData.vue';

// Mock axios
vi.mock('axios');

describe('ManageUserData.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(ManageUserData, {
      global: {
        plugins: [vuetify],
      },
    });

    // Mock fetchUsers to prevent API call
    vi.spyOn(wrapper.vm, 'fetchUsers').mockImplementation(() => {});
  });

  it('displays success message in snackbar on successful user creation', async () => {
    // Mock axios.post to resolve as success
    axios.post.mockResolvedValueOnce({ data: { success: true } });

    // Trigger addUser method
    await wrapper.vm.addUser();  // Wait for promise resolution
    await flushPromises(); // Ensure async promises are flushed

    // Check that the snackbar displays the success message
    expect(wrapper.vm.snackbarText).toBe('User added successfully');
    expect(wrapper.vm.snackbarType).toBe('success');
    expect(wrapper.vm.snackbar).toBe(true);
  });

  it('displays error message in snackbar when user creation fails', async () => {
    // Mock axios.post to reject with an error
    axios.post.mockRejectedValueOnce(new Error('Failed to create user'));

    // Trigger addUser method
    await wrapper.vm.addUser();  // Wait for promise resolution
    await flushPromises(); // Ensure async promises are flushed

    // Check that the snackbar displays the error message
    expect(wrapper.vm.snackbarText).toBe('Failed to add user');
    expect(wrapper.vm.snackbarType).toBe('error');
    expect(wrapper.vm.snackbar).toBe(true);
  });
});
