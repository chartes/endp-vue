<template>
  <!-- banner -->
  <div id="banner-image" class="container is-fluid">
    <h1 class="title">Personnes</h1>
  </div>
  <!-- end banner -->
  <!-- Main grid -->
  <div class="columns is-multiline">
    <div class="column is-12-mobile is-5-tablet is-5-desktop">
      <div class="box box-search-person-facets">
        <PersonSearchBox
            @update:query="handleUpdateQuery"
            @reset:query="handleResetQuery"
        />
        <div class="box">
          <div>

            <div>

              <!-- Pagination control panel -->
              <div class="pagination is-rounded">
                <ul class="pagination-list">
                  <li>
                    <a class="pagination-link" v-if="currentPage > 2" aria-label="Goto page 1"
                       @click="changePage(1)">1</a>
                  </li>
                  <li>
                    <span class="pagination-ellipsis" v-if="currentPage > 3">&hellip;</span>
                  </li>
                  <li>
                    <a class="pagination-link" v-if="currentPage > 1" aria-label="Goto previous page"
                       @click="changePage(currentPage - 1)">
                      {{ currentPage - 1 }}
                    </a>
                  </li>
                  <li>
                    <a class="pagination-link is-current" aria-label="Page {{ currentPage }}" aria-current="page">{{
                        currentPage
                      }}</a>
                  </li>
                  <li>
                    <a class="pagination-link" v-if="currentPage < totalPages" aria-label="Goto next page"
                       @click="changePage(currentPage + 1)">
                      {{ currentPage + 1 }}
                    </a>
                  </li>
                  <li>
                    <span class="pagination-ellipsis" v-if="currentPage < totalPages - 2">&hellip;</span>
                  </li>
                  <li>
                    <a class="pagination-link" v-if="currentPage < totalPages - 1"
                       aria-label="Goto page {{ totalPages }}"
                       @click="changePage(totalPages)">
                      {{ totalPages }}
                    </a>
                  </li>
                </ul>
              </div>
              <div class="pagination-panel">
                <div class="pagination-buttons pagination is-rounded">

                  <a class="pagination-previous" :class="{ 'disabled': currentPage === 1 }"
                     @click="changePage(currentPage - 1)">
               <span class="icon is-primary">
                 <i class="fas fa-chevron-left"></i>
               </span>

                  </a>
                  <a class="pagination-next" :class="{ 'disabled': currentPage === totalPages }"
                     @click="changePage(currentPage + 1)">
                <span class="icon is-primary">
                 <i class="fas fa-chevron-right"></i>
               </span>
                  </a>
                </div>

                <div class="pagination-input" style="display: flex !important; align-items: center !important;">
                  <label class="label" for="limit-results"
                         style="margin-left: 10px; display: inline-block !important; padding: 5px;">Résultats par
                    page</label>
                  <input id="limit-results" class="input small-input" type="number" placeholder="50" min="50" max="100"
                         step="10"
                         v-model="limit"
                         @change="handleItemsPerPageChange">
                </div>

              </div>
            </div>
          </div>
        </div>
        <div class="loader-wrapper" :class="{'is-active': !isLoading}">
          <div class="loader is-loading"></div>
        </div>
      </div>
    </div>
    <!-- Results column -->
    <div class="column column-result is-12-mobile is-7-tablet is-7-desktop">
      <ul>
        <!-- ici le spinner de chargement -->
        <!-- total trouvé -->
        <h2 class="subtitle is-4">{{ total }} Résultats</h2>
        <li v-for="person in persons" :key="person._id_endp" class="li--person">
          <div class="card">
            <header class="card-header" @click="toggleContent(person, $event)">
              <div class="card-header-title">
                <span class="canon-icon" v-if="person.is_canon"></span>
                <span class="secular-people-icon" v-else></span>
                <span style="text-align: center; flex-grow: 1; display: flex">{{ person.pref_label }}</span>
              </div>
              <a href="#" class="toggle-btn" :class="{ 'is-opened': person.isOpened }"></a>
            </header>
            <div class="card-content" v-if="person.isOpened">
              <div class="content">
                <div class="columns is-multiline">
                  <div class="column is-7 block has-text-left">
                    <p><b>Prénom(s) - <i>Nomen</i></b> : {{ person.forename_alt_labels }}</p>
                    <p><b>Nom(s) - <i>Cognomen</i></b> : {{ person.surname_alt_labels }}</p>
                    <p><b>Dates extrêmes d'apparition dans les registres</b> :
                      {{ person.first_mention_date ? person.first_mention_date : "Non renseigné" }} -
                      {{ person.last_mention_date ? person.last_mention_date : "Non renseigné" }}</p>
                    <p>
                      <router-link class="button  btn-person-data-link" :to="`/persons/${person._id_endp}`">
                          <span class="icon is-small">
                            <i class="fas fa-external-link-alt"></i>
                          </span>
                        <span>Accéder à la fiche</span>
                      </router-link>
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import PersonSearchBox from "@/components/PersonSearchBox.vue";

