<template>
  <div id="banner-image" class="container is-fluid"></div>

  <div class="page-title">
    <h1>Lieux</h1>
  </div>

  <div class="columns person-name-columns is-multiline">
    <div class="column is-full">
      <!-- Place header -->
      <div class="person-data-container-header">
        <h1 class="person-name">{{ meta_place['term_fr'] }}</h1>
      </div>
    </div>
  </div>

  <!-- end Place header -->
  <div class="columns is-multiline details-column" >

    <!-- top Place metadata -->
    <div class="column is-full">
      <div class="person-metadata-wrapper">
        <h3 class="section-title">Métadonnées</h3>

        <p v-if="meta_place['map_place_label_id']">
          <b>Nomenclature : {{ meta_place['map_place_label_id'] }}</b>

        </p>
        <p>
          <b>Label actuel : {{ meta_place['term_fr']}}</b>

        </p>
        <p>
          <b>Label ancien : {{ meta_place['term']}}</b>

        </p>
        <p>
          <a :href="meta_place['map_place_before_restore_url']">Modèle 3D (avant restauration)</a>
        </p>
        <p>
          <a :href="meta_place['map_place_after_restore_url']">Modèle 3D (après restauration)</a>
        </p>






      </div>
    </div>
    <div class="column is-full">
      <div class="person-metadata-wrapper">
        <h3 class="section-title">Mentions remarquables</h3>
      </div>
    </div>
    <div class="column is-full" v-if="meta_place['events_count'] > 0">
      <div class="person-metadata-wrapper">
        <h3 class="section-title">Événements</h3>
        <p>total : {{ meta_place['events_count'] }}</p>
        <p>événements : {{ meta_place['events'] }}</p>
      </div>
    </div>

  </div>
</template>


<script>
import axios from 'axios';
import {mapState} from "vuex";


export default {
  name: "PlaceDataView",
  data() {
    return {
      reference_id: this.$route.params.id,
      meta_place: {},
    };
  },
  computed: {
    ...mapState(["personDbApi"]),
  },
  watch: {
    '$route.params.id': function (newId) {
      this.reference_id = newId;
      this.fetchPlaceData();
      window.scrollTo(0, 0);
    }
  },
  methods: {
    async fetchPlaceData() {
      try {
        const metaData = await this.fetchData(`/places/place/${this.reference_id}`);
        this.meta_place = metaData;
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    },
    async fetchData(endpoint) {
      const response = await axios.get(`${this.personDbApi}${endpoint}`);
      return response.data;
    },
  },
  created() {
    this.fetchPlaceData();
  },
}
</script>

<style scoped>

/* Set image banner */
.page-title, #banner-image::before {
  /*background-image: url("@/assets/banners/band_Personnes.png");*/
}

.person-name-columns {
  margin-bottom: 25px;
}

.person-name-columns > .column {
  padding: 0;
}

.columns {
  gap: 46px;
}

.columns:not(.has-carousel) {
  align-items: flex-start;
}

.columns, .column {
  position: relative;
  padding-top: 0;
}

.columns > .column {
  background-color: var(--panel-bg-color);
}

.columns.details-column > .column {
  padding: 8px 50px;
}

.columns.details-column > .column:first-child {
  padding-bottom: 80px;
}

.columns.details-column:not(.has-carousel) > .column:last-child {
  padding-bottom: var(--right-column-bottom-padding-desktop);
}


/* new styles */
.person-data-container-header {
  display: flex;
  flex-direction: column;
  background-color: var(--panel-bg-color);
  padding: 72px 40px 40px;
}

.person-data-container-header::after {
  content: "";
  display: block;
  width: 46px;
  height: 8px;
  margin: 16px 0;
  border-top: solid var(--light-brown-alt) 8px;
}

.person-data-container-header > span {
  font-size: 1.25em;
  font-weight: 400;
  font-style: normal;
  line-height: 33px;
  color: #000000;
}


.person-name {
  font-size: 2.25em;
  font-weight: 400;
  font-style: italic;
  line-height: 40px;
  color: #7B0C12;
  margin-bottom: 3px;
}

.canon-status {
  font-style: italic;
  color: #606060;
  font-size: 1.5rem;
  margin-right: 20rem;
}

.section-title {
  display: inline-block;
  font-size: 26px;
  color: #000000;
  font-weight: 400;
  font-style: italic;
  text-align: left;
  margin-bottom: 1.5rem;
  margin-top: 1rem;
  border-bottom: #303030 solid 3px;
}

.section-subtitle {
  margin-top: 30px;
  font-size: 18px;
  color: #000000;
  text-align: left;
}

.person-metadata-wrapper p {
  margin-bottom: 20px;
  font-family: var(--font-secondary);
  font-size: 20px;
  color: #6E6E6E;
}

.person-metadata-wrapper p > a {
  color: #6E6E6E;
}

.person-metadata-wrapper p > b {
  display: block;
  font-weight: 400;
  color: var(--light-brown-alt);
}

.logo__kb_icon {
  width: 30px;
  height: auto;
  margin-right: 10px;
  vertical-align: middle;
}

.link-list {
  text-align: left;
}

.link-list li {
  display: flex;
  align-items: center;
  gap: 25px;
  margin-bottom: 10px;
}

.link-list li span {
  display: inline-block;
  text-align: center;

  background-color: #ffffff;
  border-radius: 50%;
  min-width: 60px;
  min-height: 60px;
  line-height: 60px;
}

.link-list li img {
  vertical-align: middle;
  margin: 0;
  min-width: 40px;
  max-width: 50px;
  height: auto;
}

.link-list li a {
  font-family: var(--font-secondary);
  font-size: 20px;
  line-height: 1.15;
  color: #6E6E6E;
  word-break: break-word;
}

.link-list li a:hover {
  color: #BB062D;
}


.wrapper-db-link {
  position: absolute;
  left: 0;
  bottom: 0;

  display: block;

  width: 100%;
  border-top: 1px solid #e0e0e0;
  padding: 12px 38px;

  font-family: var(--font-secondary);
}

.wrapper-db-link a {
  font-size: 18px;
  font-weight: 500;
  color: #A53605;
}


.link-person-db:hover {
  color: #2a2a2a;
  text-decoration: underline;
}


@media screen and (max-width: 1024px) {

  #banner-image::before {
    background-color: #000000CC;
    background-image: none !important;
  }

  .columns.person-name-columns {
    padding: 0;
  }

  .person-data-container-header {
    padding: 35px var(--mobile-side-padding) 12px;
  }

  .columns {
    flex-direction: column;
  }

  .columns .column:first-child,
  .columns .column:last-child {
    display: block;
    width: 100%;
    max-width: 100% !important;
    padding: 0;
    background-color: transparent;
  }

  .columns.details-column > .column:first-child {
    padding-bottom: 20px;
  }

  .columns.details-column {
    position: relative;
    padding-bottom: 100px;
    margin-bottom: 100px;

    max-width: 100vw;
    overflow-x: hidden;
  }

  .columns.details-column > .column {
    position: unset;
  }

  .columns.details-column:not(.has-carousel) > .column:last-child {
    padding-bottom: 0;
  }

  .person-name {
    font-size: 30px;
  }

  .section-title {
    margin-top: 0;
  }

  .wrapper-db-link {
    border: none;
    justify-content: center;
  }
}

</style>
