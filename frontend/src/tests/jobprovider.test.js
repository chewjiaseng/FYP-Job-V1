import { mount } from '@vue/test-utils';
import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import JobProvider from '@/components/JobProvider.vue';
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

describe('JobProvider.vue', () => {
  let vuetify;

  beforeEach(() => {
    vuetify = createVuetify();  // Use createVuetify() for Vuetify 3.x
  });

  it('renders the JobProvider page correctly', () => {
    const wrapper = mount(JobProvider, {
      global: {
        plugins: [vuetify],
      }
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('matches the snapshot', () => {
    const wrapper = mount(JobProvider, {
      global: {
        plugins: [vuetify],
        provide: {
          $vuetify: { layout: {} },  // Provide the layout context here as well
        },
      }
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
