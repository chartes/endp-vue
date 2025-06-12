<template>
  <div class="facet-filter-container">
    <span
        :class="[
    'advanced_search_header',
    title === 'Termes' ? 'search-header-terms' : 'search-header-places'
  ]"
    >
  {{ title }}
      <a class="index-link"
        :href="[
          title === 'Termes'
            ? `${this.personDbAdminShow}/admin/thesaurusterm/`
            : `${this.personDbAdminShow}/admin/placesterm/`
        ]"
        target="_blank"
      >index</a>
</span>
    <div class="search-bar">
      <input
          type="text"
          v-model="searchQuery"
          :placeholder="title === 'Termes' ? 'Gardien' : 'Chapelle de saint Eutrope'"
          @focus="showDropdown = true"
          @input="filterTerms"
          class="input"
      />
      <ul v-if="searchQuery !== ''" class="autocomplete-list">
        <template v-for="(terms, topic) in filteredTermsGrouped" :key="topic">
          <li class="topic-header">{{ topic }}</li>
          <li
              v-for="term in terms"
              :key="term._id_endp"
              @mousedown.prevent="handleTermSelection(term)"
              class="autocomplete-item"
          >
            {{ term.term_fr || term.term_la }}
          </li>
        </template>
      </ul>
    </div>
    <div class="selected-terms" v-if="selectedTerms.length > 0">
      <span class="active-tags">
        <span class="active-tags-labels">filtres actifs</span>
        <button @click="selectedTerms = []" class="active-tags-delete-btn">✖</button>
      </span>
      <div class="tags">
        <div v-for="term in selectedTerms" :key="term._id_endp" class="tag">
          <span>{{ term.term_fr || term.term_la }}</span>
          <button @click="removeTerm(term)">✖</button>
        </div>
      </div>
    </div>
    <p v-if="isLoading">Chargement des données...</p>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "FacetFilter",
  props: {
    title: {
      type: String,
      default: "Facette",
    },
    apiUrl: {
      type: String,
      required: true,
    },
    filterType: {
      type: String,
      required: true,
      validator: (value) => ['places', 'persons_terms'].includes(value),
    },
    reset: {
      type: Boolean,
      default: false,
    },
    initialSelectedIds: {
      type: Array,
      default: () => [],
    }
  },
  data() {
    return {
      terms: [],
      searchQuery: "",
      filteredTermsGrouped: {},
      selectedTerms: [],
      isLoading: false,
      showDropdown: false,
    };
  },
  computed: {
    ...mapState(["personDbAdminShow"])
  },
  watch: {
    selectedTerms: {
      handler(newValue) {
        this.$emit("update:selectedTerms", {
          type: this.filterType,
          terms: newValue.map(t => t._id_endp),
        });
      },
      deep: true,
    },
    reset(newVal) {
      if (newVal) {
        this.selectedTerms = [];
      }
    }
  },
  methods: {
    async fetchTerms() {
      try {
        this.isLoading = true;
        const allTerms = [];
        let currentPage = 1;
        let totalPages = 1;

        do {
          const response = await fetch(`${this.apiUrl}&page=${currentPage}&size=100`);
          const data = await response.json();
          allTerms.push(...data.items);
          totalPages = data.pages;
          currentPage += 1;
        } while (currentPage <= totalPages);

        this.terms = allTerms;
        this.groupTerms();

        this.selectedTerms = this.terms.filter(term =>
            this.initialSelectedIds.includes(term._id_endp)
        );

        this.isLoading = false;
      } catch (error) {
        console.error("Erreur lors de la récupération des termes :", error);
        this.isLoading = false;
      }
    },
    groupTerms() {
      this.filteredTermsGrouped = this.terms.reduce((acc, term) => {
        const topic = term.topic || "Autre";
        if (!acc[topic]) acc[topic] = [];
        acc[topic].push(term);
        return acc;
      }, {});
    },
    filterTerms() {
      const query = this.searchQuery.toLowerCase();
      const filtered = this.terms.filter(
          (term) =>
              (term.term_fr && term.term_fr.toLowerCase().includes(query)) ||
              (term.term_la && term.term_la.toLowerCase().includes(query))
      );

      this.filteredTermsGrouped = filtered.reduce((acc, term) => {
        const topic = term.topic || "Autre";
        if (!acc[topic]) acc[topic] = [];
        acc[topic].push(term);
        return acc;
      }, {});
    },
    handleTermSelection(term) {
      this.addTerm(term);
      this.searchQuery = "";
      this.showDropdown = true;
    },
    addTerm(term) {
      if (!this.selectedTerms.find((t) => t._id_endp === term._id_endp)) {
        this.selectedTerms.push(term);
      }
    },
    removeTerm(term) {
      this.selectedTerms = this.selectedTerms.filter((t) => t._id_endp !== term._id_endp);
    },
  },
  mounted() {
    this.fetchTerms();
  },
};
</script>

