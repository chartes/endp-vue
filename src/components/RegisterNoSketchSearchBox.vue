<template>
  <div class="box box-container-facets__nosketch_search">
    <div class="box-header is-flex is-justify-content-space-between">
      <p class="subtitle nosketch_search-container__label is-5" @click="toggleBox">
        <span>Recherche dans les registres</span>
      </p>
      <button @click="toggleBox($event)" class="open-nosketch-search" :class="isBoxExpanded ? 'is-opened' : ''"/>
    </div>
    <div class="container-search" v-if="isBoxExpanded">
      <div class="help">Pour la période {{ yearRange[0] }}-{{ yearRange[1] }}</div>
      <div class="control">
        <input class="input" type="text" placeholder="Votre recherche"
               v-model="NoSketchTermSearch"
               @focus="showHelp = true"
               @input="showHelp = false"
               :class="{'input-fuzzy': fuzzySearch, 'input-normal': !fuzzySearch}"
        >
        <div class="popup" v-if="showHelp & !fuzzySearch">
          <div class="chevron"></div>
          <div class="popup-content">
            <!-- add cross to close the popup -->
            <div class="close-info-popup" @click="closeInfoPopup"></div>
            <u>Note</u> : la recherche est actuellement sensible à la casse et supporte les expressions régulières
            (regex).
          </div>
        </div>
      </div>
      <div class="control fuzzy-search-parameter">
        <label class="switch-label">
          <input type="checkbox" v-model="fuzzyEnabled">
          <span class="switch-slider"></span>
          <span class="switch-text">Recherche floue</span>
        </label>
        <p class="control control-slider" v-if="fuzzySearch">
          <input
              id="slider"
              name="slider"
              type="range"
              class="slider slider-fuzzy"
              min="0"
              max="2"
              v-model.number="selectedThreshold"
          >
          <label for="slider" class="slider-label control-add">
            <span class="slider-label__value">{{ thresholdConverted[selectedThreshold] }}</span><span
              v-if="fuzzySearch"></span>
          </label>
        </p>
      </div>
      <p class="control">
        <button class="button is-info" @click="goNoSketchResults">Rechercher</button>
      </p>
      <a href="https://www.sketchengine.eu/quick-start-guide/" target="_blank" title="Guide utilisateur de NoSketch">
        <img src="@/assets/icons/no-sketch-engine-logo.png" alt="Logo" class="image sketch-image"/>
      </a>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import MiniSearch from "minisearch";

export default {
  name: "RegisterNoSketchSearchBox",
  props: {
    yearRange: {
      type: Array,
      default: () => [0, 0]
    },
  },
  data() {
    return {
      NoSketchTermSearch: "",
      isBoxExpanded: false,
      showHelp: false,
      terms: [],
      fuzzyEnabled: false,
      thresholdChoices: {
        "faible": 0.15,
        "moyenne": 0.25,
        "élevée": 0.4
      },
      miniSearchInstance: null,
      thresholdConverted: ["faible", "moyenne", "élevée"],
      selectedCandidate: 3000,
      selectedThreshold: 0
    }
  },
  computed: {
    ...mapState(["noSketchService", "StructTermsSearchIndexJSON", "miniSearchInstanceCache"]),
    fuzzySearch() {
      return this.fuzzyEnabled;
    }
  },
  methods: {
    async initMiniSearchIfNeeded() {
      if (!this.miniSearchInstance) {
        const json = JSON.stringify(this.StructTermsSearchIndexJSON)
        let miniSearchInstance = await MiniSearch.loadJSONAsync(
            json,
            {
              fields: ['text'],
            })
        this.$store.commit("setMiniSearchInstanceCache", miniSearchInstance);
      }
    },
    /**
     * Prepare the NoSketch request
     * @private
     * @returns {string}
     */
    _prepareNoSketchRequest() {
      let wordsSplitted = this.NoSketchTermSearch.split(" ");
      let wordsPrepared = wordsSplitted.map(word => `[${(this.fuzzySearch) ? "lc" : "word"}="${word}"]`).join("")
      wordsPrepared = wordsPrepared.replace(/\[word=""]/g, "");
      let cqlQuery = encodeURIComponent(`${wordsPrepared} within <doc (date >="${this.yearRange[0]}") & (date<="${this.yearRange[1]}") />`);
      let baseNoSketchUrl = `${this.noSketchService}#concordance`;
      let queryParams = `corpname=endp&tab=advanced&queryselector=cql&attrs=word&viewmode=kwic&attr_allpos=all&refs_up=0&shorten_refs=1&glue=1&gdexcnt=300&show_gdex_scores=0&itemsPerPage=20&structs=s%2Cg&refs=%3Ddoc.id&default_attr=word&cql=${cqlQuery}&showresults=1&showTBL=0&tbl_template=&gdexconf=&f_tab=basic&f_showrelfrq=1&f_showperc=0&f_showreldens=0&f_showreltt=0&c_custom=`;
      return `${baseNoSketchUrl}?${queryParams}`;
    },

    /**
     * Open the NoSketch request in a new tab
     * @returns {Window}
     */
    async goNoSketchResults() {
      if (this.fuzzySearch) {
        if (!this.miniSearchInstanceCache) {
          await this.initMiniSearchIfNeeded();
        }
        const label = this.thresholdConverted[this.selectedThreshold];
        const threshold = this.thresholdChoices[label];

        let tempNoSketchTermSearch = this.NoSketchTermSearch;

        let results = this.miniSearchInstanceCache.search(
            this.NoSketchTermSearch,
            {fuzzy: threshold}
        ).slice(
            0,
            this.selectedCandidate
        ).map(
            (result) => result.text
        )

        this.NoSketchTermSearch = results.join("|");
        window.open(this._prepareNoSketchRequest(), "_blank");
        this.NoSketchTermSearch = tempNoSketchTermSearch;
      } else if (!this.fuzzySearch) {
        window.open(this._prepareNoSketchRequest(), "_blank");
      } else {
        console.error("Fuse is not initialized");
      }
    },
    /**
     * Toggle the box
     * @param event
     * @returns {boolean}
     */
    toggleBox(event) {
      event.stopPropagation();
      this.isBoxExpanded = !this.isBoxExpanded;
      this.showHelp = false;
    },
    closeInfoPopup() {
      this.showHelp = false;
    }
  }
}
</script>

