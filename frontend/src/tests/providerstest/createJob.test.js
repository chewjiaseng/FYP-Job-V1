import CreateJob from '@/components/jobproviders/createjob.vue' // Adjust path if necessary
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock window.alert
global.alert = vi.fn();

describe('CreateJob.vue - Job Creation', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(CreateJob, {
      global: {
        stubs: ['router-link'], // Stub router-link if necessary
      },
    });
    vi.clearAllMocks(); // Reset all mock functions before each test
  });

  //TC1
  it('should show an alert when form fields are empty', async () => {
    await wrapper.find('form').trigger('submit.prevent');
    expect(global.alert).toHaveBeenCalledWith('Please fill in the information!');
  });

  //TC2
  it('should show success message when job is created successfully', async () => {
    // Mock the form fields with valid values
    await wrapper.setData({
      job_name: 'Software Engineer',
      job_category: 'IT',
      salary: '5000',
      working_place: 'Remote',
      working_hours: 'Full-time',
      job_description: 'Exciting job opportunity',
      phone_num: '1234567890',
    });

    // Mock fetch API
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Job created successfully!' }),
      })
    );

    // Trigger form submission
    await wrapper.find('form').trigger('submit.prevent');

    // Wait for the fetch call to resolve
    await flushPromises();

    // Check if alert was called with the success message
    expect(global.alert).toHaveBeenCalledWith('Job created successfully!');
    expect(global.fetch).toHaveBeenCalledTimes(1);  // Ensure fetch was called
  });

  
  //TC3
  it('should show error message when job is creation failed', async () => {
    // Mock the form fields with valid values
    await wrapper.setData({
      job_name: 'Software Engineer',
      job_category: 'IT',
      salary: '5000',
      working_place: 'Remote',
      working_hours: 'Full-time',
      job_description: 'Exciting job opportunity',
      phone_num: '1234567890',
    });

    // Mock fetch API
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({error: 'Server error' }),
      })
    );

    // Trigger form submission
    await wrapper.find('form').trigger('submit.prevent');

    // Wait for the fetch call to resolve
    await flushPromises();

    // Check if alert was called with the success message
    expect(global.alert).toHaveBeenCalledWith('Error creating job: Server error');
    expect(global.fetch).toHaveBeenCalledTimes(1);  // Ensure fetch was called
  });
});
