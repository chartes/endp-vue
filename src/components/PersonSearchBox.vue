<template>
  <div class="box box-container-facets__person_search">
    <div class="box-header">
      <p class="subtitle persons_search-container__label is-5">
        <span>Rechercher des personnes</span>
      </p>
    </div>
    <div class="container-search" :class="{'has-button-reset': resetBtn}">
      <div class="control field has-addons">
        <p class="control">
          <input
              class="input"
              type="text"
              placeholder="Votre recherche"
              @keyup.enter="launchSearch"
              v-model="personQuery">
        </p>
        <p class="control control-button">
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
  padding-bottom: 60px;
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
  position: absolute;
  bottom:10px;
  left:25px;
  padding: 0;
}

.field.has-addons {
  display: flex;
  align-items: center;
  margin-top: 0.5em;
  padding: 20px 25px 20px;
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

input[type='range'].slider {
  -webkit-appearance: none;
}

.slider {
  width: 96px;
  height: 1px;
  margin: 0;
  background-color: var(--light-brown) !important;
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
  display: inline-block;
  width: 40px;
  height: 40px;
  margin-bottom: 0.3rem;
  margin-top: 1rem !important;
  background: url("@/assets/images/b_Recherche_reset.svg") center / cover;
  border: none;
}

.btn-reset:hover {
  background-image: url("@/assets/images/b_Recherche_reset_over.svg");
}

.btn-reset .icon {
  display: none;
}

.btn-reset:focus,
button.button.is-info:focus {
  outline: none;
  box-shadow: none;
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

@media screen and (max-width: 1024px) {

  .container-search {
    padding-bottom: 220px;
    text-align: center;
  }

  .container-search.has-button-reset {
    padding-bottom: 220px;
  }

  .container-search > .control {
    margin-bottom: 0;
  }

  .field.has-addons {
    position: unset;
  }

  .field.has-addons > :not(:last-child) {
    margin-right: 0;
  }

  .control-slider {
    justify-content: center;
    padding: 0;
  }

  .control-button {
    position: absolute;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
  }

  .container-search > p:last-child {
    width: 100%;
    position: absolute;
    bottom: 10px;
    left: 0;
    margin-left: 20px;
  }

  .btn-reset {
    transform: translateX(-50%);
  }
}

</style>