<template>
  <div class="container">
    <br>
    <h1 class="label-person">{{ meta_person['pref_label'] }}<span v-if="meta_person['is_canon']"> ~ Chanoine </span>
    </h1>
    <br>
    <hr class="sep-3"/>
    <img class="wiki-person-img" v-if="imageUrl" :src="imageUrl">
    <br>
    <br>
    <!--<p><b>ID endp</b> : {{ meta_person['_id_endp'] }}</p>-->
    <p><b>Prénom(s) - nomen</b> : {{ meta_person['forename_alt_labels'] }}</p>
    <p><b>Nom(s) - cognomen</b> : {{ meta_person['surname_alt_labels'] }}</p>
    <br>
    <p><b>Première mention dans le registre</b> : {{ meta_person['first_mention_date'] }}</p>
    <p><b>Dernière mention dans le registre</b> : {{ meta_person['last_mention_date'] }}</p>
    <br>
    <hr>
    <h3 v-if="!events_empty" style="font-family: cursive; font-size: 35px; text-align: left">Parcours</h3>
    <!--<p>{{event_relations}}</p>-->
    <ul class="events-list">
      <li v-for="event in event_relations['events']" :key="event._id_endp" class="event-item">
        <div class="event-content">
          <!-- Type d'événement -->
          <span class="event-type">☞ <b>{{ event.type }}</b> : </span>

          <!-- Thesaurus term (label) -->
          <span v-if="event.thesaurus_term_person" class="event-term"><u>{{ event.thesaurus_term_person.topic }}</u> : {{
              event.thesaurus_term_person.term_fr
            }} ({{ event.thesaurus_term_person.term_la }})</span>

          <!-- Place term (label) -->
          <span v-if="event.place_term" class="event-place"><u>Lieu</u> : {{
              event.place_term.term_fr
            }} ({{ event.place_term.term_la }})</span>

          <!-- Date de l'événement -->
          <span class="event-date">{{ event.date ? event.date : 'date inconnue' }}</span>
        </div>

        <!-- Sous-liste pour l'image et le prédécesseur -->
        <ul class="sub-list">
          <!-- Image de l'événement -->
          <li>▹ test image url</li>
          <!-- Prédécesseur -->
          <li>▹ test prédecesseur</li>
        </ul>

      </li>
      <br>
    </ul>
    <h3 v-if="!family_empty" style="font-family: cursive; font-size: 35px; text-align: left">Relations familiales</h3>
    <div v-for="relative in family_relations['relatives']" :key="relative['relative']['_id_endp']">
      <p>{{ relative['relation_type'] }}
        <router-link :to="relative.relative._id_endp">{{ relative['relative']['pref_label'] }}</router-link>
      </p>
    </div>

    <h3 v-if="links_empty" style="font-family: cursive; font-size: 35px; text-align: left">Liens externes</h3>
    <div class="link-list">
      <ul>
        <li v-for="link in kb_urls" :key="link">
          <img class="logo__kb_icon" :src="mapping_kb_icons[link['type']]">  <a :href="link['url']"
                                                                                                    alt="{{link['type']}}"
                                                                                                    target="_blank">{{
            link['url']
          }}</a>
          <div class="container" v-if="link['type'] === 'Studium Parisiense'">
            <br>
            <br>
    <button class="button is-dark" @click="toggleDropdown">
      <span style="font-size: 20px">Bibliographie (Studium Parisiense)</span><span class="chevron" v-bind:class="{ up: showDropdown }"></span>
    </button>

    <div v-if="showDropdown" class="box content">
    <div v-if="jsonResponse && jsonResponse.bibliography">

        <div v-if="jsonResponse.bibliography.workSources">
            <h3 style="font-family: cursive;">Sources inédites et éditées</h3>
          <hr>
            <ul>
                <li v-for="(source, index) in jsonResponse.bibliography.workSources" :key="index">{{ source.value }}</li>
            </ul>
        </div>

        <div v-if="jsonResponse.bibliography.workReferences">
            <h3 style="font-family: cursive;">Ouvrages usuels et instruments de travail</h3>
          <hr>
            <ul>
                <li v-for="(ref, index) in jsonResponse.bibliography.workReferences" :key="index">{{ ref.value }}</li>
            </ul>
        </div>

        <div v-if="jsonResponse.bibliography.bookReferences">
            <h3 style="font-family: cursive;">Ouvrages sur l'individu</h3>
          <hr>
            <ul>
                <li v-for="(book, index) in jsonResponse.bibliography.bookReferences" :key="index">{{ book.value }}</li>
            </ul>
        </div>

    </div>
