import { mount } from '@vue/test-utils';
import { createVuetify } from 'vuetify'; // Correct import for Vuetify 3.x
import ResumeForm from '@/components/ResumeForm.vue';
import { createStore } from 'vuex';

describe('ResumeForm.vue', () => {
  let vuetify;
  let store;

  beforeEach(() => {
    vuetify = createVuetify(); // Initialize Vuetify correctly for Vuetify 3
    store = createStore({
      state: {
        // Add a dummy store state if needed
      },
      getters: {
        // Add any needed getters for testing
      }
    });
  });

  it('renders the file input and submit button correctly', () => {
    const wrapper = mount(ResumeForm, {
      global: {
        plugins: [vuetify, store], // Register Vuetify and store as plugins
      },
    });

    // Check if the file input exists
    const fileInput = wrapper.find('input[type="file"]');
    expect(fileInput.exists()).toBe(true);

    // Check if the submit button exists
    const submitButton = wrapper.find('button[type="submit"]');
    expect(submitButton.exists()).toBe(true);
  });

  // Add the rest of your tests here (valid file upload, invalid file upload, form submission)
});
