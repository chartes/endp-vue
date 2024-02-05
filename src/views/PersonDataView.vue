<template>
  <!-- Person header -->
  <div class="person-data-container-header">
    <h1 class="person-name">{{ meta_person['pref_label'] }}</h1>
    <span v-if="meta_person['is_canon']" class="canon-status">~ Chanoine ~</span>
  </div>
  <!-- end Person header -->
  <div class="columns is-multiline">
    <div class="column is-full">
      <div class="wrapper-db-link is-flex is-align-items-center">
        <i class="fas fa-database"></i>
        <!-- Utilisez une marge à gauche (par exemple, ml-2) pour espacer l'icône et le texte, si nécessaire -->
        <p>Accéder à la <a class="link-person-db" :href="db_show_url" target="_blank">fiche personne en base</a></p>
      </div>
    </div>

    <!-- top Person metadata -->
    <div :class="{'column is-full': isEventsEmpty, 'column is-5': !isEventsEmpty}">
      <div class="person-metadata-wrapper">
        <h3 class="section-title">Identité</h3>
        <p><b>Prénom(s) - nomen</b> : {{ meta_person['forename_alt_labels'] }}</p>
        <p><b>Nom(s) - cognomen</b> : {{ meta_person['surname_alt_labels'] }}</p>

        <h4 class="section-subtitle">Présence dans les registres</h4>
        <p><b>Première mention</b> : {{ formatDate(meta_person['first_mention_date']) }}</p>
        <p><b>Dernière mention</b> : {{ formatDate(meta_person['last_mention_date']) }}</p>

        <div class="family-relationships-container" v-if="!isFamilyEmpty">
          <h3 class="section-title">Relations familiales</h3>
          <div v-for="relative in family_relations['relatives']" :key="relative['relative']['_id_endp']">
            <p>{{ relative['relation_type'] }}
              <router-link :to="relative.relative._id_endp">{{ relative['relative']['pref_label'] }}</router-link>
            </p>
          </div>
        </div>

        <div class="person-data-links-container" v-if="!isLinksEmpty">
          <h3 class="section-title">Liens externes</h3>
          <div class="link-list">
            <ul>
              <li v-for="link in kb_urls" :key="link">
                <img class="logo__kb_icon" :src="mapping_kb_icons[link['type']]">
                <a :href="link['url']" alt="{{link['type']}}" target="_blank">{{ link['url'] }}</a>
              </li>
            </ul>
          </div>
        </div>
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
import PersonDataTimeline from "@/components/PersonDataTimeline.vue";
import PersonDataCarousel from "@/components/PersonDataCarousel.vue";
import {mapState} from "vuex";

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
@import url('https://fonts.googleapis.com/css2?family=Charm&display=swap');

/* new styles */
.person-data-container-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 5rem 10rem;
  text-align: center;
}

.person-name {
  font-family: 'Charm', cursive;
  font-size: 3em;
  margin-bottom: 2rem;
  margin-right: 20rem;
  color: #2a2a2a;
}

.canon-status {
  font-style: italic;
  color: #606060;
  font-size: 1.5rem;
  margin-right: 20rem;
}

.person-metadata-wrapper,
.timeline-wrapper {
  margin-left: 2rem;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 35px;
  text-align: left;
  margin-bottom: 1.5rem;
  margin-top: 1rem;
}

.section-subtitle {
  font-size: 20px;
  text-align: left;
  margin-top: 1rem;
  margin-bottom: 1rem;
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
  margin-bottom: 10px;
}

.wrapper-db-link {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  gap: 0.5rem;
  border: 1px solid #2a2a2a;
  padding: 0.5rem;
  border-radius: 5px;
  width: fit-content;
  margin-left: 2rem;
}

.link-person-db:hover {
  color: #2a2a2a;
  text-decoration: underline;
}
</style>
