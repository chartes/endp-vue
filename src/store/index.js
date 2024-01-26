import {createStore} from 'vuex';

import endpData from '@/data/stable/endp_data_range_new.json';
import endpVolumesData from '@/data/stable/endp_register_volumes.json';
import mapSha1Dates from '@/data/stable/mapping_image_sha1_dates.json';
import indexFSNavJson from "@/data/stable/nav_endp_new.json";
import MiradorSettings from "@/settings/mirador.conf.json";

export default createStore({
    state: {
        // mirador states
        canvasId: 0,
        endpVolume: "collection",
        // Dates utils
        months: [
            {iso_code: '01', name: 'Janvier'},
            {iso_code: '02', name: 'Février'},
            {iso_code: '03', name: 'Mars'},
            {iso_code: '04', name: 'Avril'},
            {iso_code: '05', name: 'Mai'},
            {iso_code: '06', name: 'Juin'},
            {iso_code: '07', name: 'Juillet'},
            {iso_code: '08', name: 'Août'},
            {iso_code: '09', name: 'Septembre'},
            {iso_code: '10', name: 'Octobre'},
            {iso_code: '11', name: 'Novembre'},
            {iso_code: '12', name: 'Décembre'}
        ],
        // Data-driven
        endpData: endpData,
        endpVolumesData: endpVolumesData,
        mapSha1Dates: mapSha1Dates,
        indexFSNavJson: indexFSNavJson,
        // Configuration files
        MiradorSettings: MiradorSettings,
    },
    mutations: {
        setCanvasId(state, id) {
            state.canvasId = id;
        },
        setEndpVolume(state, volume) {
            state.endpVolume = volume;
        },
    }
});