import { shallowMount } from '@vue/test-utils';
import PersonDataTimeline  from 'components/PersonDataTimeline.vue';

describe('PersonDataTimeline.vue', () => {
  it('renders correctly', () => {
    const wrapper = shallowMount(PersonDataTimeline, {
      propsData: {
        eventsResponse: [] // Ajoutez ici des données mock si nécessaire
      }
    });
    expect(wrapper.exists()).toBe(true);
  });
});
