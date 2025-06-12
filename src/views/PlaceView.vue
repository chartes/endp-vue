<template>
  <div id="banner-image" class="container is-fluid"></div>
  <div class="page-title">
    <h1>Lieux</h1>
  </div>
  <div class="columns is-multiline">
    <div class="column is-12-mobile is-5-tablet is-5-desktop">
      <div class="box box-search-person-facets" :class="{ 'is-opened': searchBoxOpenState }">
        <div class="box-search-header" @click="toggleSearchBox($event)"></div>
        <div class="box-content">
          <PlaceSearchBox
              :has-active-filters="hasActiveFilters"
              @update:query="handleUpdateQuery"
              @reset:query="handleResetQuery"
              @update:filter="handleUpdateFilter"
          />
        </div>
        <div class="box-interactive-map" :class="{ 'is-visible': topicType === 'Chapelle' }">
          <div class="box-content">
            <div class="box-header">
              <p class="subtitle is-5"><span>Plan interactif</span></p>
            </div>
            <div class="box-body">
              <PlaceChapelsMap class="map" />
            </div>
          </div>
        </div>
        <div class="loader-wrapper" :class="{ 'is-active': !isLoading }">
          <div class="loader is-loading"></div>
        </div>
      </div>
    </div>
    <div class="column column-result is-12-mobile is-7-tablet is-7-desktop"
         :class="{ 'is-searchbox-opened': searchBoxOpenState }">
      <div class="column-results-header">
        <h2 class="subtitle is-4">
          <span class="results-count">{{ totalResults }}</span>
          <span class="results-count-label">Lieux disponibles</span>
        </h2>
      </div>
      <VPagination
          v-if="placesItems.length"
          class="pagination-top"
          :currentPage="actualPage"
          :totalPages="totalPages"
          :items-by-page-default="itemsDisplayedPerPage"
          :items-by-page-min="50"
          :items-by-page-max="100"
          :top-pagination="false"
          :results-by-page-control="false"
          @update:change-page="changePage"
          @change:items-by-page-display="handleItemsPerPageChange"/>
      <ul class="results-list">
        <PlaceResultCard
            v-for="place in placesItems"
            :key="place._id_endp"
            :place="place"
            />
      </ul>
      <VPagination
          v-if="placesItems.length"
          class="pagination-bottom"
          :currentPage="actualPage"
          :totalPages="totalPages"
          :items-by-page-default="itemsDisplayedPerPage"
          :items-by-page-min="50"
          :items-by-page-max="100"
          :top-pagination="false"
          :results-by-page-control="false"
          @update:change-page="changePage"
          @change:items-by-page-display="handleItemsPerPageChange"/>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import PlaceSearchBox from "@/components/PlaceSearchBox.vue";
import VPagination from "@/components/VPagination.vue";
import PlaceResultCard from "@/components/PlaceResultCard.vue";
import {mapState, mapActions} from "vuex";
import PlaceChapelsMap from "@/components/PlaceChapelsMap.vue";

export default {
  name: "PlaceView",
  components: {
    PlaceChapelsMap,
    PlaceSearchBox,
    VPagination,
    PlaceResultCard
  },
  data() {
    return {
      isLoading: false,
      searchBoxOpenState: false,
    };
  },
  computed: {
     ...mapState("placeSearch",
        ["placeQuery",
          "topicType",
          "currentPage",
          "itemsPerPage",
          "totalResults",
          "places",
          "totalResults"]),
    ...mapState(["personDbApi"]),
    totalPages() {
      return Math.ceil(this.totalResults / this.itemsPerPage);
    },
    hasActiveFilters() {
      return (
          this.placeQuery.trim() !== ""
      );
    },
    placesItems: {
      get() {
        return this.places;
      },
      set(value) {
        this.updateResults( {places: value, total: this.totalResults} );
      },
    },
    actualPage: {
      get() {
        return this.currentPage;
      },
      set(value) {
        this.updatePagination({page: value, limit: this.itemsPerPage});
      },
    },
    itemsDisplayedPerPage: {
      get() {
        return this.itemsPerPage;
      },
      set(value) {
        this.updatePagination({page: this.currentPage, limit: value});
      },
    },
  },
  methods: {
    ...mapActions("placeSearch", [
      "updateQuery",
      "updateTopic",
      "updatePagination",
      "updateResults"
    ]),
    async fetchPlaces() {
      this.isLoading = true;
      const params = new URLSearchParams({
        topic: this.topicType,
        query: this.placeQuery,
        page: this.currentPage,
        size: this.itemsPerPage,
      });

      try {
        const res = await axios.get(`${this.personDbApi}/places?${params.toString()}`);
        this.updateResults({places: res.data.items, total: res.data.total});
      } catch {
        this.updateResults({places: [], total: 0});
      } finally {
        this.isLoading = false;
      }
    },

    handleUpdateQuery({query, topic}) {
      this.updateQuery({query});
      this.updateTopic({topic});
      this.updatePagination({page: 1, limit: this.itemsPerPage});
      this.fetchPlaces();
    },

    handleResetQuery() {
      this.updateQuery({query: ""});
      this.updateTopic({ topic: "Chapelle" });
      this.updatePagination({page: 1, limit: this.itemsPerPage});
      this.fetchPlaces();
    },

    handleUpdateFilter(topic) {
      this.updateTopic({topic});
      this.updatePagination({page: 1, limit: this.itemsPerPage});
      this.fetchPlaces();
    },

    handleItemsPerPageChange(newLimit) {
      this.updatePagination({page: 1, limit: newLimit});
      this.fetchPlaces();
    },

    changePage(page) {
      this.updatePagination({page, limit: this.itemsPerPage});
      this.fetchPlaces();
    },

    toggleSearchBox(event) {
      event.preventDefault();
      this.searchBoxOpenState = !this.searchBoxOpenState;
    },

  },
  mounted() {
    // update topic with default value
    this.updateTopic({topic: "Chapelle"});
    this.fetchPlaces();
  },
};
</script>


