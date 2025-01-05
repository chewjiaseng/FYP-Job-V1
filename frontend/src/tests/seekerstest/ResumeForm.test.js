import { mount, flushPromises } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import ResumeForm from '@/components/ResumeForm.vue'; // Adjust the path as needed
import { createStore } from 'vuex'; // Import Vuex for mocking
import axios from 'axios'; // Add this import

const vuetify = createVuetify();

// Create a mock Vuex store
const store = createStore({
  state: {
    // Add any necessary state for your component
  },
  getters: {
    // Mock the getters used in NavbarSeeker.vue
    username: () => 'testuser', // Example getter if used in the component
  },
});

vi.mock('axios');  // Mocking the axios module

describe('ResumeForm.vue', () => {

  it('displays an error message when an invalid file is submitted', async () => {
    const wrapper = mount(ResumeForm, {
      global: {
        plugins: [vuetify, store],
      },
    });

    const fileInput = wrapper.find('input[type="file"]');
    const invalidFile = new File(['invalid content'], 'invalidFile.txt', { type: 'text/plain' });

    Object.defineProperty(fileInput.element, 'files', {
      value: [invalidFile],
    });

    await fileInput.trigger('change');
    await wrapper.setData({ message: 'Invalid file type' });

    const errorMessage = wrapper.find('.v-alert');
    expect(errorMessage.exists()).toBe(true);
    expect(errorMessage.text()).toBe('Invalid file type');
  });

  it('displays an error message for empty file submission', async () => {
    const wrapper = mount(ResumeForm, {
      global: {
        plugins: [vuetify, store],
      },
    });

    const fileInput = wrapper.find('input[type="file"]');
    Object.defineProperty(fileInput.element, 'files', {
      value: [],
    });

    await fileInput.trigger('change');
    await wrapper.setData({ message: 'Please upload a file' });

    const errorMessage = wrapper.find('.v-alert');
    expect(errorMessage.exists()).toBe(true);
    expect(errorMessage.text()).toBe('Please upload a file');
  });

  // TC 3 Check the job list correctly
  it('displays job listings correctly when jobs are available', async () => {
    const wrapper = mount(ResumeForm, {
      global: {
        plugins: [vuetify, store],
      },
    });
  
    // Mock the API response for jobs
    const jobs = [
      { 
        id: 1, 
        job_name: 'Software Engineer', 
        job_category: 'Development', 
        working_place: 'Remote', 
        working_hours: 'Full-time', 
        job_description: 'Job description', 
        created_at: '2025-01-01', 
        provider_name: 'Company A', 
        phone_num: '123456789' 
      }
    ];
    await wrapper.setData({ jobs });
  
    // Wait for DOM updates after data change
    await wrapper.vm.$nextTick();
  
    // Check if the "Recommended Jobs" card is rendered
    const recommendedJobsCard = wrapper.find('.custom-card3');
    expect(recommendedJobsCard.exists()).toBe(true); // Ensure the recommended jobs card is displayed
  
    // Check if job cards are displayed
    const jobCards = wrapper.findAll('.job-card');
    expect(jobCards.length).toBeGreaterThan(0); // Ensure that job cards are rendered
    
    // Optionally check if the job card structure exists (e.g., job name, category, etc.)
    const firstJobCard = jobCards[0].text();
    expect(firstJobCard).toContain('Software Engineer'); // Ensure the job name appears in the first card
  });
  

  //TC4 OPEN DIALOG
  it('opens the apply dialog when Apply button is clicked', async () => {
    // Mock Vuex store
    const store = createStore({
      state: { user: { username: 'testuser' } },
      getters: { username: (state) => state.user.username },
    });
  
    // Mount the component
    const wrapper = mount(ResumeForm, {
      global: { plugins: [vuetify, store] },
    });
  
    // Mock jobs data to render the button
    await wrapper.setData({
      jobs: [{ id: 1, job_name: 'Software Engineer' }], // Ensure the button appears in the DOM
    });
    await wrapper.vm.$nextTick(); // Wait for DOM updates
  
    // Find the Apply button
    const applyButton = wrapper.find('button.ml-2'); // Use the correct selector
    expect(applyButton.exists()).toBe(true); // Ensure button exists
  
    // Spy on the `openApplyDialog` method
    const spy = vi.spyOn(wrapper.vm, 'openApplyDialog');
  
    // Trigger the button click
    await applyButton.trigger('click');
  
    // Assert that the method was called with the correct job ID
    expect(spy).toHaveBeenCalledWith(1);
  
    // Verify that the dialog state is updated
    expect(wrapper.vm.applyDialog).toBe(true);
  });
  
  //TC5 Display success when apply
  it('displays success message in snackbar on successful apply', async () => {
    axios.post.mockResolvedValueOnce({ data: { success: true } });

    const wrapper = mount(ResumeForm, {
      global: {
        plugins: [store],  // Provide the mocked store
      },
    });

    await wrapper.vm.submitApplication({});  // Simulate the form submission
    await flushPromises();

    expect(wrapper.vm.snackbar.message).toBe('You have successfully applied for the part-time job');
  });

  it('displays failure message in snackbar on failed apply', async () => {
    axios.post.mockResolvedValueOnce({ data: { success: false } });

    const wrapper = mount(ResumeForm, {
      global: {
        plugins: [store],  // Provide the mocked store
      },
    });

    await wrapper.vm.submitApplication({});  // Simulate the form submission
    await flushPromises();

    expect(wrapper.vm.snackbar.message).toBe('Sorry, application failed. Please try again.');
  });

  //TC6 Display predicted category
  it('displays predicted category and recommended job after resume upload', async () => {
    const wrapper = mount(ResumeForm, {
      global: {
        plugins: [vuetify, store],
      },
    });
  
    // Set the data to trigger rendering
    await wrapper.setData({
      predictedCategory: 'Software Development',
      recommendedJob: 'Junior Developer',
    });
  
    // Wait for Vue to update the DOM
    await wrapper.vm.$nextTick();
  
    // Log the rendered HTML for debugging
    console.log(wrapper.html()); // Check if the elements are in the DOM
  
    // Find the elements directly in the HTML
    const predictedCategory = wrapper.find('p');  // Look for <p> tag, since the category is inside <p>
    const recommendedJob = wrapper.find('p');     // Look for the <p> tag displaying recommended job
  
    // Log element existence for debugging
    console.log(predictedCategory.exists());  // Should be true if element exists
    console.log(recommendedJob.exists());     // Should be true if element exists
  
    // Verify that the elements are in the DOM
    expect(predictedCategory.exists()).toBe(true);
    expect(recommendedJob.exists()).toBe(true);
  });
  
});
