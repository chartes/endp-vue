<template>
  <div class="container">

    <div class="section section-with-image">
      <img src="@/assets/icons/medieval-priest.svg" alt="Illustration de personnes" class="illustration-1">
      <h1 class="title">Personnes</h1>
      <img src="@/assets/icons/medieval-secular-1.svg" alt="Illustration de personnes" class="illustration-2">
      <hr>
    </div>
    <div class="columns">
      <div class="column">
        <div class="column is-4">
          <div class="field is-flex is-grouped">
            <div class="control has-icons-left has-icons-right">
              <input class="input" type="text" placeholder="Rechercher" v-model="query">
              <span class="icon is-right"><i class="fas fa-search"></i> </span>
            </div>

            <div style="display: flex; align-items: center;">
              <input id="slider" name="slider" type="range" class="slider" v-model="type" min="0" max="2">
              <label for="slider"
                     style="height: 40px; width: 100px; margin-left: 10px; display: inline-block; padding: 5px;"><span
                  style="color: #444444; font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 15px">{{
                  typeOptionsTranslated[type]
                }}</span></label>
              <button class="button is-danger is-outlined" :class="{'button-reset-search': !resetButton}"
                      @click="getPersons()">
                <span class="icon is-small"><i class="fas fa-times"></i></span>
              </button>
            </div>
          </div>
        </div>
        <div class="column">
          <!-- Pagination control panel -->
          <div class="pagination is-rounded">
            <ul class="pagination-list">
              <li>
                <a class="pagination-link" v-if="currentPage > 2" aria-label="Goto page 1" @click="changePage(1)">1</a>
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
                <a class="pagination-link" v-if="currentPage < totalPages - 1" aria-label="Goto page {{ totalPages }}"
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
        <div>
          <ul>
            <!-- ici le spinner de chargement -->
            <div class="loader-wrapper" :class="{'is-active': !isLoading}">
              <div class="loader is-loading"></div>
            </div>
            <li v-for="person in persons" :key="person._id_endp">
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
                        <p><router-link class="button is-primary is-outlined" :to="`/persons/${person._id_endp}`">
                          <span class="icon is-small">
                            <i class="fas fa-external-link-alt"></i>
                          </span>
                          <span>Accéder à la fiche</span>
                        </router-link></p>
                      </div>
                      <div class="column is-2">
                        <!-- a button to access the person's page -->

                      </div>
                      <!--<div class="column is-3"  v-if="person.kb_links.length > 0 ">
                        <p class="metadata-header-title"><b>LIENS EXTERNES</b></p>
                        <ul>
                          <li v-for="kb_link in person.kb_links" :key="kb_link.id">
                            <figure class="image is-48x48 level-left" v-if='kb_link.type_kb !== "Collecta"'>
                              <a v-bind:href="kb_link.url">
                                <img title="Studium Parisiense" :src="require('@/assets/studium-icon.png')"
                                     alt="studium parisiense logo" v-if="kb_link.type_kb === 'Studium Parisiense'"/>
                              </a>
                              https://www.collecta.fr/_files/uploads/thumbs/900/COL-IMG-12392-1.jpg
                            </figure>
                          </li>
                        </ul>
                      </div>-->
                      <section class="section">
                        <!--<div class="container"  v-if="person.kb_links.some(link => link.type_kb === 'Collecta')">
                          <p class="metadata-header-title"><b>MEDIA(S)</b></p>
                          <div id="carousel-media">
                            <div class="item-1">
                              <img title="Studium Parisiense" src="https://www.collecta.fr/_files/uploads/thumbs/900/COL-IMG-12392-1.jpg"
                                                       alt="studium parisiense logo">
                            </div>
                            <div class="item-2">
                              <img title="Studium Parisiense" :src="require('@/assets/studium-icon.png')"
                                                       alt="studium parisiense logo"/>
                            </div>
                            <div class="item-3">
                              <img title="Studium Parisiense" :src="require('@/assets/studium-icon.png')"
                                                       alt="studium parisiense logo"/>
                            </div>
                          </div>

                        </div>-->
                      </section>
                    </div>

                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!--
      <div class="column">
        <a :href="dbAdminPath" class="button is-primary" target="_blank">
          <span class="icon"><i class="fa fa-database"></i></span>
          <span>Administration de la base de données</span>
            </a>
      </div>
      -->
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PersonView",
  data() {
    return {
      persons: [],
      dbAdminPath: process.env.VUE_APP_DB_ADMIN,
      currentPage: 1,
      limit: 50,
      total: 0,
      query: "",
      type: 0,
      typeOptionsTranslated: ["Exacte", "Floue", "Très floue"],
      typeOptions: ["exact", "fuzzy", "very_fuzzy"],
      isLoading: false,
      resetButton: false,
      showCanon: false,
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
        this.resetButton = false;
        this.type = 0;
        this.getPersons();
      } else {
        this.resetButton = true;
        this.handleDefaultSearch();
      }
    },
  },
  methods: {
    handleDefaultSearch() {
      if (this.query.trim() === "") {
        this.getPersons();
      } else {
        this.searchPersons();
      }
    },
    displayLoadingOnChange() {
      this.isInactive = false;
    },
    async getPersons() {
      this.isLoading = false;
      this.query = "";
      axios
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
          });
    },
    async searchPersons() {
      this.isLoading = true; // Activer le chargement
      this.currentPage = 1;
      const selectedType = this.typeOptions[this.type];
      axios
          .get(
              process.env.VUE_APP_DB_API + "/persons/search?query=" + this.query + "&type_query=" + selectedType,
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
            if (this.persons.length === 0) {
              this.isLoading = true;
            } else {
              this.isLoading = false;
            }
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
    isFirstPage(page) {
      return page === 1;
    },
    isLastPage(page) {
      return page === this.totalPages;
    },
    isPageInRange(page) {
      const pagesToShow = 5; // Adjust as needed
      const lowerBound = Math.max(2, this.currentPage - Math.floor(pagesToShow / 2));
      const upperBound = Math.min(
          this.totalPages - 1,
          this.currentPage + Math.floor(pagesToShow / 2)
      );
      return page >= lowerBound && page <= upperBound;
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.getPersons();
      }
    },
    resetSearch() {
      this.query = "";
      this.getPersons();
    },
  },
  mounted() {
    this.handleDefaultSearch();
  },
};
</script>


<style scoped>
.toggle-btn {
  width: 27px;
  height: 27px;
  background: url('~@/assets/chevron_rouge.svg') center / cover no-repeat;
  transition: transform 0.6s;
}

.toggle-btn.is-opened {
  width: 27px;
  background: url('~@/assets/croix.svg') center / cover no-repeat;
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