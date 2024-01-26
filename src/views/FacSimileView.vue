<template>
  <div class="header" v-if="endpVolume">
    <!-- Title -->
    <p class="title" v-if="registerPageDate">Fac simile du registre de conclusions capitulaires {{ endpVolume }} de
      Notre-Dame de Paris - <span class="date-title">{{ registerPageDate }}</span></p>
    <!-- Metadata card section -->
    <div class="card">
      <div class="card-header" @click="toggleCard('card1')">
        <p class="card-header-title">
          <i class="fas fa-info-circle"></i>
          Métadonnées
          <i class="fas"
             :class="{'fa-chevron-down': !metadataCardsState.card1, 'fa-chevron-up': metadataCardsState.card1}"
          ></i>
        </p>
      </div>
      <div class="card-content" v-if="metadataCardsState.card1">
        <p>Citation url du fac simile courant : <a :href="citationUrl">{{
            citationUrl
          }}</a></p>
        <p>Source de l'image sur Nakala : <a target="_blank" :href="imageNakalaSrc">{{ imageNakalaSrc }}</a></p>
      </div>
    </div>
    <div class="card">
      <div class="card-header" @click="toggleCard('card2')">
        <p class="card-header-title">
          <i class="fas fa-exclamation-triangle"></i>Avertissement
          <i class="fas"
             :class="{'fa-chevron-down': !metadataCardsState.card2, 'fa-chevron-up': metadataCardsState.card2}"
          ></i>
        </p>
      </div>
      <div class="card-content" v-if="metadataCardsState.card2">
        <p class="warning">Le taux de reconnaissance de ce fac-simile est de X%
          (Le texte affiché peut comporter un certain nombre d'erreurs. En effet, la couche texte de ce facsimile a
          été
          généré automatiquement par un programme de reconnaissance des écritures manuscrites (HTR).)</p>
      </div>
    </div>
  </div>
  <br>
  <div class="columns">
    <div class='column' v-if="isNavOpen">
      <fac-simile-navigation @update-mirador="handleMiradorUpdate"></fac-simile-navigation>
    </div>
    <button @click="toggleNav" class="btn-expanded-nav"><i class="fas fa-bars"></i></button>
    <div class='column' :class="{ 'is-full': !isNavOpen, 'is-8': isNavOpen }">
      <div id='mirador'></div>
    </div>
  </div>
  <div ref="textContainer" class="box" v-if="endpVolume">
    <code v-html="text"></code>
  </div>
</template>

<script>
import {mapState} from 'vuex';

import Mirador from 'mirador/dist/es/src/index';
import textOverlayPlugin from 'mirador-textoverlay/es';

import FacSimileNavigation from "@/components/FacSimileNavigation.vue";

