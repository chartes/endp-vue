<template>
  <div class="box box-container-facets__nosketch_search">
    <div class="box-header">
      <p class="subtitle nosketch_search-container__label is-5" @click="toggleBox">
        <img src="@/assets/icons/no-sketch-engine-logo.png" alt="Logo" class="image is-24x24">
        <span>Recherche via NoSketch Engine</span>
        <i :class="`fas ${isBoxExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`"></i>
      </p>
    </div>
    <transition name="slide-fade">
      <div class="container-search" v-if="isBoxExpanded">
        <div class="control has-icons-left field has-addons">
          <p class="control">
            <input class="input" type="text" placeholder="Rechercher" v-model="NoSketchTermSearch">
            <span class="icon is-left"><i class="fas fa-search"></i></span>
          </p>
          <p class="control">
            <button class="button is-info" @click="goNoSketchResults">Rechercher</button>
          </p>
        </div>
        <p class="help">Recherche dans le corpus du terme : <i>"{{ NoSketchTermSearch }}"</i> entre
          {{ yearRange[0] }} et {{ yearRange[1] }}</p>
      </div>
    </transition>
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

.box-container-facets__nosketch_search {
  border: 0.5px solid #0a0a0a;
  border-radius: 5px;
  margin-bottom: 1rem;
  margin-top: 1rem;
}

.nosketch_search-container__label {
  cursor: pointer;
}

.container-search > * {
  margin-top: 1.5rem;
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

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter, .slide-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>