<style scoped>
.facet-filter-container {
  max-width: 600px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  background-color: var(--panel-bg-color);
  border-top: 12px solid #ffffff;
  padding-top: 20px;
  padding-left: 25px;
  padding-right: 25px;
  padding-bottom: 60px;
}

.search-bar {
  position: relative;
  margin-bottom: 20px;
  box-sizing: border-box;
  clear: both;
  font-size: 1rem;
  text-align: inherit;
  padding-left: 0;
  padding-top: 20px;
}

input[type="text"] {
  height: 60%;
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

.autocomplete-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-top: none;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  list-style: none;
  padding: 0;
  margin: 0;
}

.topic-header {
  font-weight: bold;
  padding: 10px;
  background-color: #f4f4f4;
}

.autocomplete-item {
  padding: 10px;
  cursor: pointer;
}

.autocomplete-item:hover {
  background: #f0f0f0;
}

.selected-terms .tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  display: inline-flex;
  align-items: center;
  background: #e0e0e0;
  padding: 1px 8px;
  border-radius: 5px;
  font-size: 18px;
  width: auto;
  max-width: 100%;
  margin-bottom: 5px;
}

.tag span {
  max-width: calc(100% - 20px);
  text-overflow: ellipsis;
  overflow: hidden;
}

.tag button {
  width: 15px;
  height: 15px;
  background: url('~@/assets/images/filtre_close2.svg') center / cover no-repeat;
  border: none;
  margin-left: 10px;
  text-indent: -9999px;
  cursor: pointer;
}

.advanced_search_header {
  font-family: var(--font-secondary);
  font-weight: 400;
  font-size: 24px;
  color: #6E6E6E;
  padding-left: 41px;
  padding-top: 8px;
  padding-bottom: 8px;
}

.search-header-terms {
  background: url('~@/assets/images/pic Person.svg') left top / 27px auto no-repeat;
}

.search-header-places {
  background: url('~@/assets/images/pic Lieu.svg') 0 no-repeat;
}

.active-tags {
  display: flex;
  align-items: center;
  margin: 40px 0 15px;
}

.tag {
  margin: 0 !important;
  background-color: #707070;
  border-radius: 5px;
  font-size: 18px;
  font-weight: 400;
  color: #FFFFFF;
}

.active-tags-delete-btn {
  border: none;
  cursor: pointer;
  width: 20px;
  height: 20px;
  background: url('~@/assets/images/filtre_close.svg') center / cover no-repeat;
  margin: 0 0 0 13px;
  padding: 0;
  text-indent: -9999px;
}

.active-tags-delete-btn:hover,
.tag button:hover {
  color: #D74A52;
}


.active-tags-labels {
  font-family: var(--font-secondary);
  font-weight: 400;
  line-height: 1;
  text-transform: uppercase;
}

@media (max-width: 1024px) {
  .facet-filter-container {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .facet-filter-container {
    padding-left: 10px;
    padding-right: 10px;
  }

  .active-tags-delete-btn {
    font-size: 0.5em;
  }

  .active-tags-labels {
  }
}

.index-link {
  background-color: #E0E0E0;
  border-radius: 4px;
  padding: 4px 19px 7px;
  margin-top: 5px;
  font-family: var(--font-secondary);
  font-size: 20px;
  font-weight: 400;
  line-height: 1;
  color: #4D4D4D;
  text-decoration: none;
  /* align on right */
  float: right;
}

.index-link:hover {
  transition: 0.3s;
  color: var(--light-brown);

}
</style>