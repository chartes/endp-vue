<template>
  <div class="facet-filter-container">
    <span
        :class="[
    'advanced_search_header',
    title === 'TERMES' ? 'search-header-terms' : 'search-header-places'
  ]"
    >
  {{ title }}
      <a class="index-link"
        :href="[
          title === 'TERMES'
            ? `${this.personDbAdminShow}/admin/thesaurusterm/`
            : `${this.personDbAdminShow}/admin/placesterm/`
        ]"
        target="_blank"
      >INDEX</a>
</span>
    <div class="search-bar">
      <input
          type="text"
          v-model="searchQuery"
          :placeholder="title === 'TERMES' ? 'Gardien' : 'Chapelle de saint Eutrope'"
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
        <span v-for="term in selectedTerms" :key="term._id_endp" class="tag">
          {{ term.term_fr || term.term_la }}
          <button @click="removeTerm(term)">✖</button>
        </span>
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
  font-size: 0.75em;
  width: auto;
  margin-bottom: 5px;
}

.tag button {
  border: none;
  border-radius: 9999px;
  color: #707070;
  font-size: 10px;
  margin-left: 10px;
  cursor: pointer;
  font-weight: bold;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 15px;
  height: 15px;
}

.advanced_search_header {
  font-family: var(--font-secondary);
  font-weight: 400;
  font-size: 18px;
  padding-left: 35px;
  padding-top: 8px;
  padding-bottom: 8px;
}

.search-header-terms {
  background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMzAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iIzZENzI3OCIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTEuOTY2IDEzLjY0YzMuNzcgMCA2LjgyLTMuMDUgNi44Mi02LjgyIDAtMy43Ny0zLjA1LTYuODItNi44Mi02LjgyLTMuNzcgMC02LjgyIDMuMDUtNi44MiA2LjgyIDAgMy43NyAzLjA1IDYuODIgNi44MiA2LjgyTTIzLjkzIDI0LjgyYy0yLjAxLTMuNzItNS4xNDQtOC41OTYtMTEuOTY0LTguNTk2UzIuMDEzIDIxLjA5OSAwIDI0LjgxOWMzLjIwNSAzLjc5OSA2Ljc5NCA1LjEyNyAxMS45NjYgNS4xMjcgNS4xNyAwIDguNzYtMS4zMzggMTEuOTY1LTUuMTI3Ii8+PC9nPjwvc3ZnPg==) 0 no-repeat;
}

.search-header-places {
  background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTExLjc4IDBjNi41MDQgMCAxMS43OCA1LjIyIDExLjc4IDExLjY1NSAwIDUuMzA2LTcuMTc4IDE0Ljc1MS0xMC4zMjYgMTguNjQ4YTEuODY2IDEuODY2IDAgMDEtMi45MDggMEM3LjE3OCAyNi40MDYgMCAxNi45NjEgMCAxMS42NTUgMCA1LjIyMSA1LjI3NiAwIDExLjc4IDB6bTAgNy43N2MtMi4xNjYgMC0zLjkyNyAxLjc0Mi0zLjkyNyAzLjg4NXMxLjc2MSAzLjg4NSAzLjkyNyAzLjg4NWMyLjE2NiAwIDMuOTI3LTEuNzQyIDMuOTI3LTMuODg1UzEzLjk0NiA3Ljc3IDExLjc4IDcuNzd6IiBmaWxsPSIjNkQ3Mjc4IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48L3N2Zz4=) 0 no-repeat;
}

.active-tags {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
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
  background-color: #8C8C8C;
  border-radius: 50%;
  color: #FFF;
  font-size: 10px;

  cursor: pointer;
  font-weight: bold;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin: 0 0 0 15px;
  padding: 0;
}

.active-tags-delete-btn:hover,
.tag button:hover {
  color: #D74A52;
}


.active-tags-labels {
  font-family: var(--font-secondary);
  font-weight: 400;
  text-transform: uppercase;
}

@media (max-width: 768px) {
  .facet-filter-container {
    padding-left: 10px;
    padding-right: 10px;
  }

  .search-header-terms {
    padding-left: 30px;
  }

  .search-header-places {
    padding-left: 30px;
  }

  .active-tags-delete-btn {
    font-size: 0.5em;
  }

  .active-tags-labels {
    font-size: 0.5em;
  }
}

.index-link {
  font-family: var(--font-secondary);
  font-weight: 400;
  font-size: 18px;
  text-decoration: none;
  color: #6E6E6E;
  /* align on right */
  float: right;
}

.index-link:hover {
  transition: 0.3s;
  color: var(--light-brown);

}
</style>