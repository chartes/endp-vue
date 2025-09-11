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
      <PlaceChapelsMap :place="meta_place" class="map"/>
    </div>
    <div class="columns is-multiline details-column">

      <!-- top Place metadata -->
      <div class="column is-full">
        <div class="person-metadata-wrapper">
          <h3 class="section-title">Métadonnées</h3>

          <p v-if="meta_place['map_place_label_id']">
            <b>Nomenclature :</b> {{ meta_place['map_place_label_id'] }}
          </p>
          <p>
            <b>Label actuel :</b> {{ meta_place['term_fr'] }}
          </p>
          <p>
            <b>Label ancien :</b> {{ meta_place['term'] }}
          </p>
          <p v-if="meta_place['map_place_before_restore_url']">
            <a :href="meta_place['map_place_before_restore_url']">Modèle 3D (avant restauration)</a>
          </p>
          <p v-if="meta_place['map_place_after_restore_url']">
            <a :href="meta_place['map_place_after_restore_url']">Modèle 3D (après restauration)</a>
          </p>


        </div>
      </div>
      <!--
      TODO: évolution possible mais implique évolution du modèle de données
      <div class="column is-full">
        <div class="person-metadata-wrapper">
          <h3 class="section-title">Mentions remarquables</h3>
          <ul>
            <li><a href="">Lien 1</a></li>
            <li><a href="">Lien 2</a></li>
          </ul>
        </div>
      </div>-->
      <div class="column is-full" v-if="meta_place['events_count'] > 0">
        <div class="person-metadata-wrapper">
          <div class="is-flex is-justify-content-space-between is-align-items-center">
            <h3 class="section-title">Événements</h3>
            <div class="place-events-count">{{ meta_place['events_count'] }}</div>
          </div>
          <div v-if="extremeRange" class="extreme-dates">
            Dates extrêmes :
            <strong>
              {{
                extremeRange.min === extremeRange.max ? extremeRange.min : (extremeRange.min + '–' + extremeRange.max)
              }}
            </strong>
          </div>
          <div class="is-flex is-align-items-center is-justify-content-space-between" style="margin: 10px 0 16px;">
          </div>
          <div class="place-events-list-wrapper">
            <table class="place-events-list">
              <thead>
              <tr>
                <th>
                <span class="header-label">
                  <button class="btn-icon" @click="toggleSortOrder">
                    <i v-if="sortOrder === 'asc'" class="fas fa-arrow-up"></i>
                    <i v-else class="fas fa-arrow-down"></i>
                  </button>
                  Date
                </span>
                </th>
                <th>Type</th>
                <th>Personne</th>
                <th>Commentaire</th>
                <th>FacSimile</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="event in sortedEvents" v-bind:key="event.id_endp">
                <td>{{ formatDate(event.date) }}</td>
                <td class="place-events-type">{{ event.type }}</td>
                <td class="place-events-person">
                  <a href
                     class="link-person-db"
                     @click.prevent="goToPerson(event)">
                    {{ event.person.pref_label }}
                  </a>
                </td>
                <td class="place-events-comment">
                  <div v-html="event.comment"></div>
                  <button @click="toggleComment($event)">Lire la suite</button>
                </td>
                <td class="place-events-facsimile">
                  <a v-if="event.facsimile_url" :href="adaptUrl(event.facsimile_url)">Lien</a>
                  <span v-else>N/A</span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
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
      sortOrder: 'asc' // or 'desc'
    };
  },
  computed: {
    hasMap() {
      const chapels_in_ndp = [
        "place_chapelle_endp_TWtc8LoL",
        "place_chapelle_endp_xmnangA2",
        "place_chapelle_endp_LMpAL5tS",
        "place_chapelle_endp_PSAxA3DP",
        "place_chapelle_endp_e3UyZC3H",
        "place_chapelle_endp_wDSkJ5p6",
        "place_chapelle_endp_hG4dN5wp",
        "place_chapelle_endp_a10VXGAa",
        "place_chapelle_endp_qY3efJPI",
        "place_chapelle_endp_x03bJRpB",
        "place_chapelle_endp_g1DVzjZy",
        "place_chapelle_endp_rFueHa72",
        "place_chapelle_endp_7inqDXDj",
        "place_chapelle_endp_SmQd80HP",
        "place_chapelle_endp_MICRWV6w",
        "place_chapelle_endp_2SEPiZkl",
        "place_chapelle_endp_jWlwQBBp",
        "place_chapelle_endp_HgZzrFUG",
        "place_chapelle_endp_7QCUUSnF",
        "place_chapelle_endp_rFUmppSZ",
        "place_chapelle_endp_bPt9xC79",
        "place_chapelle_endp_KmzrjcsB",
        "place_chapelle_endp_lMSzvBz2",
        "place_chapelle_endp_2rK0iGGN",
        "place_chapelle_endp_ShCl87Ly",
        "place_chapelle_endp_sceGkn9V",
        "place_chapelle_endp_jmwXUWLb",
        "place_chapelle_endp_q50GSp7g",
        "place_chapelle_endp_41uJwmOM",
        "place_chapelle_endp_UQyOelUy",
        "place_chapelle_endp_JMph1CUS",
        "place_chapelle_endp_zRelmASI",
        "place_chapelle_endp_ghGGCfRJ",
        "place_chapelle_endp_W0HhriG9",
        "place_chapelle_endp_PIHU8Wr2"
      ]
      return this.meta_place && chapels_in_ndp.includes(this.meta_place.id_endp) && this.meta_place.topic === 'Chapelle';
    },
    extremeRange() {
    const events = (this.meta_place && Array.isArray(this.meta_place.events))
      ? this.meta_place.events
      : [];

    // Récupère toutes les années valides
    const years = events
      .map(e => this.yearFromDate(e?.date))
      .filter(y => y !== null);

    if (!years.length) return null;

    const min = Math.min(...years);
    const max = Math.max(...years);
    return { min, max };
  },
    sortedEvents() {
      const list = (this.meta_place && Array.isArray(this.meta_place.events))
          ? this.meta_place.events.slice()
          : [];

      return list.sort((a, b) => {
        const da = this.dateKey(a?.date);
        const db = this.dateKey(b?.date);

        // Dates inconnues toujours en bas
        if (!da && !db) return 0;
        if (!da) return 1;
        if (!db) return -1;

        // Tri asc/desc
        let cmp = this.sortOrder === 'asc' ? (da.key - db.key) : (db.key - da.key);
        if (cmp !== 0) return cmp;

        // Même clé -> plus précis d'abord (YYYY-MM-DD > YYYY-MM > YYYY)
        if (db.precision !== da.precision) return db.precision - da.precision;

        // Même précision -> exact avant approximatif
        if (da.isApprox !== db.isApprox) return da.isApprox ? 1 : -1;

        return 0;
      });
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
      console.log(this.personDbApi)
      const response = await axios.get(`${this.personDbApi}${endpoint}`);
      return response.data;
    },
    yearFromDate(dateStr) {
    if (!dateStr) return null;
    const clean = String(dateStr).trim().replace(/~/g, '');
    const year = parseInt(clean.split('-')[0], 10);
    return Number.isFinite(year) ? year : null;
  },
    dateKey(dateStr) {
      if (!dateStr) return null;

      const raw = String(dateStr).trim();
      const isApprox = raw.startsWith('~');
      const clean = raw.replace(/~/g, '');

      const parts = clean.split('-').map(p => parseInt(p, 10)).filter(n => !isNaN(n));
      const [y, m, d] = [parts[0], parts[1], parts[2]];
      if (!y) return null;

      // Pour des dates partielles, on prend une borne qui dépend du sens de tri
      const month = (typeof m === 'number') ? m : (this.sortOrder === 'asc' ? 1 : 12);
      const day = (typeof d === 'number') ? d : (this.sortOrder === 'asc' ? 1 : 31);

      return {
        key: y * 10000 + month * 100 + day,
        precision: parts.length, // YYYY=1, YYYY-MM=2, YYYY-MM-DD=3
        isApprox
      };
    },
    toggleSortOrder() {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    },

    formatDate(date) {
      console.log(date);
      if (!date) return 'Date non renseignée';

      const parts = date.split('-');
      let formattedDate = '';

      if (parts[0]) {
        formattedDate = parts[0]; // Année
      }
      if (parts[1]) {
        const month = this.$store.state.months.find(m => m.iso_code === parts[1]);
        const monthName = month ? month.name : '';
        formattedDate = monthName + (formattedDate ? ` ${formattedDate}` : '');
      }
      if (parts[2]) {
        formattedDate = `${parts[2]} ${formattedDate}`; // Jour
      }
      console.log(formattedDate)
      return formattedDate;
    },
    adaptUrl(url) {
      // if this.personDbApi not contains "dev" change base url "https://dev.chartes.psl.eu/endp/facsimile/LL120/120" => "https://endp.chartes.psl.eu/endp/facsimile/LL120/120"
      if (!this.personDbApi.includes("dev")) {
        return url.replace("https://dev.chartes.psl.eu/endp/facsimile/", "https://endp.chartes.psl.eu/endp/facsimile/");
      }
    },
    toggleComment(event) {
      const button = event.target;
      const commentElement = button.parentElement;
      if (commentElement.classList.contains('is-opened')) {
        commentElement.classList.remove('is-opened');
      } else {
        commentElement.classList.add('is-opened');
      }
    },
    goToPerson(event) {
      // Normalise l’id d’événement au cas où la clé varie
      const eventId = event.id_endp || event._id_endp || null;
      this.$store.commit('nav/setFocus', {
        focusDate: event.date || 'Date inconnue',
        focusEventId: eventId,
      });
      this.$router.push({name: 'person', params: {id: event.person.id_endp}});
    },
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
  width: 100%;
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

.person-metadata-wrapper ul > li,
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

.place-events-list-wrapper {
  max-height: 75vh;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #CC3E46 #EDEDED !important;
}

@supports selector(::-webkit-scrollbar) {

  .place-events-list-wrapper {
    scrollbar-width: auto;
  }

  .place-events-list-wrapper::-webkit-scrollbar {
    width: 10px;
  }

  .place-events-list-wrapper::-webkit-scrollbar-track {
    border-radius: 0;
    background-color: #EDEDED;
  }

  .place-events-list-wrapper::-webkit-scrollbar-thumb {
    border-radius: 0;
    background-color: #CC3E46;
  }
}




table.place-events-list thead tr th {
  position: sticky;
  top: 0;
  z-index: 2;
}

table.place-events-list {
  width: 100%;
  border-collapse: collapse;
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

table.place-events-list thead tr th,
.place-events-list td {
  border: 5px solid #f7f7f7;
  border-top: none;
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
.column-map + .columns .place-events-list-wrapper {
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

.place-events-list td.place-events-comment {
  padding-bottom: 60px;
}

.place-events-list td.place-events-comment > button {
  display: none;
}

.place-events-list td.place-events-comment > div {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
}

.place-events-list td.place-events-comment.is-opened > div {
  overflow: auto;
  display: block;
}

.place-events-list td.place-events-comment > button {
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

.place-events-list td.place-events-comment.is-opened > button {
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
  margin-top: 8px;
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

  .column-map + .columns .place-events-list-wrapper,
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

  /* Merges columns 2,3 and 4 (with ou without interactive map) */
  table.place-events-list {

    thead {
      display: block;

      tr {
        display: flex;
        gap: 4px;
        margin-bottom: 4px;

        th {
          border: none;
        }

        th:nth-child(1) {
          width: 110px;
        }

        th:nth-child(2) {
          width: calc(100% - 208px);
          text-indent: -9999px;
        }

        th:nth-child(3),
        th:nth-child(4) {
          display: none;
        }

        th:nth-child(5) {
          width: 90px;
        }
      }
    }

    tbody {
      display: block;

      tr {
        display: grid;
        gap: 0 4px;
        margin-bottom: 4px;
        grid-template-columns: 110px auto 90px;
        grid-template-rows: auto;
        grid-template-areas:
        "place_event_date place_event_type place_event_facsimile"
        "place_event_date place_event_person place_event_facsimile"
        "place_event_date place_event_comment place_event_facsimile";

        td {
          padding-bottom: 5px;
          border: none;
        }

        td:nth-child(1) {
          grid-area: place_event_date;
        }

        td:nth-child(2) {
          grid-area: place_event_type;

          &::before {
            content: "Type :";
            display: block;
            font-weight: bold;
          }
        }

        td:nth-child(3) {
          grid-area: place_event_person;

          &::before {
            content: "Personne :";
            display: block;
            font-weight: bold;
          }
        }

        td:nth-child(4) {
          grid-area: place_event_comment;

          &::before {
            content: "Commentaire :";
            display: block;
            font-weight: bold;
          }
        }

        td:nth-child(5) {
          grid-area: place_event_facsimile;
        }
      }
    }
  }

  .has-map .place-events-list td.place-events-comment {
    padding-bottom: 40px;
  }

  .place-events-list td.place-events-comment {
    padding-right: 20px;
  }
}

@media screen and (min-width: 1024px) and (max-width: 1230px) {

  .has-map {
    /* With interactive map only : same rules as (max-width: 640px) above  */

    /* Merges columns 2,3 and 4 */

    table.place-events-list {

      thead {
        display: block;

        tr {
          display: flex;
          gap: 4px;
          margin-bottom: 4px;

          th {
            border: none;
          }

          th:nth-child(1) {
            width: 110px;
          }

          th:nth-child(2) {
            width: calc(100% - 208px);
            text-indent: -9999px;
          }

          th:nth-child(3),
          th:nth-child(4) {
            display: none;
          }

          th:nth-child(5) {
            width: 90px;
          }
        }
      }

      tbody {
        display: block;

        tr {
          display: grid;
          gap: 0 4px;
          margin-bottom: 4px;
          grid-template-columns: 110px auto 90px;
          grid-template-rows: auto;
          grid-template-areas:
        "place_event_date place_event_type place_event_facsimile"
        "place_event_date place_event_person place_event_facsimile"
        "place_event_date place_event_comment place_event_facsimile";

          td {
            padding-bottom: 5px;
            border: none;
          }

          td:nth-child(1) {
            grid-area: place_event_date;
          }

          td:nth-child(2) {
            grid-area: place_event_type;

            &::before {
              content: "Type :";
              display: block;
              font-weight: bold;
            }
          }

          td:nth-child(3) {
            grid-area: place_event_person;

            &::before {
              content: "Personne :";
              display: block;
              font-weight: bold;
            }
          }

          td:nth-child(4) {
            grid-area: place_event_comment;

            &::before {
              content: "Commentaire :";
              display: block;
              font-weight: bold;
            }
          }

          td:nth-child(5) {
            grid-area: place_event_facsimile;
          }
        }
      }
    }
  }

  /* Same rules as (max-width: 640px) above;  */
  .has-map .place-events-list td.place-events-comment {
    padding-bottom: 40px;
  }

  .place-events-list td.place-events-comment {
    padding-right: 20px;
  }
}

.page-title {
  z-index: 1000 !important;
}

.link-person-db {
  color: #2a2a2a;
  font-weight: 100;
}

.link-person-db:hover {
  color: #6E6E6E;
  text-decoration: underline;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.header-label {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9em;
  padding: 0;
  line-height: 1;
  color: inherit;
}

.btn-icon:hover {
  color: #A53605; /* ta couleur accent */
}

.extreme-dates {
  margin: 6px 0 14px;
  font-family: var(--font-secondary);
  color: #6E6E6E;
}
.extreme-dates strong { color: #000; }
</style>