<style scoped>

.box-header {
  width: 100%;
}

.container-search {
  position: relative;
}

.container-search .image {
  position: absolute;
  bottom: 0;
  right: 10px;

  width: 31px;
  height: auto;
}

.box-container-facets__nosketch_search {
  border-top: solid 1px #D0D0D0;
  border-bottom: solid 1px #D0D0D0;
  margin-bottom: 1rem;
  margin-top: 1rem;
}

.nosketch_search-container__label {
  margin-bottom: 0;
  font-size: 24px;
  font-weight: 400;
  font-style: italic;
  color: #272727;
  cursor: pointer;
}

.nosketch_search-container__label {
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
}

.nosketch_search-container__label > * {
  margin-right: 0.5rem;
}

.help {
  width: 100%;
  margin: 35px 0 15px;
  font-family: var(--font-secondary);
  font-size: 18px;
  font-weight: 500;
  color: #4A4A4A;
  text-align: center;
}

.input-normal {
  width: calc(100% - 12px);
  height: 2.75em;
  border: none;
  border-bottom: 1px solid var(--light-brown);
}

.input-fuzzy {
  width: calc(100% - 12px);
  height: 2.75em;
  border: none;
  border-bottom: 1px solid #3bb163 !important;
}

input::placeholder {
  font-family: var(--font-secondary);
  font-size: 22px;
  font-weight: 400;
  color: #B4B4B4;
  opacity: 0.75;
}


.control {
  text-align: center;
}

button.is-info {
  height: auto;
  padding: 6px 15px 8px;
  background-color: #303030;
  border-radius: 2px;
  margin: 20px 0 50px;

  font-family: var(--font-secondary);
  font-size: 18px;
  text-align: center;
  font-weight: 500;
  line-height: 1;
  color: #FFFFFF;
  text-transform: uppercase;
}

button.is-info:hover {
  background-color: var(--light-brown) !important;
}


.open-nosketch-search {
  display: inline-block;
  width: 27px;
  height: 27px;
  border: none;
  background: url("@/assets/images/b_Open_20x20.svg") center / cover;
  cursor: pointer;
}

.open-nosketch-search.is-opened {
  background: url("@/assets/images/b_Close_20x20.svg") center / 20px auto no-repeat;
}

@media screen and (max-width: 1024px) {

  button.is-info {
    padding: 13px 35px 15px;
  }

}

.help {
  width: 100%;
  margin: 40px 0 30px;
  font-family: var(--font-secondary);
  font-size: 18px;
  font-weight: 500;
  color: #4A4A4A;
  text-align: center;
}

.popup {
  position: absolute;
  top: 55px;
  left: 0;
  width: calc(100% - 12px);
  background: white;
  border: 1px solid var(--light-brown);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
  font-size: 15px;
  z-index: 1000;
  border-radius: 4px;
}

.popup::before {
  content: "";
  position: absolute;
  top: -10px;
  left: 20px;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid var(--light-brown);
}

