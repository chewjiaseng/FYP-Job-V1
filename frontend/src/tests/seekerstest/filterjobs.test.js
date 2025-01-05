import { mount } from '@vue/test-utils'
import SeekerHome from '@/components/jobseekers/SeekerHome.vue' // Adjust path as needed
import { createStore } from 'vuex'
import { describe, it, expect, vi } from 'vitest'

describe('SeekerHome.vue - Filter Jobs', () => {
  let wrapper
  const store = createStore({
    state: {
      // Mock the necessary state
    },
    getters: {
      // Mock the getters used in SeekerHome.vue (e.g., username)
      username: () => 'testuser',
    },
  })

  beforeEach(() => {
    wrapper = mount(SeekerHome, {
      global: {
        plugins: [store], // Inject the mock store into the component
      },
      data() {
        return {
          jobs: [
            { id: 1, job_name: 'Software Developer', job_category: 'IT', working_place: 'New York', phone_num: '1234567890', provider_name: 'Company A', created_at: '2025-01-01T00:00:00.000Z' },
            { id: 2, job_name: 'Data Scientist', job_category: 'IT', working_place: 'Los Angeles', phone_num: '0987654321', provider_name: 'Company B', created_at: '2025-01-02T00:00:00.000Z' },
            { id: 3, job_name: 'Product Manager', job_category: 'Management', working_place: 'New York', phone_num: '1231231234', provider_name: 'Company C', created_at: '2025-01-03T00:00:00.000Z' },
          ],
          filteredJobs: [],
          searchText: '',
          selectedLocation: ['All'],
          selectedCategories: ['All'],
          locationMenu: false,
          categoryMenu: false,
        }
      },
    })
  })

  it('filters jobs correctly by job name (search)', async () => {
    // Simulate typing in the search input
    await wrapper.setData({ searchText: 'Software' })
    wrapper.vm.searchJob()
    expect(wrapper.vm.filteredJobs.length).toBe(1)
    expect(wrapper.vm.filteredJobs[0].job_name).toBe('Software Developer')
  })

  it('filters jobs correctly by location', async () => {
    // Select a specific location
    await wrapper.setData({ selectedLocation: ['New York'] })
    wrapper.vm.filterLocation()
    expect(wrapper.vm.filteredJobs.length).toBe(2) // New York has 2 jobs
    expect(wrapper.vm.filteredJobs.every(job => job.working_place === 'New York')).toBe(true)
  })

  it('filters jobs correctly by category', async () => {
    // Select a specific category
    await wrapper.setData({ selectedCategories: ['IT'] })
    wrapper.vm.filterCategory()
    expect(wrapper.vm.filteredJobs.length).toBe(2) // IT category has 2 jobs
    expect(wrapper.vm.filteredJobs.every(job => job.job_category === 'IT')).toBe(true)
  })

  it('filters jobs correctly with combined search and location filters', async () => {
    // Set search and location filters together
    await wrapper.setData({ searchText: 'Software', selectedLocation: ['New York'] })
    wrapper.vm.combinedFilter()
    expect(wrapper.vm.filteredJobs.length).toBe(1)
    expect(wrapper.vm.filteredJobs[0].job_name).toBe('Software Developer')
    expect(wrapper.vm.filteredJobs[0].working_place).toBe('New York')
  })

  it('clears filters and shows all jobs', async () => {
    // Set filters and then clear them
    await wrapper.setData({ searchText: 'Software', selectedLocation: ['New York'], selectedCategories: ['IT'] })
    wrapper.vm.combinedFilter()
    expect(wrapper.vm.filteredJobs.length).toBe(1)

    // Clear filters
    await wrapper.setData({ searchText: '', selectedLocation: ['All'], selectedCategories: ['All'] })
    wrapper.vm.combinedFilter()
    expect(wrapper.vm.filteredJobs.length).toBe(3) // Should show all jobs after clearing filters
  })
})
