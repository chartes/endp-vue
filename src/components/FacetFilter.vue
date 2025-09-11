<template>
  <div class="facet-filter-container">
    <span
        :class="[
    'advanced_search_header',
    title === 'Termes' ? 'search-header-terms' : 'search-header-places'
  ]"
    >
  {{ title }} <span class="counter-terms">({{ this.terms.length }})</span>
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
          ref="searchInput"
          type="text"
          v-model="searchQuery"
          :placeholder="title === 'Termes' ? 'Gardien' : 'Chapelle de saint Eutrope'"
          @focus="onFocus"
          @blur="onBlur"
          @input="onInput"
          class="input"
      />

      <ul v-if="showDropdown" class="autocomplete-list">
        <template v-for="(terms, topic) in displayedTermsGrouped" :key="topic">
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
        <button @click="clearAll" class="active-tags-delete-btn">✖</button>
      </span>
      <div class="tags">
        <div v-for="term in selectedTerms" :key="term._id_endp" class="tag">
          <span>{{ term.term_fr || term.term_la }}</span>
          <button @click="removeTerm(term)">✖</button>
        </div>
      </div>
    </div>
    <p v-if="isLoading"></p>
  </div>
</template>

<script>
import {mapState} from "vuex";
import {nextTick} from "vue";

const arraysEqualAsSets = (a, b) => {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  const A = new Set(a), B = new Set(b);
  for (const v of A) if (!B.has(v)) return false;
  return true;
};

