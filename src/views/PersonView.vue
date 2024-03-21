<template>
  <div id="banner-image" class="container is-fluid">
    <h1 class="title">Personnes</h1>
  </div>
  <div class="columns is-multiline">
    <div class="column is-12-mobile is-5-tablet is-5-desktop">
      <div class="box box-search-person-facets">
        <div class="box-content">
          <PersonSearchBox
              @update:query="handleUpdateQuery"
              @reset:query="handleResetQuery"
          />
          <div class="checkbox-canon box">
            <input id="checkbox-canon" type="checkbox" v-model="showCanon">
            <label for="checkbox-canon"> Chanoines</label>
          </div>
        </div>
        <div class="loader-wrapper" :class="{'is-active': !isLoading}">
          <div class="loader is-loading"></div>
        </div>
      </div>
    </div>
    <div class="column column-result is-12-mobile is-7-tablet is-7-desktop">
      <div class="column-result-header">
        <h2 class="subtitle is-4">
          <span class="results-count">{{ total }}</span> Résultats
        </h2>
        <PersonPagination
            :currentPage="currentPage"
            :totalPages="totalPages"
            :items-by-page-default="limit"
            :items-by-page-min="50"
            :items-by-page-max="100"
            @update:change-page="changePage"
            @change:items-by-page-display="handleItemsPerPageChange"/>
      </div>
      <ul>

        <li v-for="person in persons" :key="person._id_endp" class="li--person">
        <PersonResultCard
            :person="person"/>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {mapState} from "vuex";

import PersonSearchBox from "@/components/PersonSearchBox.vue";
import PersonPagination from "@/components/PersonPagination.vue";
import PersonResultCard from "@/components/PersonResultCard.vue";

export default {
  name: "PersonView",
  components: {
    PersonResultCard,
    PersonSearchBox,
    PersonPagination,
  },
  data() {
    return {
      persons: [], // a renommer en personsItems
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
    ...mapState(["personDbApi"]),

    totalPages() {
      return Math.ceil(this.total / this.limit);
    },

  },
  watch: {
    showCanon() {
      this.currentPage = 1;
      this.handleDefaultSearch();
    },
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
          .get(`${this.personDbApi}/persons/?size=${this.limit}&page=${this.currentPage}&only_canon=${this.showCanon}`,
              {
                withCredentials: false,
              })
          .then((response) => {
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
          }).catch(() => {
                this.persons = [];
                this.total = 0;
                this.isLoading = false;
              },
          );
    },
    async searchPersons() {
      this.isLoading = true;
      this.currentPage = 1;
      await axios
          .get(`${this.personDbApi}/persons/search?query=${this.query}&type_query=${this.selectSearchType}&only_canon=${this.showCanon}`,
              {
                withCredentials: false,
              })
          .then((response) => {
            this.persons = response.data.results.map((person) => ({
              ...person,
              isOpened: false,
            }));
            this.total = response.data.total;
          })
          .finally(() => {
            this.isLoading = false;
          }).catch(() => {
                this.persons = [];
                this.total = 0;
                this.isLoading = false;
              },
          );
    },
    async handleItemsPerPageChange(limit) {
      this.limit = limit;
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
  background-image: url("@/assets/banners/band_Personnes.png");
}

.columns {
  gap: var(--column-gap-desktop);
}

.columns .column:first-child {
  width: 465px;
  padding: 110px 0 23px;
}

.columns .column:last-child {
  width: calc(100% - 50px - 465px);
  padding: 85px 30px 300px 30px;
}

.box-search-person-facets {
  position: sticky;
  top: 0;
  padding: 0;
}

.box-search-person-facets .box {
  padding: 0;
  margin-bottom: 0;
}

.box-search-person-facets .box-content {
  position: relative;
}

.box-search-person-facets .box-content .checkbox-canon {
  position: absolute;
  bottom: 50px;
  right: 30px;
  padding: 20px 40px 20px 0;
  background: url("@/assets/images/picto_chanoine_liste.svg") center right / auto 50px no-repeat;
}

.box-search-person-facets .box-content .checkbox-canon {
  font-family: var(--font-secondary);
  font-size: 20px;
}

.box-search-person-facets .box-content .checkbox-canon label {
  margin-left: 5px;
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
  width: 100px;
  height: 100px;
}

.li--person {
  justify-content: space-between;
}

.is-active {
  opacity: 0;
}

.columns .column:last-child,
.checkbox-canon {
  background-color: var(--panel-bg-color);
}

.results-count {
  display: inline-block;
  width: 74px;
  height: 137px;
  background: url("@/assets/images/picto_perso_titre.svg") center / cover;
  padding-top: 50px;
  margin-right: 5px;

  font-size: 22px;
  font-weight: 700;
  font-style: normal;
  color: #FFFFFF;
  text-align: center;
}

h2.subtitle {
  margin-bottom: 0;
  font-size: 20px;
  font-style: italic;
}


@media screen and (max-width: 1024px) {

  #banner-image::before {
    background-color: #000000CC;
    background-image: none !important;
  }

  .columns {
    flex-direction: column;
  }

  .columns .column:first-child,
  .columns .column:last-child {
    display: block;
    width: 100%;
    max-width: 100% !important;
    padding: 40px 0 0 0;
  }
}


</style>