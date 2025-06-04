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
  <div class="columns" :class="{ 'has-map': hasMap }">
    <div v-if="hasMap" class="column-map">
      <PlaceChapelsMap :place="meta_place" class="map" />
    </div>
    <div class="columns is-multiline details-column" >

      <!-- top Place metadata -->
      <div class="column is-full">
        <div class="person-metadata-wrapper">
          <h3 class="section-title">Métadonnées</h3>

          <p v-if="meta_place['map_place_label_id']">
            <b>Nomenclature :</b> {{ meta_place['map_place_label_id'] }}
          </p>
          <p>
            <b>Label actuel :</b> {{ meta_place['term_fr']}}
          </p>
          <p>
            <b>Label ancien :</b> {{ meta_place['term']}}
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
          <ul>
            <li><a href="">Lien 1</a></li>
            <li><a href="">Lien 2</a></li>
          </ul>
        </div>
      </div>
      <div class="column is-full" v-if="meta_place['events_count'] > 0">
        <div class="person-metadata-wrapper">
          <div class="is-flex is-justify-content-space-between is-align-items-center">
            <h3 class="section-title">Événements</h3>
            <div class="place-events-count">{{ meta_place['events_count'] }}</div>
          </div>
          <!-- p>événements : {{ meta_place['events'] }}</p -->
          <table class="place-events-list">
            <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Personne</th>
              <th>Commentaire</th>
              <th>FacSimile</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="event in meta_place['events']" v-bind:key="event.id_endp">
              <td>{{ event.date ? event.date : "Sans" }}</td>
              <td class="place-events-type">{{ event.type }}</td>
              <td class="place-events-person">{{ event.person.pref_label }}</td>
              <td class="place-events-comment" >
                <div v-html=" event.comment"></div>
                <button @click="toggleComment($event)">Lire la suite</button>
              </td>
              <td class="place-events-facsimile">
                <a v-if="event.facsimile_url" :href="event.facsimile_url">Lien</a>
                <span v-else>N/A</span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>


<script>
import axios from 'axios';
import {mapState} from "vuex";
import PlaceChapelsMap from "@/components/PlaceChapelsMap.vue";


export default {
  name: "PlaceDataView",
  components: {PlaceChapelsMap},
  data() {
    return {
      reference_id: this.$route.params.id,
      meta_place: {},
    };
  },
  computed: {
    hasMap() {
      return this.meta_place && this.meta_place.topic === 'Chapelle';
    },
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
    toggleComment(event) {
      const button = event.target;
      const commentElement = button.parentElement;
      if (commentElement.classList.contains('is-opened')) {
        commentElement.classList.remove('is-opened');
      } else {
        commentElement.classList.add('is-opened');
      }
    }
  },
  created() {
    this.fetchPlaceData();
  },
}
</script>

<style scoped>

/* Set image banner */
#banner-image::before {
  background-size: 1920px auto;
  background-image: url("@/assets/banners/band_Lieux.png");
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

.columns.has-map {
  align-items: stretch;
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
  overflow-x: hidden;
}

.columns.details-column > .column:nth-child(1) {
  padding-bottom: 55px;
}

.columns.details-column > .column:nth-child(2) {
  padding-bottom: 40px;
}

.columns.details-column:not(.has-carousel) > .column:last-child {
  padding-bottom: var(--right-column-bottom-padding-desktop);
}

.column-map + .columns,
.column-map {
  width: calc(50% - 23px);
}

.column-map {
  border-top: solid 6px #000000;
}

/* new styles */
.person-data-container-header {
  display: flex;
  flex-direction: column;
  background-color: var(--panel-bg-color);
  padding: 72px 40px 80px;
}

.person-data-container-header::after {
  content: "";
  display: block;
  width: 46px;
  height: 8px;
  margin: 10px 0 16px;
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
  margin-bottom: 1.25rem;
  margin-top: 1rem;
  border-bottom: #303030 solid 3px;
}

