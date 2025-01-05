import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import JobCard from '../components/JobCard.vue'

describe('JobCard', () => {
  it('renders job title', () => {
    const wrapper = mount(JobCard, {
      props: {
        jobTitle: 'Software Engineer',
        jobDescription: 'Develop and maintain web applications.',
      },
    })
    expect(wrapper.text()).toContain('Software Engineer')
  })

  it('does not show description by default', () => {
    const wrapper = mount(JobCard, {
      props: {
        jobTitle: 'Software Engineer',
        jobDescription: 'Develop and maintain web applications.',
      },
    })
    expect(wrapper.text()).not.toContain('Develop and maintain web applications.')
  })

  it('toggles description visibility when button is clicked', async () => {
    const wrapper = mount(JobCard, {
      props: {
        jobTitle: 'Software Engineer',
        jobDescription: 'Develop and maintain web applications.',
      },
    })

    // Click to show description
    await wrapper.find('button').trigger('click')
    expect(wrapper.text()).toContain('Develop and maintain web applications.')

    // Click to hide description
    await wrapper.find('button').trigger('click')
    expect(wrapper.text()).not.toContain('Develop and maintain web applications.')
  })
})
