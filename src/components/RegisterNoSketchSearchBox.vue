<template>
  <div class="box box-container-facets__nosketch_search">
    <div class="box-header is-flex is-justify-content-space-between">
      <p class="subtitle nosketch_search-container__label is-5" @click="toggleBox">
        <span>Recherche dans les registres</span>
      </p>
      <button @click="toggleBox($event)" class="open-nosketch-search" :class="isBoxExpanded ? 'is-opened' : ''" />
    </div>
    <div class="container-search" v-if="isBoxExpanded">
      <div class="help">Pour la période {{ yearRange[0] }}-{{ yearRange[1] }}</div>
      <div class="control">
          <input class="input" type="text" placeholder="Votre recherche" v-model="NoSketchTermSearch">
      </div>
      <p class="control">
        <button class="button is-info" @click="goNoSketchResults">Rechercher</button>
      </p>
      <img src="@/assets/icons/no-sketch-engine-logo.png" alt="Logo" class="image sketch-image" />
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";

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
    }
  },
  computed: {
    ...mapState(["noSketchService"]),
  },
  methods: {
    /**
     * Prepare the NoSketch request
     * @private
     * @returns {string}
     */
    _prepareNoSketchRequest() {
      let cqlQuery = encodeURIComponent(`[word="${this.NoSketchTermSearch}"] within <doc (date >="${this.yearRange[0]}") & (date<="${this.yearRange[1]}") />`);
      let baseNoSketchUrl = `${this.noSketchService}#concordance`;
      let queryParams = `corpname=endp&tab=advanced&queryselector=cql&attrs=word&viewmode=kwic&attr_allpos=all&refs_up=0&shorten_refs=1&glue=1&gdexcnt=300&show_gdex_scores=0&itemsPerPage=20&structs=s%2Cg&refs=%3Ddoc.id&default_attr=word&cql=${cqlQuery}&showresults=1&showTBL=0&tbl_template=&gdexconf=&f_tab=basic&f_showrelfrq=1&f_showperc=0&f_showreldens=0&f_showreltt=0&c_custom=`;
      return `${baseNoSketchUrl}?${queryParams}`;
    },
    /**
     * Open the NoSketch request in a new tab
     * @returns {Window}
     */
    goNoSketchResults() {
      window.open(this._prepareNoSketchRequest(), "_blank");
    },
    /**
     * Toggle the box
     * @param event
     * @returns {boolean}
     */
    toggleBox(event) {
      event.stopPropagation();
      this.isBoxExpanded = !this.isBoxExpanded;
    },
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
</style>