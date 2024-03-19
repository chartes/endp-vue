import {shallowMount} from '@vue/test-utils';
import PersonDataTimeline from 'components/PersonDataTimeline.vue';

import eventsResponseJSON from '../../fixtures/eventsResponse.json';
import { store } from '../../fixtures/store';


describe('PersonDataTimeline.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(PersonDataTimeline, {
            global: {
                mocks: {
                    $store: store
                },
                stubs: {
                    RouterLink: true
                }
            },
            props: {
                eventsResponse: []
            }
        });
    });

    it('renders correctly', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('check date order events', async () => {
        for (const eventResponseItem of eventsResponseJSON) {
            await wrapper.setProps({eventsResponse: eventResponseItem.data});
            const events = wrapper.vm.groupedEvents;
            expect(events.map(event => event.date)).toEqual(eventResponseItem.toChecked.orderDateExpected);

        }
    });

    it('check total grouped events by date', async () => {
        for (const eventResponseItem of eventsResponseJSON) {
            await wrapper.setProps({eventsResponse: eventResponseItem.data});
            const events = wrapper.vm.groupedEvents;
            for (const event of events) {
                expect(event.events.length).toEqual(eventResponseItem.toChecked.totalEventsByDateExpected[event.date]);
            }
        }
    });
});



