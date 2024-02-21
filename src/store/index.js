import {createStore} from 'vuex';

import navByDatesJSON from '@/data/stable/endp_nav_by_dates.json';
import navByVolumesJSON from "@/data/stable/endp_nav_by_volumes.json";
import metadataVolumesJSON from '@/data/stable/endp_volumes_metadata.json';
import mappingSha1VolumesJSON from '@/data/stable/endp_mapping_nakala_sha1_img_volumes.json';
import miradorSettings from "@/settings/mirador.conf.json";

export default createStore({
    state: {
        // Utils
        canvasId: 0,
        endpVolume: "collection",
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
        // Data-driven JSON
        navByDatesJSON: navByDatesJSON,
        navByVolumesJSON: navByVolumesJSON,
        metadataVolumesJSON: metadataVolumesJSON,
        mappingSha1VolumesJSON: mappingSha1VolumesJSON,
        // Configuration files
        miradorSettings: miradorSettings,
        // constants services endpoints
        personDbApi: process.env.VUE_APP_DB_API,
        personDbAdmin: process.env.VUE_APP_DB_ADMIN,
        personDbAdminShow: process.env.VUE_APP_DB_SHOW,
        noSketchService: process.env.VUE_APP_NOSKETCH_APP,
        iiifEncService: process.env.VUE_APP_IIIF_ENC,
        nakalaAppService: process.env.VUE_APP_NAKALA_APP,
        nakalaApiService: process.env.VUE_APP_NAKALA_API,
        nakalaApiIIIFService: process.env.VUE_APP_NAKALA_API_IIIF,
        nakalaDoiImages: process.env.VUE_APP_NAKALA_COLLECTION_IMAGES_DOI,
        nakalaDoiAlto: process.env.VUE_APP_NAKALA_COLLECTION_ALTO_DOI,
    },
    mutations: {
        setCanvasId(state, id) {
            state.canvasId = id;
        },
        setEndpVolume(state, volume) {
            state.endpVolume = volume;
        }
    },
});