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
        <input class="input" type="text" placeholder="Votre recherche" v-model="NoSketchTermSearch"
               @focus="showHelp = true"
               @input="showHelp = false">
        <div class="popup" v-if="showHelp & !fuzzySearch">
          <div class="chevron"></div>
          <div class="popup-content">
            <!-- add cross to close the popup -->
            <div class="close-info-popup" @click="closeInfoPopup"></div>
            <u>Note</u> : la recherche est actuellement sensible à la casse et supporte les expressions régulières (regex).
          </div>
        </div>
      </div>
      <p class="control">
        <!-- checkbox for fuzzy search -->
        <button class="button is-info" @click="goNoSketchResults">Rechercher</button>
      </p>
      <input type="checkbox" id="fuzzy-search" name="fuzzy-search" v-model="fuzzySearch">
      <label for="fuzzy-search"> Recherche floue</label>
      <!-- Fieldset for fuzzy search parameters -->
       <fieldset v-if="fuzzySearch" class="fuzzy-search-parameters-section">
        <legend class="fuzzy-search-section-title">Paramètres</legend>

        <div class="fuzzy-search-parameter">
          <p class="control control-slider">
            <input
              id="slider"
              name="slider"
              type="range"
              class="slider"
              min="0"
              max="2"
              v-model.number="selectedThreshold"
            >
            <label for="slider" class="slider-label control-add">
              <span class="slider-label__value">{{ thresholdConverted[selectedThreshold] }}</span>
            </label>
          </p>
        </div>

        <div class="fuzzy-search-parameter">
          <label for="candidates">Nombre de candidats</label>
          <select id="candidates" v-model="selectedCandidate" class="fuzzy-select-candidates">
            <option v-for="candidate in candidatesChoices" :key="candidate" :value="candidate">
              {{ candidate }}
            </option>
          </select>
        </div>

      </fieldset>
      <a href="https://www.sketchengine.eu/quick-start-guide/" target="_blank" title="Guide utilisateur de NoSketch">
        <img src="@/assets/icons/no-sketch-engine-logo.png" alt="Logo" class="image sketch-image"/>
      </a>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import Fuse from "fuse.js";

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
      fuzzySearch: false,
      fuse: null,
      terms: [],
      candidatesChoices: [
        10, 20, 50, 100
      ],
      thresholdChoices: {
        "faible": "0.3",
        "moyenne": "0.5",
        "élevée": "0.8"
      },
      thresholdConverted: ["faible", "moyenne", "élevée"],
      selectedCandidate: 20,
      selectedThreshold: 1 // Par défaut à "moyenne" (index 1 dans thresholdConverted)
    }
  },
  computed: {
    ...mapState(["noSketchService", "fuseIndexJSON", "fuseTermsJSON"])
  },
  created() {
    try {
      this.terms = this.fuseTermsJSON;
      const index = this.fuseIndexJSON;
      const fuseIndex = Fuse.parseIndex(index);

      // Show doc for default values: https://www.fusejs.io/api/options.html#keys
      const options = {
        keys: ["title"],
        threshold: this.thresholdChoices[this.selectedThreshold], // Threshold for the fuzzy search. 0.0 is perfect match, 1.0 would match anything.
        //distance: 100, // Maximum distance from the pattern. set to default value.
      };
      this.fuse = new Fuse(this.terms, options, fuseIndex);
    } catch (error) {
      console.error("Failed to initialize Fuse:", error);
    }
  },
  methods: {
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
    goNoSketchResults() {
      if (this.fuzzySearch && this.fuse) {
        let tempNoSketchTermSearch = this.NoSketchTermSearch;
        const results = this.fuse
            .search(this.NoSketchTermSearch, {limit: this.selectedCandidate})
            .map((result) => result.item);
        console.log("Results:", results)
        this.NoSketchTermSearch = results.map((result) => result.title).join("|");
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

.input {
  width: calc(100% - 12px);
  height: 2.75em;
  border: none;
  border-bottom: 1px solid var(--light-brown);
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
  top: 55px; /* Adjust based on the height of the input field */
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
  left: 20px; /* Adjust to align the chevron with the input */
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid var(--light-brown);
}

.popup::after {
  content: "";
  position: absolute;
  top: -11px;
  left: 19px; /* Adjust to align the chevron with the input */
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
  margin-top: 8px;
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

.slider {
  width: 96px;
  height: 1px;
  margin: 0;
  background-color: var(--light-brown) !important;
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

</style>