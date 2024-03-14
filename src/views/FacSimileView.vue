<template>

  <div class="columns facsimile-columns">

    <div class='column' v-if="isNavOpen">
      <!-- Metadata card section -->
      <div class="card" :class="metadataCardsState.card1 ? 'is-opened': ''">
        <div class="card-header" @click="toggleCard('card1')">
          <p class="card-header-title">
            Métadonnées
            <button class="card-header-toggle" />
          </p>
        </div>
        <div class="card-content" v-if="metadataCardsState.card1">
          <p>Citation url du fac simile courant : <a :href="citationUrl">{{
              citationUrl
            }}</a></p>
          <br>
          <div class="columns nakala-metadata-wrapper is-vcentered">
            <div class="column is-narrow">
              <img src="@/assets/icons/nakala-square-icon.png" alt="Fac-simile" class="nakala-image">
            </div>
            <div class="column">
              <p>Source de l'image sur Nakala : <a target="_blank" :href="imageNakalaSrc">{{ imageNakalaSrc }}</a></p>
            </div>
          </div>

        </div>
      </div>
      <!-- Warning section -->
      <div class="card" :class="metadataCardsState.card2 ? 'is-opened': ''" v-if="registerPageDate">
        <div class="card-header" @click="toggleCard('card2')">
          <p class="card-header-title">
            Avertissement
            <button class="card-header-toggle" />
          </p>
        </div>
        <div class="card-content" v-if="metadataCardsState.card2">
          <p class="warning">Le taux de reconnaissance de ce fac-simile est de X%
            (Le texte affiché peut comporter un certain nombre d'erreurs. En effet, la couche texte de ce facsimile a
            été
            généré automatiquement par un programme de reconnaissance des écritures manuscrites (HTR).)</p>
        </div>
      </div>
      <FacSimileNavigation
          :selected-nav="selectedNav"
          :register-to-open="endpVolume"
          :year-to-open="registerPageDate"
          @update-mirador="handleMiradorUpdate"/>
    </div>

    <div class='column'>
      <!-- Toggle left column button -->
      <button @click="toggleNav" class="btn-expanded-nav" :class="{ 'is-opened': isNavOpen }" />

      <!-- Title section -->
      <div class="header">
        <p class="facsimile-title" v-if="!registerPageDate">Collection des fac-similés de registres de conclusions capitulaires</p>
        <p class="facsimile-title" v-if="registerPageDate">Fac-similé du registre de conclusions capitulaires {{ endpVolume }} de
          Notre-Dame de Paris - <span class="date-title">{{ registerPageDate }}</span></p>
      </div>
      <!-- Mirador viewer section -->
      <div class='container-mirador'>
        <div id='mirador'></div>
      </div>
      <!-- Raw predictions section -->
      <div class="header raw-prediction-card-parent">
        <div class="card" v-if="endpVolume">
          <div class="card-header" @click="toggleCard('card3')">
            <p class="card-header-title">
              Accéder à la prédiction texte brut
              <button class="card-header-toggle" />
            </p>
          </div>
          <div class="card-content raw-prediction-text" v-if="metadataCardsState.card3">
            <div :class="['notification', {'is-success': showCopyConfirmation, 'is-danger': showCopyError}]"
                 v-if="showCopyConfirmation || showCopyError">
              <p v-if="showCopyConfirmation">Le texte a été copié dans le presse-papiers !</p>
              <p v-else>Impossible de copier le texte dans le presse-papiers ! Veuillez réessayer plus tard.</p>
            </div>
            <button @click="copyToClipboard" class="button is-small is-info">
              <i class="fas fa-copy"></i>
            </button>
            <br>
            <br>
            <p><u>Note</u> : <i>L'ordre des lignes de texte peut ne pas correspondre à l'ordre des lignes du fac-similé.</i>
            </p>
            <hr>
            <!-- create a spinner when the text is loading -->
            <div v-if="loadPredictionText" class="loader-wrapper">
              <div class="loader is-loading"></div>
            </div>
            <div v-html="rawPredictionText"></div>
          </div>
        </div>
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
      selectedNav: {
      register: null,
      year: null,
      canvasID: null,
    },
      metadataCardsState: {
        card1: true,
        card2: false,
        card3: false,
      },
      citationUrl: '',
      viewer: null,
      windowId: "document",
      imageNakalaSrc: `${this.nakalaAppService}collection/${this.nakalaDoiImages}`,
      altoNakalaSrc: "",
      registerPageDate: "",
      rawPredictionText: "",
      showCopyConfirmation: false,
      showCopyError: false,
      loadPredictionText: false,
      isNavOpen: true,
      endpVolumeManifest() {
        return this.endpVolume === "collection" || this.canvasId === "top"
            ? `${this.iiifEncService}collection/top`
            : `${this.iiifEncService}${this.endpVolume}/manifest`;
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
          'miradorSettings',
          'mappingSha1VolumesJSON',
          'iiifEncService',
          'nakalaAppService',
          'nakalaApiService',
          'nakalaApiIIIFService',
          'nakalaDoiImages'
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
    async copyToClipboard() {
      const plainText = this._htmlToPlainText(this.rawPredictionText);
      let notificationType;
      if (navigator.clipboard && window.isSecureContext) {
        try {
          notificationType = await navigator.clipboard.writeText(plainText)
              .then(() => "success")
              .catch(() => "error");
        } catch (e) {
          notificationType = "error";
        }
      } else {
        notificationType = "error";
      }
      this.showCopyNotification(notificationType);
    },

    /**
     * Show a notification when the text is copied to the clipboard
     * @param {string} type - Le type de notification ('success' ou 'error').
     */
    showCopyNotification(type) {
      const propName = type === "success" ? 'showCopyConfirmation' : 'showCopyError';
      this[propName] = true;
      setTimeout(() => {
        this[propName] = false;
      }, 2000);
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
        ...this.miradorSettings,
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
            .replace(this.nakalaApiIIIFService, this.nakalaAppService)
            .replace("/Canvas/", "#");

        const sha1 = canvasIDUrl.split("/")[(canvasIDUrl.split("/").length - 1)];

        const canvasObject = Object(this.mappingSha1VolumesJSON[sha1]);

        this.altoNakalaSrc = canvasObject.alto_nakala_url;

        // test if canvasObject is empty
        if (Object.keys(canvasObject).length === 0) {
          this.imageNakalaSrc = `${this.nakalaAppService}collection/${this.nakalaDoiImages}`;
        } else {
          this.imageNakalaSrc = nakalaUrlImageSrc;
        }

        this.citationUrl = window.location;

        this.$store.commit('setEndpVolume', canvasObject['volume_identifier']);
        this.$store.commit('setCanvasId', canvasObject['canvas_index']);
        this.registerPageDate = canvasObject['date_full'];
        this.selectedNav = {
        'register': this.endpVolume,
        'canvas': this.canvasId,
        'year': this.registerPageDate,
      }
      });
    },

    /**
     * Get & display the raw HTR prediction text in correct HTML format from the XML ALTO (fetched from Nakala API)
     * @param url
     * @returns null
     */
    async fetchAndDisplayXML() {
      this.loadPredictionText = true;
      try {
        const response = await fetch(this.altoNakalaSrc);
        const xml = await response.text();
        this.rawPredictionText = this._formatXmlAltoToHtml(xml);
        this.loadPredictionText = false;
      } catch (error) {
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

.facsimile-columns {
  gap: 45px;
}

.facsimile-columns > .column:first-child {
  padding: 90px 0 0;
}

.facsimile-columns > .column:first-child {
  max-width: 465px;
}

.facsimile-columns > .column:last-child {
  background-color: var(--panel-bg-color);
  padding: 0;
}

.facsimile-columns > .column:last-child > div {
  width: 100%;
  padding: 26px 26px;
}

.facsimile-columns > .column:last-child > div.raw-prediction-card-parent {
  padding: 26px 0;
}

.container-mirador {
  width: 100%;
  padding: 0;
}

.header {
  display: block;
  width: 82%;
  flex-direction: row;
}

.facsimile-title {
  margin: 45px 0;
  font-size: 26px;
  font-weight: 400;
  font-style: italic;
  line-height: 33px;
  color: #7B0C12;
}

.facsimile-title:after {
  content: "";
  display: block;
  width: 44px;
  height: 8px;
  margin: 20px 0;
  border-top: solid var(--light-brown-alt) 8px;
}

.date-title {
  text-transform: capitalize;
}

.raw-prediction-card-parent > * {
  width: 100%;
}

.raw-prediction-card-parent .card-header {
  background-color: #ffffff;
}

.card-header-title {
  display: flex;
  justify-content: space-between;
  padding: 20px;

  font-size: 24px;
  color: #272727;
  font-weight: 400;
  font-style: italic;
}

.card-header-toggle {
  display: inline-block;
  width: 27px;
  height: 27px;
  background: transparent url('~@/assets/images/b_Open_liste.svg') center / cover no-repeat;
  border: none;
  cursor: pointer;
}

.card.is-opened .card-header-toggle {
  background-image: url('~@/assets/images/b_Close_liste.svg');
}

.card-header:hover {
  cursor: pointer;
}

.card-content {
  margin-bottom: 40px;
  background-color: var(--panel-bg-color);
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
  border: none;
}

::v-deep .mosaic-tile {
  margin: 0;
  border: none;
}

tspan {
  font-size: 1px !important;
  font-weight: normal !important;
}

.btn-expanded-nav {
  display: inline-block;
  width: 25px;
  height: 25px;
  margin: 26px 0 0 26px;
  background: transparent url('~@/assets/images/b_closeW.svg') center / cover no-repeat;
  border: none;
}

.btn-expanded-nav.is-opened {
  background-image: url('~@/assets/images/b_openW.svg');
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
  color: #000000;
  font-family: 'Times New Roman', Times, serif;
}

.notification.is-danger {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  color: #000000;
  font-family: 'Times New Roman', Times, serif;
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
  width: 100px;
  height: 100px;
}

.is-active {
  opacity: 0;
}

.nakala-metadata-wrapper .nakala-image {
  max-width: 2rem;
  margin-right: -1rem;
}
</style>