.section-subtitle {
  margin-top: 30px;
  font-size: 18px;
  color: #000000;
  text-align: left;
}

.person-metadata-wrapper > div:first-child {
  margin-bottom: 12px;
}

.person-metadata-wrapper > ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.person-metadata-wrapper ul,
.person-metadata-wrapper p {
  font-family: var(--font-secondary);
  font-size: 20px;
  color: #6E6E6E;
}

.person-metadata-wrapper ul > li ,
.person-metadata-wrapper p {
  margin-bottom: 10px;
}

.person-metadata-wrapper ul > li > a,
.person-metadata-wrapper p > a {
  color: #6E6E6E;
  text-decoration: underline;
}

.person-metadata-wrapper p > a:hover {
  color: var(--link-over-color);
}

.person-metadata-wrapper p > b {
  font-weight: 400;
  color: var(--light-brown-alt);
}

.place-events-count {
  font-family: var(--font-primary);
  font-size: 40px;
  color: var(--light-brown-alt);
  font-weight: 400;
}

table.place-events-list {
  width: 100%;
  border-collapse:separate;
  border-spacing: 4px;
  margin-left: -4px;
  font-family: var(--font-secondary);
  font-size: 16px;
}

.place-events-list th {
  background-color: #6B6B6B;
  padding: 1px 15px 2px;
  font-weight: 400;
  color: #FFFFFF;
  text-transform: uppercase;
  text-align: center;
}

.place-events-list td {
  padding: 10px 15px 20px 15px;
  background-color: #EDEDED;
  color: #454545;
}

/* Table size without map */
.place-events-list td.place-events-type {
  min-width: 170px;
}

.place-events-list td.place-events-person {
  min-width: 210px;
}

/* Table size with map */
.column-map + .columns table.place-events-list {
  margin-left: -50px;
  margin-right: -50px;
  width: calc(100% + 100px);
}

.column-map + .columns .place-events-type,
.column-map + .columns .place-events-person {
  min-width: unset;
}


.place-events-list td.place-events-comment {
  position: relative;
  padding: 10px 60px 20px 15px;
}

.has-map .place-events-list td.place-events-comment {
  padding-bottom: 60px;
}

.place-events-list td.place-events-comment > button {
  display: none;
}

.has-map .place-events-list td.place-events-comment > div {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
}

.has-map .place-events-list td.place-events-comment.is-opened > div {
  overflow: auto;
  display: block;
}

.has-map .place-events-list td.place-events-comment > button {
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: inline-block;
  width: 20px;
  height: 20px;
  background: url("@/assets/images/b_Open_20x20.svg") center / cover;
  border: none;
  text-indent: -9999px;
  cursor: pointer;
}

.has-map .place-events-list td.place-events-comment.is-opened > button {
  background-image: url("@/assets/images/b_Close_20x20.svg");
  filter: grayscale(100%);
}


.place-events-list td.place-events-facsimile {
  text-align: center;
}

.place-events-list td.place-events-facsimile a {
  text-indent: -9999px;
  display: inline-block;
  width: 15px;
  height: 15px;
  background: url("@/assets/images/lieux_tab_goto.svg") center / cover;
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

  .columns .column {
    display: block;
    width: 100%;
    max-width: 100% !important;
    padding: 0;
    background-color: transparent;
  }

  .columns.details-column > .column {
    padding-left: 0;
    padding-right: 0;
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

  .column-map + .columns,
  .column-map {
    width: 100%;
  }

  .column-map + .columns table.place-events-list,
  .columns table.place-events-list {
    margin-left: 0;
    margin-right: 0;
    width: 100%;
  }

  .place-events-list td.place-events-type,
  .place-events-list td.place-events-person,
  .columns .place-events-type,
  .columns .place-events-person {
    min-width: unset;
  }

}

@media screen and (max-width: 640px) {

}

</style>
