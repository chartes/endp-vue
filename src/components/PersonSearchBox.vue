<template>
  <div class="box box-container-facets__person_search">
    <div class="box-header">
      <p class="subtitle persons_search-container__label is-5">
        <span>Rechercher des personnes</span>
      </p>
    </div>
    <div class="container-search">
      <div class="control field has-addons">
        <p class="control">
          <input
              class="input"
              type="text"
              placeholder="Votre recherche"
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

.container-search {
  display: flex;
  flex-wrap: wrap;
  background-color: var(--panel-bg-color);
  padding-bottom: 50px;
}

.container-search > div {
  flex: 100% 0 0;
}

.container-search > p {
  flex: 50% 0 0;
  margin: 0;
  padding-left: 30px;
  padding-bottom: 20px;
}

.container-search > p:first-child {
  padding: 0 0 30px 20px;
}

.container-search > p:last-child {
  padding: 0;
}

.field.has-addons {
  display: flex;
  align-items: center;
  margin-top: 0.5em;
  padding: 20px 25px 25px;
}

.field.has-addons > *:not(:last-child) {
  margin-right: 5px;
}

.field.has-addons > p:first-child {
  width: 100%;
}

.control-slider {
  display: flex;
  align-items: center;
}

.slider {
  width: 96px;
  height: 1px;
  margin: 0;
  background-color: #D74A52;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: #D74A52;
  border-radius: 50%;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #D74A52;
  border-radius: 50%;
  cursor: pointer;
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

button.button.is-info {
  height: auto;
  background-color: #303030;
  border-radius: 2px;
  font-family: var(--font-secondary);
  font-size: 18px;
  font-weight: 500;
  color: #FFFFFF;
  text-align: center;
  text-transform: uppercase;
  padding: 6px 20px 7px;
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

input[type="text"] {
  height: auto;
  border: none;
  border-bottom: solid 1px var(--light-brown);
  border-radius: 0;
  padding: 10px;
  line-height: 1.2;
}

input[type="text"]::placeholder {
  font-family: var(--font-secondary);
  font-size: 22px;
  font-weight: 400;
  color: #B4B4B4;
  opacity: 0.75;
}

.subtitle {
  padding-bottom: 12px;
  font-size: 24px;
  color: #272727;
  font-weight: 400;
  font-style: italic;
}

</style>