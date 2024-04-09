<template>
  <div id="banner-image" class="container is-fluid"></div>

  <div class="page-title">
    <h1>Personnes</h1>
  </div>

  <div class="columns person-name-columns is-multiline">
    <div class="column is-full">
      <!-- Person header -->
      <div class="person-data-container-header">
        <h1 class="person-name">{{ meta_person['pref_label'] }}</h1>
        <span v-if="meta_person['is_canon']" class="canon-status">Chanoine</span>
      </div>
    </div>
  </div>

  <!-- end Person header -->
  <div class="columns is-multiline details-column" :class="{ 'has-carousel': collecta_urls.length > 0 }">

    <!-- top Person metadata -->
    <div :class="{'column is-full': isEventsEmpty, 'column': !isEventsEmpty}">
      <div class="person-metadata-wrapper">
        <h3 class="section-title">Identité</h3>

        <p>
          <b>Prénom(s) - Nomen :</b>
          {{ meta_person['forename_alt_labels'] }}
        </p>
        <p>
          <b>Nom(s) - Cognomen :</b>
          {{ meta_person['surname_alt_labels'] }}
        </p>
        <h4 class="section-subtitle">Présence dans les registres</h4>
        <p>
          <b>Première mention :</b>
          {{ formatDate(meta_person['first_mention_date']) }}
        </p>
        <p>
          <b>Dernière mention :</b>
          {{ formatDate(meta_person['last_mention_date']) }}
        </p>

        <div class="family-relationships-container" v-if="!isFamilyEmpty">
          <h3 class="section-title">Relations familiales</h3>
          <div v-for="relative in family_relations['relatives']" :key="relative['relative']['_id_endp']">
            <p>
              <b>{{ relative['relation_type'] }} :</b>
              <router-link :to="relative.relative._id_endp">{{ relative['relative']['pref_label'] }}</router-link>
            </p>
          </div>
        </div>

        <div class="person-data-links-container" v-if="!isLinksEmpty">
          <h3 class="section-title">Liens externes</h3>
          <div class="link-list">
            <ul>
              <li v-for="link in kb_urls" :key="link">
                <span><img class="logo__kb_icon" :src="mapping_kb_icons[link['type']]"></span>
                <a :href="link['url']" alt="{{link['type']}}" target="_blank">{{ link['url'] }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="wrapper-db-link is-flex is-align-items-center">
        <p><a class="link-person-db" :href="db_show_url" target="_blank">Accéder à la fiche personne en base</a></p>
      </div>
    </div>
    <!-- end top Person metadata -->
    <!-- Person events timeline -->
    <div class="column timeline-wrapper" v-if="!isEventsEmpty">
      <h3 class="section-title">Parcours</h3>
      <PersonDataTimeline :events-response="event_relations['events']"/>
    </div>
    <!-- end Person events timeline -->

  </div>
  <PersonDataCarousel :collecta-items="collecta_urls"/>
</template>


<script>
import axios from 'axios';
import {mapState} from "vuex";
import {spaceAroundCommas} from "@/modules/string_format";

import PersonDataTimeline from "@/components/PersonDataTimeline.vue";
import PersonDataCarousel from "@/components/PersonDataCarousel.vue";

export default {
  name: "PersonDataView",
  components: {
    PersonDataCarousel,
    PersonDataTimeline,
  },
  data() {
    return {
      reference_id: this.$route.params.id,
      meta_person: {},
      family_relations: {},
      event_relations: {},
      kb_urls: [],
      collecta_urls: [],
      mapping_kb_icons: {
        "Wikidata": require("@/assets/icons_kb/wikidata-icon.svg.png"),
        "Biblissima": require("@/assets/icons_kb/biblissima-icon.png"),
        "VIAF": require("@/assets/icons_kb/viaf-icon.png"),
        "DataBnF": require("@/assets/icons_kb/bnf-icon.svg.png"),
        "Studium Parisiense": require("@/assets/icons_kb/studium-icon.png"),
      },
      db_show_url: '',
    };
  },
  computed: {
    ...mapState(["personDbApi", "personDbAdminShow"]),

    isFamilyEmpty() {
      return !this.family_relations.relatives || this.family_relations.relatives.length === 0;
    },
    isEventsEmpty() {
      return !this.event_relations.events || this.event_relations.events.length === 0;
    },
    isLinksEmpty() {
      return !this.kb_urls || this.kb_urls.length === 0;
    },
  },
  watch: {
    '$route.params.id': function (newId) {
      this.reference_id = newId;
      this.fetchPersonData();
      window.scrollTo(0, 0);
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return 'Date non renseignée';
      const [year, monthCode, day] = date.split('-');
      const month = this.$store.state.months.find(m => m.iso_code === monthCode)?.name || '';
      return `${day ? `${day} ` : ''}${month} ${year}`;
    },
    async fetchPersonData() {
      try {
        const metaData = await this.fetchData(`/persons/person/${this.reference_id}`);
        this.meta_person = metaData;
        this.meta_person['forename_alt_labels'] = spaceAroundCommas(this.meta_person['forename_alt_labels']);
        this.meta_person['surname_alt_labels'] = spaceAroundCommas(this.meta_person['surname_alt_labels']);
        this.kb_urls = metaData.related_to.filter(link => link.type !== 'Collecta');
        this.collecta_urls = metaData.related_to.filter(link => link.type === 'Collecta');

        this.family_relations = await this.fetchData(`/persons/person/${this.reference_id}/family_relationships`);
        this.event_relations = await this.fetchData(`/persons/person/${this.reference_id}/events`);
        this.identifiers = await this.fetchData(`/meta/persons/person/${this.reference_id}?person_id=${this.reference_id}`);
        this.db_show_url = `${this.personDbAdminShow}${this.identifiers["person_show_db_path"]}`
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
    this.fetchPersonData();
  },
}
</script>

<style scoped>

/* Set image banner */
.page-title, #banner-image::before {
  background-image: url("@/assets/banners/band_Personnes.png");
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
