<template>
  <div class="box box-container-facets__nosketch_search">
    <p class="subtitle nosketch_search-container__label is-5">
      <img src="@/assets/no-sketch-engine-logo.png" alt="Logo" class="image is-24x24">
      <span>Recherche via NoSketch Engine</span>
    </p>
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
</template>

<script>
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
      NoSketchTermSearch: ""
    }
  },
  methods: {
    goNoSketchResults() {
      let cqlQuery = encodeURIComponent(`[word="${this.NoSketchTermSearch}"] within <doc (date >="${this.yearRange[0]}") & (date<="${this.yearRange[1]}") />`);
      let baseNoSketchUrl = "https://nosketch-engine.lamop.fr/#concordance";
      let queryParams = `corpname=endp&tab=advanced&queryselector=cql&attrs=word&viewmode=kwic&attr_allpos=all&refs_up=0&shorten_refs=1&glue=1&gdexcnt=300&show_gdex_scores=0&itemsPerPage=20&structs=s%2Cg&refs=%3Ddoc.id&default_attr=word&cql=${cqlQuery}&showresults=1&showTBL=0&tbl_template=&gdexconf=&f_tab=basic&f_showrelfrq=1&f_showperc=0&f_showreldens=0&f_showreltt=0&c_customrange=0`;
      window.open(`${baseNoSketchUrl}?${queryParams}`);
    },
  }
}
</script>

<style scoped>
.box-container-facets__nosketch_search {
  border: 0.5px solid #0a0a0a;
  border-radius: 5px;
  margin-bottom: 1rem;
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
</style>