</div>

            <br>
            <br>
  </div>
        </li>
      </ul>
    </div>
    <br>
    <div>
      <h3 v-if="!collecta_ressources" style="font-family: cursive; font-size: 35px; text-align: left">Disponible sur
        <span
            class="logo-collecta">COLLECTA</span></h3>
      <br>
      <Carousel :itemsToShow="collecta_urls.length < 3 ? collecta_urls.length : 3" :wrapAround="true" :transition="500">
        <Slide v-for="link in collecta_urls" :key="link">
          <a :href="link['url']" alt="{{link['type']}}" target="_blank">
            <img class="carousel__item" :src="transformCollectaUrl(link['url'], '.jpg')"
                 @error="$event.target.style.display='none'">
            <img class="carousel__item" :src="transformCollectaUrl(link['url'], '.jpeg')"
                 @error="$event.target.style.display='none'">
          </a>
        </Slide>
        <template #addons>
          <Navigation v-if="collecta_urls.length > 1"/>
          <Pagination v-if="collecta_urls.length > 1"/>
        </template>
      </Carousel>
    </div>
    <br>

    <br>
  </div>
</template>

<script>
import axios from 'axios';
import {toArray} from "uri-js/dist/esnext/util";
import {Carousel, Slide, Pagination, Navigation} from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';
export default {
  name: "PersonDataView",
  components: {
    Carousel,
    Slide,
    Pagination,
    Navigation
  },
  data() {
    return {
      showDropdown: false,
      jsonResponse: {},
      dbAdminPath: process.env.VUE_APP_DB_API,
      reference_id: this.$route.params.id,
      meta_person: {},
      studium_id: null,
      image_empty: true,
      family_empty: true,
      events_empty: true,
      links_empty: true,
      collecta_ressources: true,
      family_relations: {},
      event_relations: {},
      person_qid: '',
      imageUrl: null,
      entity: {},
      kb_urls: {},
      collecta_urls: {},
      mapping_kb_icons: {
        "Wikidata": require("../assets/icons_kb/wikidata-icon.svg.png"),
        "Biblissima": require("../assets/icons_kb/biblissima-icon.png"),
        "VIAF": require("../assets/icons_kb/viaf-icon.png"),
        "DataBnF": require("../assets/icons_kb/bnf-icon.svg.png"),
        "Studium Parisiense": require("../assets/icons_kb/studium-icon.png"),
      }
    };
  },
  watch: {
    '$route.params.id': function (newId) {
      this.reference_id = newId;
      this.getPersonMeta();
      this.getEventRelations();
      this.getFamilyRelations();
      window.scrollTo(0, 0);
    }
  },
  methods: {
    toArray,
    toggleDropdown() {
      if (!this.showDropdown) {
        this.fetchApiData();
      }
      this.showDropdown = !this.showDropdown;
    },
    async fetchApiData() {
      try {
        const response = await fetch("http://studium-parisiense.univ-paris1.fr/api/prosopography/"+this.studium_id); // Remplacez "URL_DE_VOTRE_API" par l'URL de votre API.
        if (response.ok) {
          this.jsonResponse = await response.json();
        } else {
          console.error("Erreur lors de la récupération des données de l'API:", response.statusText);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données de l'API:", error);
      }
    },
    fetchImageFromWikidata() {
      axios.get(`http://www.wikidata.org/wiki/Special:EntityData/${this.person_qid}.json`).then(
          (res) => {
            this.entity = res.data.entities[this.person_qid];
            if (this.entity['claims']['P18']) {
              this.imageUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${this.entity['claims']['P18'][0]['mainsnak']['datavalue']['value']}`
              console.log(this.imageUrl)
            }
          }
      )
    },
    getPersonMeta() {
      const path = `${this.dbAdminPath}/persons/person/${this.reference_id}`;
      axios.get(path)
          .then((res) => {
            this.meta_person = res.data;
            console.log(this.meta_person['related_to'])
            if (this.meta_person['related_to'].length > 0) {
              this.collecta_ressources = this.meta_person['related_to'].filter(link => link['type'] === 'Collecta').length === 0;
            this.collecta_urls = this.meta_person['related_to'].filter(link => link['type'] === 'Collecta');
            this.kb_urls = this.meta_person['related_to'].filter(link => link['type'] !== 'Collecta');
            this.studium_id = this.meta_person['related_to'].filter(link => link['type'] === 'Studium Parisiense')[0]['url'].split('/').pop();
            this.links_empty = this.links_empty = this.kb_urls.length === 0;
            if (this.meta_person['related_to'].filter(link => link['type'] === 'Wikidata').length > 0) {
              this.person_qid = this.meta_person['related_to'].filter(link => link['type'] === 'Wikidata')[0]['url'].split('/').pop();
              this.fetchImageFromWikidata();
            }
            }

          })
          .catch(error => {
            console.error("Erreur lors de la récupération des métadonnées de la personne:", error);
          });
    },

    getFamilyRelations() {
      const path = `${this.dbAdminPath}/persons/person/${this.reference_id}/family_relationships`;
      axios.get(path)
          .then((res) => {
            this.family_relations = res.data;
            this.family_empty = this.family_relations['relatives'].length === 0;
          })
          .catch(error => {
            console.error("Erreur lors de la récupération des relations familiales:", error);
          });
    },

    getEventRelations() {
      const path = `${this.dbAdminPath}/persons/person/${this.reference_id}/events`;
      axios.get(path)
          .then((res) => {
            this.event_relations = res.data;
            this.events_empty = this.event_relations['events'].length === 0;
          })
          .catch(error => {
            console.error("Erreur lors de la récupération des événements:", error);
          });
    },
    transformCollectaUrl(originalUrl, extension) {
      const lastSegment = originalUrl.split('/').pop();
      return `https://www.collecta.fr/_files/uploads/thumbs/900/${lastSegment}-1${extension}`;
    }
  },
  created() {
    this.getPersonMeta();
    this.getFamilyRelations();
    this.getEventRelations();
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Charm&display=swap');

.label-person {
  font-family: 'Charm', cursive;
  font-size: 3em;
}

.grid-container {
  display: flex;
  flex-wrap: wrap;
}

.grid-item {
  flex: 1 1 calc(33.333% - 10px); /* 33.333% pour 3 éléments par ligne, 10px pour une petite marge */
  margin: 5px; /* Petite marge autour de chaque élément */
}

.grid-item img {
  max-width: 60%; /* Réduisez la largeur maximale à 80% de la largeur du conteneur */
  height: auto; /* Conservez le rapport hauteur/largeur */
  display: block; /* Pour centrer l'image */
  margin: 0 auto; /* Centre l'image horizontalement */
}

hr {
  border: none;
  height: 1px;
  background-image: linear-gradient(to right, #f0f0f0, #8f8f8f, #f0f0f0);
}

hr.sep-3 {
  border: none;
  height: 1px;
  background-image: linear-gradient(to right, #f0f0f0, #8f8f8f, #f0f0f0);
}

hr.sep-3::after {
  content: '⁂';
  color: black;
  display: inline-block;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  transform-origin: 50% 50%;
  padding: 1rem;
  background-color: white;
}

.wiki-person-img {
  width: 15%;
  height: auto;
  border: 3px solid #030303;
}

.events-list {
  list-style-type: none;
  padding-left: 0;
}

.event-item {
  margin-bottom: 20px; /* Espacement entre les éléments de la liste */
}

.event-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.event-type,
.event-term,
.event-place {
  margin-right: 10px; /* Espacement entre les spans */
}

.event-date {
  margin-left: auto; /* Centrer à l'extrême droite */
}

.sub-list {
  list-style-type: none;
  margin-left: 20px; /* Indentation pour la sous-liste */
  padding-left: 0; /* Supprimer le padding par défaut */
}

.sub-list li {
  text-align: left; /* Aligner le contenu à gauche */
}

.logo-collecta {
  adding: 0.5em;
  color: #d40000;
  font-size: 1em;
  font-weight: 500;
  text-transform: uppercase;
  flex-grow: 2;
  position: relative;
  font-family: monospace !important;
}

.logo__kb_icon {
  width: 30px;
  height: auto;
  margin-right: 10px;
}

.carousel__item {
  min-height: 300px;
  width: 300px;
  /*font-size: 20px;*/
  border-radius: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}


.carousel__slide {
  padding: 5px;
}

.carousel__viewport {
  perspective: 2000px;
}

.carousel__track {
  transform-style: preserve-3d;
}

.carousel__slide--sliding {
  transition: 0.5s;
}

.carousel__slide {
  opacity: 0.9;
  transform: rotateY(-20deg) scale(0.9);
}

.carousel__slide--active ~ .carousel__slide {
  transform: rotateY(20deg) scale(0.9);
}

.carousel__slide--prev {
  opacity: 1;
  transform: rotateY(-10deg) scale(0.95);
}

.carousel__slide--next {
  opacity: 1;
  transform: rotateY(10deg) scale(0.95);
}

.carousel__slide--active {
  opacity: 1;
  transform: rotateY(0) scale(1.1);
}

/* Aligner le contenu à gauche */
.link-list {
  text-align: left;
}

/* Ajouter un espace entre chaque élément de la liste */
.link-list li {
  margin-bottom: 10px; /* Ajustez cette valeur selon vos besoins */
}

/* Aligner l'image avec le texte */
.logo__kb_icon {
  vertical-align: middle;
}

.box.content {
    max-height: 500px; /* Ajustez selon vos besoins */
    overflow-y: auto; /* Pour permettre le défilement vertical */
    border: 1px solid #ccc; /* Juste pour visualiser la box */
    padding: 10px; /* Espacement interne */
}

.chevron {
    display: inline-block;
    margin-left: 10px;
  margin-bottom: 5px;
    width: 10px;
    height: 10px;
    border-left: 2px solid currentColor;
    border-bottom: 2px solid currentColor;
    transform: rotate(-45deg);
    transition: transform 0.3s ease;
}

.chevron.up {
    transform: rotate(135deg);
  margin-bottom: 0px;
}

</style>