export default {
  name: 'FacSimileView',
  components: {FacSimileNavigation},
  data() {
    return {
      metadataCardsState: {
        card1: true,
        card2: false,
      },
      citationUrl: '',
      viewer: null,
      windowId: "document",
      imageNakalaSrc: "",
      registerPageDate: "",
      text: "",
      isNavOpen: true,
      endpVolumeManifest() {
        return this.endpVolume === "collection" || this.canvasId === "top"
            ? `https://iiif.chartes.psl.eu/endp/collection/top`
            : `https://iiif.chartes.psl.eu/endp/${this.endpVolume}/manifest`;
      },

    };
  },
  watch: {
    text: function () {
      this.extraireTexte();
    },
    citationUrl: function () {
      this.citationUrl = window.location.href;
    },
    canvasId: async function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$store.commit('setCanvasId', newVal);
        this.$store.commit('setEndpVolume', this.endpVolume);
        if (newVal === "top") {
          this.registerPageDate = "";
          this.$store.commit('setEndpVolume', "collection");
          await this.initMiradorViewer();
        }
        await this.updateUrlParams();
      }
    },
    endpVolume: async function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$store.commit('setCanvasId', this.canvasId);
        this.$store.commit('setEndpVolume', newVal);
        if (newVal === "collection") {
          this.registerPageDate = "";
          this.$store.commit('setCanvasId', "top");
          await this.initMiradorViewer();
        }
        await this.updateUrlParams();
      }
    },
  },
  computed: {
    ...mapState(
        [
          'canvasId',
          'endpVolume',
          'MiradorSettings',
          'mapSha1Dates'
        ]
    ),
  },
  methods: {
    /**
     * Toggle the metadata cards state
     * @param card
     * @returns {boolean}
     */
    toggleCard(card) {
      this.metadataCardsState[card] = !this.metadataCardsState[card];
    },

    /**
     * Init and update the mirador viewer
     * (settings are deported in mirador.conf.json)
     * @returns {Promise<void>}
     */
    initMiradorViewer() {
      this.viewer = Mirador.viewer({
        id: 'mirador',
        ...this.MiradorSettings,
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

        const canvasObject = Object(this.mapSha1Dates[sha1]);

        this.imageNakalaSrc = nakalaUrlImageSrc;
        this.citationUrl = window.location;

        this.$store.commit('setEndpVolume', canvasObject['volume_identifier']);
        this.$store.commit('setCanvasId', canvasObject['canvas_index']);
        this.registerPageDate = canvasObject['date_full'];
        this.extraireTexte();
      });
    },

    /**
     * Update the url params
     * @returns {Promise<void>}
     */
    updateUrlParams() {
      this.$router.push({
        name: 'facsimile',
        params: {
          volumeIndex: this.endpVolume,
          canvasIndex: this.canvasId,
        },
      });
    },

    /**
     * Toggle the navigation
     * @param event
     */
    toggleNav(event) {
      event.preventDefault();
      this.isNavOpen = !this.isNavOpen;
    },

    /**
     * Handle the mirador update
     * @param canvasID
     * @param registre
     * @returns {Promise<void>}
     */
    async handleMiradorUpdate(canvasID, registre) {
      this.canvasId = canvasID;
      this.endpVolume = registre;
      this.$store.commit('setEndpVolume', registre);
      this.$store.commit('setCanvasId', canvasID);
      await this.initMiradorViewer();
      await this.updateUrlParams();
    },

    extraireTexte() {
      const svgs = document.querySelectorAll('svg');
      let texteHtml = '';

      svgs.forEach(svg => {
        const textElements = svg.querySelectorAll('text');
        textElements.forEach((textEl, ) => {
          //if (index > 0) texteHtml += '<br>'; // Ajoute un saut de ligne entre les éléments <text>
          const tsElements = textEl.querySelectorAll('tspan');
          const texteDeTextEl = Array.from(tsElements).map(el => el.innerHTML).join(' ');
          texteHtml += `<p>${texteDeTextEl}</p>`;
        });
      });

      this.text = texteHtml;
    }
  },
  mounted() {
    this.$store.commit('setEndpVolume', this.$route.params.volumeIndex);
    this.$store.commit('setCanvasId', this.$route.params.canvasIndex);
    this.initMiradorViewer();
    this.extraireTexte();
  },
};

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Chivo+Mono:wght@100&display=swap');

.header {
  display: block;
  width: 82%;
  padding: 0.5rem;
  flex-direction: row;
}

.title {
  font-size: 1.5rem;
  color: #0a0b0d;
}

.date-title {
  text-transform: capitalize;
}

.card {
  margin: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #fff;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;
}

.card-header-title {
  display: flex;
  justify-content: space-between;
}

.card-header:hover {
  cursor: pointer;
}

.warning {
  color: #ff3860;
}

.box code {
  white-space: pre-line; /* S'assure que les sauts de ligne sont respectés */
  font-family: 'Chivo Mono', monospace;
  font-size: 0.8rem;
  line-height: 1.5rem;
  color: #0a0b0d;
}

#mirador {
  position: relative;
  height: 100vh;
  border: 2px solid #8d1919;
  border-radius: 0.5rem;
}

tspan {
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

.btn-expanded-nav {
  margin-top: 0.7rem;
  margin-bottom: 0.7rem;
  text-align: left;
  padding-left: 1rem;
  padding-right: 1rem;
}

.btn-expanded-nav:hover {
  background-color: #f5f5f5;
  cursor: pointer;
}
</style>