<style scoped>
/* Set image banner */
#banner-image::before {
  background-size: 1920px auto;
  background-image: url("@/assets/banners/band_Lieux.png");
}


.columns {
  gap: var(--column-gap-desktop);
}

.columns .column:first-child {
  width: 465px;
  padding: 0 0 23px;
}

.columns .column:last-child {
  width: calc(100% - 50px - 465px);
  padding: 65px 30px var(--right-column-bottom-padding-desktop) 30px;
}

.box-search-person-facets {
  position: sticky;
  top: 0;
  padding: 100px 0 1.5rem;
  margin-bottom: 0;
  background-color: #ffffff;
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

:deep(.box-search-person-facets .box-content .container-search) {
  padding-bottom: 67px;
}

.box-search-person-facets .box-content .checkbox-canon {
  position: absolute;
  bottom: 60px;
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

.box-interactive-map {
  display: none;
}

.box-interactive-map.is-visible {
  display: block;
  padding: 45px 0 20px;
}

.box-interactive-map .box-header {
  background-color: #ffffff;
  border-bottom: solid 6px #000000;
}

.box-interactive-map .box-body {
  padding: 0 0 120px;
}

.subtitle {
  padding-bottom: 12px;
  font-size: 24px;
  color: #272727;
  font-weight: 400;
  font-style: italic;
}

.is-active {
  opacity: 0;
}

.columns .column,
.checkbox-canon {
  background-color: var(--panel-bg-color);
}

.column-results-header {
  position: sticky;
  top: 52px;
  z-index: 1;
  width: 100%;
  padding: 20px 0 12px;
  background-color: var(--panel-bg-color);
  border-bottom: solid 6px #000000;
}

.pagination-box + .results-list {
  margin-top: 40px;
}

.results-list {
  margin-top: 80px;
}

h2.subtitle {
  margin-bottom: 0;
  font-size: 20px;
  font-style: italic;
}

.results-count {
  display: inline-block;
  width: 71px;
  height: 113px;
  background: url("@/assets/images/fond_maison.svg") center / cover;
  padding-top: 32px;
  margin-right: 10px;

  font-size: 40px;
  font-weight: 400;
  font-style: normal;
  color: #FFFFFF;
  text-align: center;
}

.results-count-label {
  display: inline-block;
  width: 120px;
  padding-top: 30px;
  font-size: 20px;
}

:deep(.pagination-box) {
  padding-right: 30px;
}

:deep(.pagination-box.pagination-top) {
  margin-top: 10px;
}

:deep(.pagination-box.pagination-bottom) {
  margin-top: 20px;
}

@media screen and (max-width: 1024px) {

  :deep(.pagination-box .pagination-previous) {
    padding-right: 30px;
  }

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
    top: 0;
    left: 0;
    z-index: 2;

    display: block;
    width: 100%;
    height: 68px;
    background: transparent url('~@/assets/images/b_Open_liste.svg') right 10px top 23px / 25px auto no-repeat;
    cursor: pointer;
  }

  .box-search-person-facets.is-opened .box-search-header {
    background-image: url('~@/assets/images/b_Close_liste.svg');
    background-position: right 6px top 23px;
  }

  .box-search-person-facets:not(.is-opened) .box-search-header {
    border-bottom: #D0D0D0 solid 1px;
  }

  .box-search-person-facets .box-content .checkbox-canon {
    bottom: 155px;
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

  .box-search-person-facets.is-opened .box-content .container-search {
    position: relative;
  }

  .box-interactive-map .box-body {
    padding: 0;
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
    padding-top: 50px;
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

  .pagination-bottom {
    display: block;
    margin-top: 100px;
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