export default {
  name: "FacetFilter",
  props: {
    title: {type: String, default: "Facette"},
    apiUrl: {type: String, required: true},
    filterType: {
      type: String,
      required: true,
      validator: (v) => ["places", "persons_terms"].includes(v),
    },
    reset: {type: Boolean, default: false},
    initialSelectedIds: {type: Array, default: () => []},
  },
  data() {
    return {
      terms: [],
      searchQuery: "",
      filteredTermsGrouped: {},
      selectedTerms: [],
      isLoading: false,
      showDropdown: false,
      termCache: {}, // {_id_endp: termObj}
      maxPreviewPerGroup: Infinity,

    };
  },
  computed: {
    ...mapState(["personDbAdminShow"]),
    ...mapState("personSearch", ["filterList"]),
    selectedIds() {
      return this.selectedTerms.map((t) => t._id_endp);
    },
    displayedTermsGrouped() {
      // Si l'utilisateur tape, on affiche la version filtrée existante
      if (this.searchQuery.trim()) return this.filteredTermsGrouped;

      // Sinon, on construit un APERÇU à partir de `this.terms` (déjà en cache)
      const grouped = {};
      for (const t of this.terms) {
        const topic = t.topic || "Autre";
        (grouped[topic] ||= []);
        // limiter le nombre par topic pour l’aperçu
        if (grouped[topic].length < this.maxPreviewPerGroup) {
          grouped[topic].push(t);
        }
      }
      return grouped;
    },
  },
  watch: {
    // Sync depuis le parent vers l'enfant, sans émettre, et seulement si ça change.
    initialSelectedIds: {
      immediate: true,
      handler(newIds) {
        if (arraysEqualAsSets(newIds, this.selectedIds)) return;

        const next = newIds.map((id) =>
            this.termCache[id] ||
            this.selectedTerms.find((t) => t._id_endp === id) ||
            this.terms.find((t) => t._id_endp === id) ||
            // placeholder (le label sera mis à jour dès que fetchTerms alimentera le cache)
            {_id_endp: id, term_fr: id, term_la: id, topic: ""}
        );

        // Remplace uniquement si différent pour éviter un watch inutile
        if (!arraysEqualAsSets(next.map(t => t._id_endp), this.selectedIds)) {
          this.selectedTerms = next;
        }
      },
    },

    // Rafraîchir la liste dispo quand le store change
    "filterList.place_ids"(n, o) {
      if (JSON.stringify(n) !== JSON.stringify(o)) this.fetchTerms();
    },
    "filterList.person_term_ids"(n, o) {
      if (JSON.stringify(n) !== JSON.stringify(o)) this.fetchTerms();
    },

    reset(val) {
      if (val) {
        this.selectedTerms = [];
        this.emitSelection(); // informer le parent du reset utilisateur

      }
    },
  },
  methods: {
    onFocus() {
      this.showDropdown = true;
      // Pas de requête ici : `terms` est déjà peuplé au mounted / via les watchers.
      // Si tu veux sécuriser : si jamais vide, relance un fetch.
      if (!this.terms.length) this.fetchTerms();
    },
    onBlur() {
      // petit délai pour permettre le click sur un item
      setTimeout(() => (this.showDropdown = false), 120);
    },
    onInput() {
      // ouvrir si l’utilisateur commence à taper
      if (!this.showDropdown) this.showDropdown = true;
      this.filterTerms();
    },
    emitSelection() {
      this.$emit("update:selectedTerms", {
        type: this.filterType,
        terms: this.selectedIds,
      });
    },

    async fetchTerms() {
      try {
        this.isLoading = true;
        const all = [];
        let page = 1, pages = 1;

        do {
          const p = new URLSearchParams({size: 100, page});
          this.filterList.place_ids.forEach((id) => p.append("place_endp_ids", id));
          this.filterList.person_term_ids.forEach((id) => p.append("person_term_endp_ids", id));

          const res = await fetch(`${this.apiUrl}&${p.toString()}`);
          const data = await res.json();
          all.push(...data.items);
          pages = data.pages;
          page += 1;
        } while (page <= pages);

        // met à jour le cache
        all.forEach((t) => (this.termCache[t._id_endp] = t));

        // remplace d’éventuels placeholders dans selectedTerms par les objets complets (sans émettre)
        this.selectedTerms = this.selectedTerms.map(
            (t) => this.termCache[t._id_endp] || t
        );

        // la liste dispo ne contient pas ce qui est déjà sélectionné
        const selected = new Set(this.selectedIds);
        this.terms = all.filter((t) => !selected.has(t._id_endp));

        this.groupTerms();
      } catch (e) {
        console.error("Erreur lors de la récupération des termes :", e);
      } finally {
        this.isLoading = false;
      }
    },

    groupTerms() {
      this.filteredTermsGrouped = this.terms.reduce((acc, t) => {
        const topic = t.topic || "Autre";
        (acc[topic] ||= []).push(t);
        return acc;
      }, {});
    },

    filterTerms() {
      const q = this.searchQuery.toLowerCase();
      const filtered = this.terms.filter(
          (t) =>
              (t.term_fr && t.term_fr.toLowerCase().includes(q)) ||
              (t.term_la && t.term_la.toLowerCase().includes(q))
      );
      this.filteredTermsGrouped = filtered.reduce((acc, t) => {
        const topic = t.topic || "Autre";
        (acc[topic] ||= []).push(t);
        return acc;
      }, {});
    },

    async handleTermSelection(term) {
      if (!this.selectedIds.includes(term._id_endp)) {
        this.termCache[term._id_endp] = term;
        await nextTick();
        this.selectedTerms = [...this.selectedTerms, term];
        this.emitSelection(); // action utilisateur
      }

      // nettoyer l’UI et FERMER
      this.searchQuery = "";
      this.showDropdown = false;

      // enlever le curseur / focus dans l’input
      this.$refs.searchInput?.blur();
    },

    removeTerm(term) {
      const next = this.selectedTerms.filter((t) => t._id_endp !== term._id_endp);
      if (!arraysEqualAsSets(next.map(t => t._id_endp), this.selectedIds)) {
        this.selectedTerms = next;
        this.emitSelection(); // <-- idem : action utilisateur
      }
    },
    async clearAll() {
      if (!this.selectedTerms.length) return;
      this.selectedTerms = [];
      this.emitSelection();

      // 3) -- optional
      // await this.$nextTick();
      // this.fetchTerms();
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

.counter-terms {
  font-size: 20px;
  color: #4D4D4D;
  line-height: 1;
  text-decoration: none;

}
</style>