<template>
  <div class="header">
    <!-- Title -->
    <p class="title" v-if="!registerPageDate">Collection des fac-similés de registres de conclusions capitulaires</p>
    <p class="title" v-if="registerPageDate">Fac-similé du registre de conclusions capitulaires {{ endpVolume }} de
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
    <div class="card" v-if="registerPageDate">
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
      <FacSimileNavigation
          :register-to-open="endpVolume"
          :year-to-open="registerPageDate"
          @update-mirador="handleMiradorUpdate"/>
    </div>
    <button @click="toggleNav" class="btn-expanded-nav"><i class="fas fa-bars"></i></button>
    <div class='column container-mirador' :class="{ 'is-full': !isNavOpen, 'is-8': isNavOpen }">
      <div id='mirador'></div>
    </div>
  </div>
  <div class="header">
    <div class="card" v-if="endpVolume">
      <div class="card-header" @click="toggleCard('card3')">
        <p class="card-header-title">
          <i class="fas fa-text-width"></i>
          Accéder à la prédiction texte brut
          <i class="fas"
             :class="{'fa-chevron-down': !metadataCardsState.card3, 'fa-chevron-up': metadataCardsState.card3}"
          ></i>
        </p>
      </div>
      <div class="card-content raw-prediction-text" v-if="metadataCardsState.card3">
        <div class="notification is-success" v-if="showCopyConfirmation">
          Texte copié dans le presse-papiers !
        </div>
        <button @click="copyToClipboard" class="button is-small is-info">
          <i class="fas fa-copy"></i>
        </button>
        <br>
        <hr>
        <!-- create a spinner when the text is loading -->
        <div v-if="loadPredictionText" class="loader-wrapper">
          <div class="loader is-loading"></div>
        </div>
        <div v-html="rawPredictionText"></div>
      </div>
    </div>
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
        card3: false,
      },
      citationUrl: '',
      viewer: null,
      windowId: "document",
      imageNakalaSrc: "https://nakala.fr/collection/10.34847/nkl.03cbi521",
      altoNakalaSrc: "",
      registerPageDate: "",
      rawPredictionText: "",
      showCopyConfirmation: false,
      loadPredictionText: false,
      isNavOpen: true,
      endpVolumeManifest() {
        return this.endpVolume === "collection" || this.canvasId === "top"
            ? `https://iiif.chartes.psl.eu/endp/collection/top`
            : `https://iiif.chartes.psl.eu/endp/${this.endpVolume}/manifest`;
      },

    };
  },
  watch: {
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
        // fetch and display the raw prediction text only if card3 is open
        if (this.metadataCardsState.card3) {
          await this.fetchAndDisplayXML();
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
     * Format the prediction text with HTML markup to plain text
     * @param html
     * @returns {string}
     * @private
     */
    _htmlToPlainText(html) {
      const tempDivElement = document.createElement("div");
      tempDivElement.innerHTML = html;
      let text = tempDivElement.textContent || tempDivElement.innerText || "";

      // Replace multiple spaces and newlines with a single space
      return text.replace(/[\r\n]+/g, '\n').replace(/[ \t]+/g, ' ').trim();
    },

    /**
     * Copy the raw prediction text to the clipboard
     * @returns {Promise<void>}
     */
    copyToClipboard() {
      const plainText = this._htmlToPlainText(this.rawPredictionText);
      navigator.clipboard.writeText(plainText).then(() => {
        this.showCopyConfirmation = true;
        setTimeout(() => {
          this.showCopyConfirmation = false;
        }, 2000);
      });
    },

    /**
     * Toggle the metadata cards state
     * @param card
     * @returns {boolean}
     */
    toggleCard(card) {
      // fetch alto only if the card is opened
      if (card === "card3" && !this.metadataCardsState[card]) {
        this.fetchAndDisplayXML();
      }
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

        this.altoNakalaSrc = canvasObject.alto_nakala_url;

        // test if canvasObject is empty
        if (Object.keys(canvasObject).length === 0) {
          this.imageNakalaSrc = "https://nakala.fr/collection/10.34847/nkl.03cbi521";
        } else {
          this.imageNakalaSrc = nakalaUrlImageSrc;
        }

        this.citationUrl = window.location;
        if (canvasObject['date_iso'] !== undefined) {
          this.$store.commit('setYear', canvasObject['date_iso'].toString().split('-')[0]);
        }

        this.$store.commit('setEndpVolume', canvasObject['volume_identifier']);
        this.$store.commit('setCanvasId', canvasObject['canvas_index']);
        this.registerPageDate = canvasObject['date_full'];

      });
    },

    /**
     * Get & display the raw HTR prediction text in correct HTML format from the XML ALTO (fetched from Nakala API)
     * @param url
     * @returns null
     */
    async fetchAndDisplayXML() {
      console.log("Fetching XML ALTO on Nakala...")
      this.loadPredictionText = true;
    try {
      const response = await fetch(this.altoNakalaSrc);
      const xml = await response.text();
      this.rawPredictionText = this._formatXmlAltoToHtml(xml);
      this.loadPredictionText = false;
    } catch (error) {
      console.error("Error when fetching XML ALTO on Nakala...", error);
      this.rawPredictionText = "Erreur lors du chargement des données, veuillez réessayer plus tard.";
      this.loadPredictionText = false;
    }
  },

    /**
     * Format the XML ALTO to HTML
     * @param xml
     * @returns {string}
     * @private
     */
    _formatXmlAltoToHtml(xml) {
      let html = '';
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, "text/xml");
      // comment (only for check the correct image)
      /* const title = xmlDoc.querySelector('fileName').textContent;
      html += `<h3>${title}\n</h3>`; */
      const textLines = xmlDoc.querySelectorAll('TextLine');
      textLines.forEach(line => {
        let lineText = '';
        const strings = line.querySelectorAll('String');
        strings.forEach(string => {
          lineText += string.getAttribute('CONTENT') + ' ';
        });
        html += `<p>${lineText.trim()}\n</p>`;
      });
      return html;
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
      // prevent fetch & load of the XML ALTO if the card is not opened
      this.metadataCardsState['card3'] = false;
    },
  },

  mounted() {
    this.$store.commit('setEndpVolume', this.$route.params.volumeIndex);
    this.$store.commit('setCanvasId', this.$route.params.canvasIndex);
    this.endpVolume = this.$route.params.volumeIndex;
    this.initMiradorViewer();
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

.raw-prediction-text div {
  font-family: "Times New Roman", Times, serif;
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
  padding-right: 25%;
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

.notification.is-success {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.loader-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}

.loader {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #3273dc;
  width: 100px; /* Augmentez la taille du spinner */
  height: 100px; /* Augmentez la taille du spinner */
}

.is-active {
  opacity: 0;
}
</style>