export default {
  name: "PersonView",
  components: {
    PersonSearchBox,
  },
  data() {
    return {
      persons: [], // a renommer en personsItems
      dbAdminPath: process.env.VUE_APP_DB_ADMIN, // mettre dans le store (comme les autres chemins)
      currentPage: 1,
      limit: 50, // a renommer en itemsPerPage
      total: 0, // a renommer en totalResults
      query: "", // a renommer en searchQuery
      isLoading: false,
      showCanon: false,
      selectSearchType: "exact",
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.total / this.limit);
    },

  },
  watch: {
    query(newValue) {
      if (newValue.trim() === "") {
        this.getPersons();
      } else {
        this.handleDefaultSearch();
      }
    },
  },

  methods: {
    handleUpdateQuery({query, search_type}) {
      console.log("From parent : ", query, search_type);
      this.currentPage = 1;
      this.selectSearchType = search_type;
      this.query = query;
      this.handleDefaultSearch();
    },
    handleResetQuery() {
      this.currentPage = 1;
      this.getPersons();
    },
    handleDefaultSearch() {
      if (this.query.trim() === "") {
        this.getPersons();
      } else {
        this.searchPersons();
      }
    },
    async getPersons() {
      this.isLoading = true;
      this.query = "";
      await axios
          .get(process.env.VUE_APP_DB_API + "/persons/?size=" + this.limit + "&page=" + this.currentPage, {
            withCredentials: false,
          })
          .then((response) => {
            console.log(response.data);
            this.persons = response.data.items.map((person) => ({
              ...person,
              isOpened: false,
            }));
            this.total = response.data.total;
            if (this.currentPage > this.totalPages) {
              this.currentPage = 1;
            }
          }).finally(() => {
            this.isLoading = false;
          });
    },
    async searchPersons() {
      this.isLoading = true; // Activer le chargement
      this.currentPage = 1;
      await axios
          .get(
              process.env.VUE_APP_DB_API + "/persons/search?query=" + this.query + "&type_query=" + this.selectSearchType,
              {
                withCredentials: false,
              }
          )
          .then((response) => {
            console.log(response.data);
            this.persons = response.data.results.map((person) => ({
              ...person,
              isOpened: false,
            }));
            this.total = response.data.total;
          })
          .finally(() => {
            this.isLoading = false;
          });
    },
    toggleContent(person, event) {
      event.preventDefault();
      person.isOpened = !person.isOpened;
    },
    async handleItemsPerPageChange(event) {
      this.limit = event.target.value;
      this.currentPage = 1;
      this.handleDefaultSearch();
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.getPersons();
      }
    },
  },
  mounted() {
    this.handleDefaultSearch();
  },
};
</script>


<style scoped>

/* Set image banner */
#banner-image::before {
  background-image: url("@/assets/banners/banner-persons_page.png");
}

/* New CSS */

.box-search-person-facets {
  background-color: #f5f5f5;
  padding: 1rem 1.5rem 1.5rem 1.5rem;
  border: 2px solid #8d1919;
  border-radius: 5px;
  position: sticky;
  top: 0;
}

.box-container-facets__person_search {
  border: 0.5px solid #0a0a0a;
  border-radius: 5px;
  margin-bottom: 1rem;
  margin-top: 1rem;
}

.btn-person-data-link {
  margin-top: 1rem;
  color: #8d1919;
}

.btn-person-data-link:hover {
  background: #8d1919;
  color: #fff;
}

/* END New CSS */

.toggle-btn {
  width: 27px;
  height: 27px;
  background: url('~@/assets/icons/chevron_rouge.svg') center / cover no-repeat;
  transition: transform 0.6s;
}

.toggle-btn.is-opened {
  width: 27px;
  background: url('~@/assets/icons/croix.svg') center / cover no-repeat;
}

.disabled {
  pointer-events: none;
  color: gray; /* or any other color to indicate disabled state */
}

.pagination-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.pagination-buttons {
  display: flex;
  align-items: center;
}

.pagination-previous,
.pagination-next {
  margin-right: 10px;
}

.pagination-input {
  display: flex;
  align-items: center;
}

.pagination-input label {
  margin-right: 10px;
  display: inline;
}

.small-input {
  width: 35%; /* Ajustez la largeur selon vos besoins */
}

.persons--results--column {
  justify-content: space-between;
  /* start at 0 */
  margin: 0;
}

/* Dans les cards */
.card-header-title {
  height: 100px
}

.loader-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}

.loader {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #3273dc;
  width: 100px; /* Augmentez la taille du spinner */
  height: 100px; /* Augmentez la taille du spinner */
}

.is-active {
  opacity: 0;
}

.button-reset-search {
  opacity: 0;
  display: none;
}

.canon-icon {
  background: url(@/assets/icons/canon-icon.svg) center / cover no-repeat;
  height: 70px;
  width: 70px;
}

.secular-people-icon {
  background: url(@/assets/icons/secular-people-1.png) center / cover no-repeat;
  height: 50px;
  width: 50px;
  margin-right: 15px;
  margin-left: 10px;
}

.li--person {
  padding: 10px;
  justify-content: space-between;
  width: 70%;
  border-radius: 3px;
  background-color: white;
}

.illustration-1 {
  width: 150px; /* Ajustez la largeur de l'image selon vos besoins */
  height: 200px; /* Ajustez la hauteur de l'image selon vos besoins */
  margin-right: auto; /* Espace entre l'image et le titre */
}

.illustration-2 {
  width: 198px; /* Ajustez la largeur de l'image selon vos besoins */
  height: 170px; /* Ajustez la hauteur de l'image selon vos besoins */
  margin-right: auto; /* Espace entre l'image et le titre */
  margin-left: auto;
}

.section-with-image {
  display: flex;
  align-items: center;
  background-color: gainsboro;
  padding: 20px;
  margin-bottom: 20px;
  /* add transparent border */
  border: 1px solid transparent;
  border-radius: 5px;
  /* add box shadow */
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

.icon-container {
  margin-right: 10px; /* Ajustez la marge selon vos besoins */
}

.label-container {
  flex-grow: 1; /* Permet au label de prendre autant d'espace que possible */
}

</style>