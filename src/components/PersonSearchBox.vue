<template>
  <div class="box box-container-facets__person_search">
    <div class="box-header">
      <p class="subtitle persons_search-container__label is-5">
        <span>Rechercher des personnes</span>
      </p>
    </div>
    <div class="container-search">
      <div class="control has-icons-left field has-addons">
        <p class="control">
          <span class="icon is-left"><i class="fas fa-search"></i></span>
          <input
              class="input"
              type="text"
              placeholder="personne"
              v-model="personQuery">
        </p>
        <p class="control">
          <button class="button is-info" @click="launchSearch">
            <span>Recherche</span>
          </button>
        </p>
        <p class="control">
          <input
              id="slider"
              name="slider"
              type="range"
              class="slider"
              min="0"
              max="2"
              v-model="searchType"
          >
          <label for="slider"
                 class="slider-label control-add">
            <span class="slider-label__value">{{ typeOptionsTranslated[searchType] }}</span>
          </label>
        </p>
      </div>
      <p class="control">
        <button class="button is-outlined btn-reset" :class="{'button-reset-search': !resetBtn}" @click="resetSearch">
          <span class="icon is-small"><i class="fas fa-undo"></i></span>
        </button>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "PersonSearchBox",
  data() {
    return {
      resetBtn: false,
      personQuery: "",
      searchType: 0,
      typeOptions: ["exact", "fuzzy", "very_fuzzy"],
      typeOptionsTranslated: ["exacte", "floue", "très floue"],
    };
  },
  watch: {
    personQuery(val) {
      if (val.trim() !== "") {
        this.resetBtn = true;
      } else {
        this.resetSearch();
      }
    }
  },
  methods: {
    launchSearch() {
      const trimmedQuery = this.personQuery.trim();
      if (trimmedQuery) {
        this.$emit("update:query", {
          query: trimmedQuery,
          search_type: this.typeOptions[this.searchType],
        });
      }
    },
    resetSearch() {
      this.resetBtn = false;
      this.personQuery = "";
      this.$emit("reset:query");
    },
  },
};
</script>

<style scoped>

/* align all the controls */
.field.has-addons {
  display: flex;
  align-items: center;
  margin-top: 0.5em;
}

/* space between the controls */
.field.has-addons > *:not(:last-child) {
  margin-right: 0.5em;
}

/* between label and slider */
.slider-label {
  margin-right: 0.5em;
  margin-left: 0.5em;
  border: 1px solid #dbdbdb;
  border-radius: 5px;
  background-color: #f5f5f5;
  padding: 0.25em 0.5em;
  font-size: 0.90rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #363636;

}

.btn-reset {
  margin-top: 1rem !important;
  margin-bottom: 0.3rem !important;
}

.btn-reset:hover {
  background-color: #8d1919 !important;
  color: white !important;
}

.button-reset-search {
  opacity: 0;
  display: none;
}

</style>