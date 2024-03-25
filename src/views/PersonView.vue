<template>
  <div id="banner-image" class="container is-fluid"></div>

  <div class="page-title">
    <h1>Personnes</h1>
  </div>

  <div class="columns is-multiline">
    <div class="column is-12-mobile is-5-tablet is-5-desktop">
      <div class="box box-search-person-facets" :class="{ 'is-opened': searchBoxOpenState }">
        <div class="box-search-header" @click="toggleSearchBox($event)"></div>
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
    <div class="column column-result is-12-mobile is-7-tablet is-7-desktop"  :class="{ 'is-searchbox-opened': searchBoxOpenState }">
      <div class="column-results-header">
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
      searchBoxOpenState: false
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
    toggleSearchBox(event) {
      event.preventDefault();
      this.searchBoxOpenState = !this.searchBoxOpenState;
    },
  },
  mounted() {
    this.handleDefaultSearch();
  },
};
</script>


<style scoped>
/* Set image banner */
.page-title, #banner-image::before {
  background-image: url("@/assets/banners/band_Personnes.png");
}

.columns {
  gap: var(--column-gap-desktop);
}

.columns .column:first-child {
  width: 465px;
  padding: 10px 0 23px;
}

.columns .column:last-child {
  width: calc(100% - 50px - 465px);
  padding: 65px 30px var(--right-column-bottom-padding-desktop) 30px;
}

.box-search-person-facets {
  position: sticky;
  top: 0;
  padding: 100px 0 0;
}

.box-search-person-facets .box {
  padding: 0;
  margin-bottom: 0;
}

.box-search-person-facets .box-search-header {
  display: none;
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
  border-left-color: var(--light-brown) !important;
  width: 100px;
  height: 100px;
}

:deep(.li--person:first-child header.card-header) {
  min-height: 110px;
}

.is-active {
  opacity: 0;
}

.columns .column:last-child,
.checkbox-canon {
  background-color: var(--panel-bg-color);
}

.column-results-header {
  position: sticky;
  top:52px;
  z-index: 1;
  width: 100%;
  height: 232px;
  padding-top: 20px;
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
    gap: 0;
    padding-bottom: 100px;
  }

  .column-results-header,
  .columns .column.column-result {
    background-color: transparent;
    padding: 0;
    height: auto;
  }

  .columns .column:first-child,
  .columns .column:last-child {
    display: block;
    width: 100%;
    max-width: 100% !important;
  }

  .columns .column:first-child {
    position: sticky;
    top: 102px;
    z-index: 2;
    padding: 0;
    background-color: #FFF;
  }

  .box-search-person-facets {
    position: relative;
    padding: 0;
  }

  .box-search-person-facets {
    padding-top: 0;
    padding-bottom: 2px;
  }

  .box-search-person-facets .box {
    padding-top: 20px;
  }

  .box-search-person-facets .box-search-header {
    position: absolute;
    top:0;
    left:0;
    z-index: 2;

    display: block;
    width: 100%;
    height: 68px;
    background: transparent url('~@/assets/images/b_Open_liste.svg') right 20px top 23px / 25px auto no-repeat;
    cursor: pointer;
  }

  .box-search-person-facets.is-opened .box-search-header {
    background-image: url('~@/assets/images/b_Close_liste.svg');
  }

  .box-search-person-facets:not(.is-opened) .box-search-header {
    border-bottom: #D0D0D0 solid 1px;
  }

  .box-search-person-facets .box-content .checkbox-canon {
    bottom: 88px;
    right: 50%;
    transform: translateX(50%);
  }

  .box-search-person-facets .box-content .checkbox-canon,
  :deep(.box-search-person-facets .box-content .container-search) {
    display: block;
  }

  .box-search-person-facets:not(.is-opened) .box-content .checkbox-canon,
  :deep(.box-search-person-facets:not(.is-opened) .box-content .container-search) {
    display: none;
  }

  /* Second column */

  .column-results-header {
    position: relative;
    top: 8px;
  }

  .column-results-header.is-sticky {
    position: sticky;
    top: 200px;
    z-index: 2;
    background-color: #FFF;
  }

  .is-searchbox-opened .column-results-header {
    padding-top: 30px;
  }


    .is-searchbox-opened .column-results-header.is-sticky {
    top: 452px;
    padding-top: 20px;
  }

  :deep(.is-searchbox-opened .pagination-box  nav.pagination) {
    display: none;
  }

  :deep(.box-search-person-facets.is-opened .box-content  .container-search) {
    border-bottom: solid 1px #BBBBBB;
  }

  .results-count {
    width: 57px;
    height: 106px;
    font-size: 18px;
    padding-top: 40px;
  }

  .loader-wrapper {
    position: relative;
    height: 20px;
    width: 20px;
    margin-top: 15px;
  }

  .is-opened .loader-wrapper {
    margin-top: -30px;
  }

  .loader-wrapper .loader {
    height: 20px;
    width: 20px;
  }
}

</style>