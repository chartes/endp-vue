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
              @keyup.enter="launchSearch"
              v-model="personQuery">
        </p>
        <p class="control">
          <button class="button is-info" @click="launchSearch">
            <span>Recherche</span>
          </button>
        </p>
      </div>
      <p class="control control-slider">
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
    /**
     * Launch the search
     * @emits update:query
     */
    launchSearch() {
      const trimmedQuery = this.personQuery.trim();
      if (trimmedQuery) {
        this.$emit("update:query", {
          query: trimmedQuery,
          search_type: this.typeOptions[this.searchType],
        });
      }
    },

    /**
     * Reset the search and results
     * @emits reset:query
     */
    resetSearch() {
      this.resetBtn = false;
      this.personQuery = "";
      this.$emit("reset:query");
    },
  },
};
</script>

<style scoped>
.field.has-addons {
  display: flex;
  align-items: center;
  margin-top: 0.5em;
  padding: 1rem;
}

.field.has-addons > *:not(:last-child) {
  margin-right: 0.5em;
}

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

button.button.is-info {
  background-color: #303030;
  border-radius: 2px;
  font-family: var(--font-secondary);
  font-size: 18px;
  font-weight: 500;
  color: #FFFFFF;
  text-align: center;
  text-transform: uppercase;
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

.control-slider {
  margin-top: 1rem;
  margin-left: 1rem;
}

.container-search {
  background-color: var(--panel-bg-color);
}

input {
  border: none;
  border-bottom: solid 1px var(--light-brown);
  border-radius: 0;
}

.subtitle {
  font-size: 24px;
  color: #272727;
  font-weight: 400;
  font-style: italic;
}

</style>