.popup::after {
  content: "";
  position: absolute;
  top: -11px;
  left: 19px;
  border-left: 11px solid transparent;
  border-right: 11px solid transparent;
  border-bottom: 11px solid var(--light-brown);
}

.popup-content {
  text-align: left;
}

.close-info-popup {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 12px;
  height: 12px;
  background: url("@/assets/images/b_Close_20x20.svg") center / cover;
  cursor: pointer;
}

.fuzzy-search-parameters-section {
  margin-top: 10px;
  padding: 13px;
  border-radius: 10px;
  background-color: #f5f5f5;
  border-top: 1px solid #D0D0D0;
}

@media screen and (max-width: 1024px) {
  .fuzzy-search-parameters-section {
    padding: 5px;
  }
}

.fuzzy-search-section-title {
  font-size: 13px;
  font-weight: 600;
  color: #4A4A4A;
  padding: 0 5px;
}

.fuzzy-search-parameter {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 30px;
  padding: 6px 15px 8px;
  font-size: 15px;
}

.fuzzy-select-candidates {
  width: 100px;
  height: 30px;
  border: 1px solid var(--light-brown);
  border-radius: 4px;
  padding: 0 5px;
  font-size: 15px;
}

.control-slider {
  display: flex;
  align-items: center;
}

.slider-normal {
  width: 96px;
  height: 1px;
  margin: 0;
  background-color: var(--light-brown) !important;
}

.slider-fuzzy {
  width: 96px;
  height: 1px;
  margin: 0;
  background-color: #3bb163 !important; /* vert */
}


input[type='range'].slider {
  -webkit-appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: var(--light-brown) !important;
  border-radius: 50%;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: var(--light-brown) !important;
  border-radius: 50%;
  cursor: pointer;
}

/* augment a little bit the size of the slider */
.slider {
  width: 100px;
  height: 2px;
}

/* Chrome, Safari, et d'autres navigateurs WebKit */
.slider::-webkit-slider-thumb {
  /* remove border color */
  border: none;
}

.slider::-webkit-slider-thumb:hover {
  box-shadow: 0 0 2px 13px rgba(231, 101, 101, 0.3);
  transition: box-shadow 0.3s;
}

.slider::-webkit-slider-thumb:active {
  box-shadow: 0 0 2px 19px rgba(231, 101, 101, 0.3);
  transition: box-shadow 0.3s;
}

/* Firefox */
.slider::-moz-range-thumb {
  border: none;
}

.slider::-moz-range-thumb:hover {
  box-shadow: 0 0 2px 13px rgba(231, 101, 101, 0.3);
  transition: box-shadow 0.3s;
}

.slider::-moz-range-thumb:active {
  box-shadow: 0 0 2px 19px rgba(231, 101, 101, 0.3);
  transition: box-shadow 0.3s;
}

.slider-label {
  padding: 0.25em 0.5em;

  font-family: var(--font-secondary);
  font-size: 20px;
  font-weight: 400;
  line-height: 1;
  color: #6E6E6E;
  text-transform: capitalize;
  white-space: nowrap;
}

.slider-normal::-webkit-slider-thumb {
  background: var(--light-brown) !important;
}

.slider-normal::-moz-range-thumb {
  background: var(--light-brown) !important;
}

.slider-fuzzy::-webkit-slider-thumb {
  background: #3bb163 !important; /* vert */
}

.slider-fuzzy::-moz-range-thumb {
  background: #3bb163 !important; /* vert */
}

.slider-fuzzy::-webkit-slider-thumb:hover {
  box-shadow: 0 0 2px 13px rgba(59, 177, 99, 0.3);
}

.slider-fuzzy::-webkit-slider-thumb:active {
  box-shadow: 0 0 2px 19px rgba(59, 177, 99, 0.3);
}

.slider-fuzzy::-moz-range-thumb:hover {
  box-shadow: 0 0 2px 13px rgba(59, 177, 99, 0.3);
}

.slider-fuzzy::-moz-range-thumb:active {
  box-shadow: 0 0 2px 19px rgba(59, 177, 99, 0.3);
}

.switch-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.switch-slider {
  width: 40px;
  height: 20px;
  background-color: #ccc;
  border-radius: 20px;
  position: relative;
  transition: background-color 0.2s;
}

.switch-slider::before {
  content: "";
  position: absolute;
  width: 18px;
  height: 18px;
  left: 1px;
  top: 1px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.2s;
}

input[type="checkbox"] {
  display: none;
}

input[type="checkbox"] + .switch-slider {
  background-color: #ccc;
}

input[type="checkbox"]:checked + .switch-slider {
  background-color: #3bb163;
}

input[type="checkbox"]:checked + .switch-slider::before {
  transform: translateX(20px);
}

.switch-text {
  font-size: 16px;
}

</style>