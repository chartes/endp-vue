<template>
  <div class="header">
    <p class="title" v-if="registerPageDate">Fac simile du registre de conclusions capitulaires {{ endpVolume }} de
      Notre-Dame de Paris - {{ capitalizeFirstLetter(registerPageDate) }}</p>
    <p v-if="endpVolume">Citation url du fac simile courant : <a :href="citationUrl">{{
        citationUrl
      }}</a></p>
    <p v-if="endpVolume"><a target="_blank" :href="imageNakalaSrc">{{ imageNakalaSrc }}</a></p>
    <p style="color: red" v-if="endpVolume">Le taux de reconnaissance du texte estimé pour ce
      fac-simile est de X%.
      (Le texte affiché peut comporter un certain nombre d'erreurs. En effet, la couche texte de ce facsimile a été
      généré automatiquement par un programme de reconnaissance des écritures manuscrites (HTR).)</p>
    <div class="column">
    </div>
  </div>
  <div class="columns">
    <div class='column' v-if="isNavOpen">
      <fac-simile-navigation @update-mirador="handleMiradorUpdate"></fac-simile-navigation>
    </div>
    <button @click="toggleNav"><i class="fas fa-bars"></i></button>
    <div class='column' :class="{ 'is-full': !isNavOpen, 'is-8': isNavOpen }">
      <div id='mirador'></div>
    </div>
  </div>
</template>

<script>
//import MiradorViewer from "@/components/MiradorViewer.vue";
import {mapState} from 'vuex';
import Mirador from 'mirador/dist/es/src/index';
import FacSimileNavigation from "@/components/FacSimileNavigation.vue";
import textOverlayPlugin from 'mirador-textoverlay/es';
import endpManifestMapping from '../data/endp_manifest_mapping.json';
import mapSha1Dates from '../data/mapping_image_sha1_dates.json';
import MiradorSettings from "@/settings/mirador.conf.json";
import capitalizeFirstLetter from "@/utils/_string_formater";

export default {
  name: 'FacSimileView',
  components: {FacSimileNavigation},
  data() {
    return {
      endpManifestMapping,
      citationUrl: window.location,
      viewer: null,
      windowId: "document",
      imageNakalaSrc: "",
      registerPageDate: "",
      isNavOpen: true,
      endpVolumeManifest() {
        return this.endpVolume === "collection" || this.canvasId === "top"
            ? `https://iiif.chartes.psl.eu/endp/collection/top`
            : `https://iiif.chartes.psl.eu/endp/${this.endpVolume}/manifest`;
      },

    };
  },
  watch: {
    citationUrl: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.citationUrl = newVal;
      }
    },
    canvasId: async function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$store.commit('setCanvasId', newVal);
        this.$store.commit('setEndpVolume', this.endpVolume);
        if (newVal === "top") {
          this.registerPageDate = "";
          this.$store.commit('setEndpVolume', "collection");
          this.initMiradorViewer();
        }
        this.updateUrlParams();
      }
    },
    endpVolume: async function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$store.commit('setCanvasId', this.canvasId);
        this.$store.commit('setEndpVolume', newVal);
        if (newVal === "collection") {
          this.registerPageDate = "";
          this.$store.commit('setCanvasId', "top");
          this.initMiradorViewer();
        }
        this.updateUrlParams();
      }
    },
  },
  computed: {
    ...mapState(['canvasId', 'endpVolume']),
  },
  methods: {
    initMiradorViewer() {
      this.viewer = Mirador.viewer({
        id: 'mirador',
        ...MiradorSettings,
        windows: [
          {
            id: this.windowId,
            canvasIndex: this.canvasId,
            loadedManifest: this.endpVolumeManifest(),
          }],
      }, [...textOverlayPlugin]);
      this.viewer.store.subscribe(() => {
        this.storeState = this.viewer.store.getState();

        let canvasIDUrl = String(this.storeState.windows[this.windowId].canvasId);

        let nakalaUrlImageSrc = canvasIDUrl
            .replace("https://api.nakala.fr/iiif/", "https://nakala.fr/")
            .replace("/Canvas/", "#");

        const sha1 = canvasIDUrl.split("/")[(canvasIDUrl.split("/").length - 1)];

        const canvasObject = Object(mapSha1Dates[sha1]);

        this.imageNakalaSrc = nakalaUrlImageSrc;

        this.$store.commit('setEndpVolume', canvasObject['volume_identifier']);
        this.$store.commit('setCanvasId', canvasObject['canvas_index']);
        this.registerPageDate = canvasObject['date_full'];
      });
    },
    updateUrlParams() {
      this.$router.push({
        name: 'facsimile',
        params: {
          volumeIndex: this.endpVolume,
          canvasIndex: this.canvasId,
        },
      });
    },
    capitalizeFirstLetter,
    toggleNav(event) {
      event.preventDefault();
      this.isNavOpen = !this.isNavOpen;
    },

    async handleMiradorUpdate(canvasID, registre) {
      this.canvasId = canvasID;
      this.endpVolume = registre;
      this.$store.commit('setEndpVolume', registre);
      this.$store.commit('setCanvasId', canvasID);
      this.initMiradorViewer();
      await this.updateUrlParams();
    },
  },
  mounted() {
    this.$store.commit('setEndpVolume', this.$route.params.volumeIndex);
    this.$store.commit('setCanvasId', this.$route.params.canvasIndex);
    this.initMiradorViewer();
  },
};

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Chivo+Mono:wght@100&display=swap');


/* I want all elements in .container float on max left */
.header {
  display: block;
  width: 70%;
  padding: 1rem;
  flex-direction: row;
}

.title {
  font-size: 1.5rem;
  color: #0a0b0d;
}

.wrapper-mirador {
  flex-grow: 1;
  background-color: #E3D6CA !important;
}

.navfac {
  flex: 0 0 25%; /* do not grow, do not shrink, start at 25% of the parent's width */
}

.wrapper-mirador {
  flex: 1; /* grow to fill the remaining space */
  height: 900px; /* or 'auto' to fill the height */
}

#mirador {
  position: relative;
  height: 100vh;
}

text {
  /*font-size: 70px !important;*/
  /* font-size: 10px !important; */
}

tspan {
  /*font-size: 70px !important;*/
  font-size: 1px !important;

  font-weight: normal !important;
}


.is-full {
  width: 100%;
  padding-right: 20%;
}

.is-8 {
  width: 75%; /* ou la largeur que vous souhaitez pour cette colonne */
  padding-right: 20%;
}

.column {
  transition: width 0.5s;
}

.is-hidden {
  display: none;
}

.is-3 {
  width: 25%;
}

.is-9 {
  width: 75%;
}

.is-12 {
  width: 100%;
}

/*rect {
  fill: rgb(192, 180, 156) !important;
}*/
</style>
